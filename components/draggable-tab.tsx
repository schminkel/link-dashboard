"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { IconDisplay } from "./icon-display"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Category } from "@/lib/db"
import { MoreVertical, Edit, Trash2, GripVertical, Check } from "lucide-react"
import { ReorderSpinner } from "./reorder-spinner"

interface DraggableTabProps {
  category: Category
  isActive: boolean
  linkCount: number
  onCategoryChange: (categoryId: number) => void
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onDragEnd: () => void
  temporaryOrder?: number
  isDragging?: boolean
  isReordering?: boolean
  showSuccessIndicator?: boolean
}

export function DraggableTab({
  category,
  isActive,
  linkCount,
  onCategoryChange,
  onEdit,
  onDelete,
  onDragEnd,
  temporaryOrder,
  isDragging = false,
  isReordering = false,
  showSuccessIndicator = false,
}: DraggableTabProps) {
  const [dragStarted, setDragStarted] = useState(false)
  const tabRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: React.DragEvent) => {
    console.log("Tab drag start:", category.name)
    setDragStarted(true)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", category.id.toString())
    e.dataTransfer.setData("application/json", JSON.stringify(category))
  }

  const handleDragEnd = (e: React.DragEvent) => {
    console.log("Tab drag end:", category.name)
    setDragStarted(false)
    onDragEnd()
  }

  const hasTemporaryOrder = temporaryOrder !== undefined

  return (
    <div
      ref={tabRef}
      className={`
        relative group shrink-0 transition-all duration-300 ease-in-out
        ${dragStarted || isDragging ? "opacity-50 scale-95 z-50" : ""}
        ${isReordering ? "animate-pulse" : ""}
        ${hasTemporaryOrder ? "ring-2 ring-blue-400/50 shadow-lg shadow-blue-400/20" : ""}
        ${showSuccessIndicator ? "ring-2 ring-green-400/50 shadow-lg shadow-green-400/20" : ""}
      `}
      draggable={!isReordering}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-category-id={category.id}
    >
      {/* Drag Handle - Top Left */}
      <div
        className={`
          absolute -top-1 -left-1 z-20 p-1 bg-slate-800/90 border border-slate-600/50 rounded-md backdrop-blur-sm
          cursor-grab active:cursor-grabbing transition-all duration-200 shadow-lg
          ${isReordering ? "opacity-30 cursor-not-allowed" : "opacity-0 group-hover:opacity-100 hover:bg-slate-700/90"}
        `}
        onMouseDown={(e) => e.stopPropagation()}
        title="Drag to reorder tabs"
      >
        <GripVertical className="h-3 w-3 text-slate-300" />
      </div>

      {/* Loading/Success Overlay */}
      {(isReordering || showSuccessIndicator) && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-30">
          {isReordering ? (
            <div className="flex items-center gap-1 text-blue-300">
              <ReorderSpinner size="sm" />
              <span className="text-xs font-medium">Updating...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-green-300">
              <Check className="h-3 w-3" />
              <span className="text-xs font-medium">Updated!</span>
            </div>
          )}
        </div>
      )}

      {/* Main Tab Button */}
      <Button
        variant={isActive ? "default" : "ghost"}
        onClick={() => onCategoryChange(category.id)}
        disabled={isReordering}
        className={`
          relative h-12 px-4 rounded-lg transition-all duration-200 flex items-center gap-3
          ${
            isActive ? "bg-linear-to-r text-white shadow-lg" : "text-slate-300 hover:text-white hover:bg-slate-800/50"
          }
          ${isReordering ? "opacity-75 cursor-not-allowed" : ""}
        `}
        style={
          isActive
            ? {
                backgroundImage: `linear-gradient(135deg, ${category.color}dd, ${category.color}aa)`,
                boxShadow: `0 4px 20px ${category.color}40`,
              }
            : {}
        }
      >
        <IconDisplay 
          iconType={category.icon_type || "predefined"} 
          iconValue={category.icon} 
          className="h-4 w-4" 
        />
        <span className="font-medium whitespace-nowrap">{category.name}</span>
        {linkCount > 0 && (
          <span
            className={`
              text-xs px-2 py-0.5 rounded-full font-medium
              ${isActive ? "bg-white/20 text-white" : "bg-slate-700 text-slate-300"}
            `}
          >
            {linkCount}
          </span>
        )}
      </Button>

      {/* Category Actions - Top Right */}
      {category.id !== 1 && (
        <div
          className={`
            absolute -top-1 -right-1 z-20 transition-all duration-200
            ${isReordering ? "opacity-30" : "opacity-0 group-hover:opacity-100"}
          `}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={isReordering}
                className="h-6 w-6 p-0 bg-slate-800/90 border border-slate-600/50 backdrop-blur-sm hover:bg-slate-700/90 rounded-full disabled:opacity-50"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
              <DropdownMenuItem
                onClick={() => onEdit(category)}
                className="text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(category)}
                className="text-red-300 hover:text-red-200 hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
