"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createCategory, updateCategory } from "@/lib/category-actions"
import { IconPicker } from "./icon-picker"
import { IconDisplay } from "./icon-display"
import type { Category } from "@/lib/db"
import { X, Palette } from "lucide-react"

interface CategoryFormProps {
  category?: Category
  onClose: () => void
}

const colorOptions = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Red", value: "#EF4444" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
]

export function CategoryForm({ category, onClose }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<{
    type: "predefined" | "uploaded" | "custom";
    value: string;
  }>({
    type: category?.icon_type || "predefined",
    value: category?.icon || "folder",
  })
  const [selectedColor, setSelectedColor] = useState(category?.color || "#3B82F6")

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      formData.append("icon", selectedIcon.value)
      formData.append("icon_type", selectedIcon.type)
      formData.append("color", selectedColor)

      if (category) {
        formData.append("id", category.id.toString())
        await updateCategory(formData)
      } else {
        await createCategory(formData)
      }
      onClose()
    } catch (error) {
      console.error("Failed to save category:", error)
      alert(error instanceof Error ? error.message : "Failed to save category")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleIconSelect = (iconType: "predefined" | "uploaded" | "custom", iconValue: string) => {
    setSelectedIcon({ type: iconType, value: iconValue })
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <>
      {/* Modal Backdrop with highest z-index */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999]"
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }}
      >
        {/* Centered Modal Container */}
        <div
          className="flex items-center justify-center min-h-screen min-w-full p-4"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
        >
          {/* Modal Card */}
          <Card
            className="w-full max-w-md bg-slate-900/98 border-slate-700/80 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-300 relative"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(148, 163, 184, 0.1)",
              backdropFilter: "blur(20px)",
              zIndex: 10001,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/50">
              <CardTitle className="text-slate-100 text-lg font-semibold">
                {category ? "Edit Category" : "Add New Category"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-slate-700/50 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <form action={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200 text-sm font-medium">
                    Category Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={category?.name}
                    placeholder="Enter category name"
                    required
                    autoFocus
                    className="bg-slate-800/80 border-slate-600/60 text-slate-100 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-sm font-medium">Icon</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowIconPicker(true)}
                    className="w-full justify-start gap-3 bg-slate-800/80 border-slate-600/60 text-slate-100 hover:bg-slate-700/80 hover:border-slate-500/60 transition-all"
                  >
                    <IconDisplay iconType={selectedIcon.type} iconValue={selectedIcon.value} className="h-4 w-4" />
                    <span>Choose Icon</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-200 text-sm font-medium">Color</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className={`
                          w-full h-12 rounded-xl border-2 transition-all duration-200 flex items-center justify-center
                          hover:scale-105 active:scale-95
                          ${
                            selectedColor === color.value
                              ? "border-white shadow-lg shadow-black/20 scale-105 ring-2 ring-white/20"
                              : "border-slate-600/60 hover:border-slate-400/80"
                          }
                        `}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {selectedColor === color.value && <Palette className="h-4 w-4 text-white drop-shadow-sm" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : category ? (
                      "Update Category"
                    ) : (
                      "Create Category"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="border-slate-600/60 text-slate-300 hover:bg-slate-700/50 hover:text-white bg-transparent transition-all disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Icon Picker with even higher z-index */}
      {showIconPicker && (
        <div style={{ zIndex: 10002 }}>
          <IconPicker
            isOpen={showIconPicker}
            onClose={() => setShowIconPicker(false)}
            onSelect={handleIconSelect}
            currentIcon={selectedIcon}
          />
        </div>
      )}
    </>
  )
}
