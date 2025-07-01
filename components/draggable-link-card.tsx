"use client"

import React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Edit, Trash2, GripVertical, Check } from "lucide-react"
import { IconDisplay } from "./icon-display"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { useDragDrop } from "./drag-drop-context"
import { useReorderLoading } from "./reorder-loading-context"
import { ReorderSpinner } from "./reorder-spinner"
import type { Link } from "@/lib/db"

interface DraggableLinkCardProps {
  link: Link
  onEdit: (link: Link) => void
  onDragEnd: () => void
  temporaryOrder?: number
}

export function DraggableLinkCard({ link, onEdit, onDragEnd, temporaryOrder }: DraggableLinkCardProps) {
  const [isClicked, setIsClicked] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const { draggedItem, setDraggedItem, dragOverItem, setDragOverItem, dropPosition, setDropPosition } = useDragDrop()
  const { isReordering, reorderingItems } = useReorderLoading()

  const isItemReordering = reorderingItems.has(link.id)
  const hasTemporaryOrder = temporaryOrder !== undefined

  const handleCardClick = () => {
    if (isDragging || isReordering) return
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)
    window.open(link.url, "_blank", "noopener,noreferrer")
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(link)
  }

  const handleDragStart = (e: React.DragEvent) => {
    console.log("Drag start for link:", link.id)
    if (isReordering) {
      e.preventDefault()
      return
    }

    setIsDragging(true)
    setDraggedItem(link.id)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", link.id.toString())
  }

  const handleDragEnd = (e: React.DragEvent) => {
    console.log("Drag end for link:", link.id)
    setIsDragging(false)
    onDragEnd()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    if (draggedItem === link.id || isReordering) return

    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    const midpoint = rect.left + rect.width / 2
    const position = e.clientX < midpoint ? "before" : "after"

    setDragOverItem(link.id)
    setDropPosition(position)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    const { clientX, clientY } = e
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      if (dragOverItem === link.id) {
        setDragOverItem(null)
        setDropPosition(null)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    console.log("Drop on link:", link.id)
  }

  // Show success indicator when reordering completes
  React.useEffect(() => {
    if (!isItemReordering && reorderingItems.size === 0 && hasTemporaryOrder) {
      setShowSuccessIndicator(true)
      const timer = setTimeout(() => setShowSuccessIndicator(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [isItemReordering, reorderingItems.size, hasTemporaryOrder])

  const showDropIndicator = dragOverItem === link.id && draggedItem !== link.id && !isReordering
  const isBeingDragged = draggedItem === link.id

  return (
    <>
      <div className="relative group">
        {/* Drop indicator lines */}
        {showDropIndicator && dropPosition === "before" && (
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-10 animate-pulse shadow-lg shadow-blue-500/50" />
        )}
        {showDropIndicator && dropPosition === "after" && (
          <div className="absolute -right-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-10 animate-pulse shadow-lg shadow-blue-500/50" />
        )}

        {/* Drag Handle - Top Left Corner */}
        <div
          className={`
            absolute -top-2 -left-2 z-20 p-2 bg-slate-800/90 border border-slate-600/50 rounded-lg backdrop-blur-sm
            cursor-grab active:cursor-grabbing transition-all duration-200 shadow-lg
            ${isReordering ? "opacity-30 cursor-not-allowed" : "opacity-0 group-hover:opacity-100 hover:bg-slate-700/90"}
          `}
          draggable={!isReordering}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onMouseDown={(e) => e.stopPropagation()}
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-slate-300" />
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div
          className={`
            absolute -top-2 -right-2 z-20 flex gap-1 transition-all duration-200
            ${isReordering ? "opacity-30" : "opacity-0 group-hover:opacity-100"}
          `}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            disabled={isReordering}
            className="h-8 w-8 p-0 bg-slate-800/90 border border-slate-600/50 backdrop-blur-sm hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/50 disabled:opacity-50 shadow-lg"
            title="Edit link"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isReordering}
            className="h-8 w-8 p-0 bg-slate-800/90 border border-slate-600/50 backdrop-blur-sm hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 disabled:opacity-50 shadow-lg"
            title="Delete link"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        <Card
          ref={cardRef}
          data-link-id={link.id}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            cursor-pointer transition-all duration-300 ease-in-out relative overflow-hidden
            bg-gradient-to-br from-slate-900/60 to-slate-800/40 
            border-slate-700/50 backdrop-blur-sm
            hover:border-blue-500/50 hover:shadow-2xl
            hover:shadow-blue-500/20 hover:-translate-y-2
            active:scale-95
            ${isClicked ? "animate-click-effect" : ""}
            ${isBeingDragged ? "opacity-50 scale-95" : ""}
            ${showDropIndicator ? "ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20" : ""}
            ${isItemReordering ? "ring-2 ring-blue-400/50 shadow-lg shadow-blue-400/20" : ""}
            ${hasTemporaryOrder ? "border-blue-400/70 bg-gradient-to-br from-blue-900/20 to-slate-800/40" : ""}
            ${showSuccessIndicator ? "ring-2 ring-green-400/50 shadow-lg shadow-green-400/20" : ""}
            ${isReordering && !isItemReordering ? "opacity-75" : ""}
          `}
          onClick={handleCardClick}
        >
          {/* Loading overlay for reordering items */}
          {isItemReordering && (
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-30">
              <div className="flex items-center gap-2 text-blue-300">
                <ReorderSpinner size="sm" />
                <span className="text-sm font-medium">Updating...</span>
              </div>
            </div>
          )}

          {/* Success indicator overlay */}
          {showSuccessIndicator && (
            <div className="absolute inset-0 bg-green-900/20 backdrop-blur-sm rounded-lg flex items-center justify-center z-30 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-green-300">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Updated!</span>
              </div>
            </div>
          )}

          {/* Drop zone overlay */}
          {showDropIndicator && (
            <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm rounded-lg border-2 border-dashed border-blue-500/50 flex items-center justify-center z-25">
              <div className="flex items-center gap-2 text-blue-300 font-medium">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                Drop here
              </div>
            </div>
          )}

          {/* Main Content Area - No space taken by controls */}
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={`flex-shrink-0 p-3 bg-slate-800/50 rounded-xl transition-colors ${
                  isItemReordering ? "bg-blue-500/20" : "group-hover:bg-blue-500/20"
                }`}
              >
                <IconDisplay
                  iconType={link.icon_type}
                  iconValue={link.icon_value}
                  className={`h-6 w-6 transition-colors ${
                    isItemReordering ? "text-blue-300" : "text-slate-400 group-hover:text-blue-300"
                  }`}
                />
              </div>

              {/* Title - Full width available */}
              <div className="flex-1 min-w-0">
                <CardTitle
                  className={`text-xl font-semibold transition-colors leading-tight ${
                    isItemReordering ? "text-blue-300" : "text-slate-100 group-hover:text-blue-300"
                  }`}
                >
                  {link.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* URL with full width */}
            <div
              className={`flex items-center gap-2 text-sm transition-colors ${
                isItemReordering ? "text-slate-300" : "text-slate-400 group-hover:text-slate-300"
              }`}
            >
              <ExternalLink className="h-4 w-4 flex-shrink-0" />
              <span className="truncate font-medium">{link.url}</span>
            </div>

            {/* Additional space for potential metadata */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Click to open</span>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmationDialog link={link} isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
    </>
  )
}
