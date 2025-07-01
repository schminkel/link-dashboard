"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CategoryForm } from "./category-form"
import { DraggableTab } from "./draggable-tab"
import { TabDragDropProvider, useTabDragDrop } from "./tab-drag-drop-context"
import { TabReorderLoadingProvider, useTabReorderLoading } from "./tab-reorder-loading-context"
import { deleteCategory, updateCategoriesOrder } from "@/lib/category-actions"
import { ReorderSpinner } from "./reorder-spinner"
import type { Category } from "@/lib/db"
import { Plus } from "lucide-react"

interface CompactTabNavigationProps {
  categories: Category[]
  activeCategory: number
  onCategoryChange: (categoryId: number) => void
  linkCounts: Record<number, number>
  onCategoriesChange: () => void
}

function CompactTabNavigationContent({
  categories,
  activeCategory,
  onCategoryChange,
  linkCounts,
  onCategoriesChange,
}: CompactTabNavigationProps) {
  const [localCategories, setLocalCategories] = useState(categories)
  const [temporaryOrder, setTemporaryOrder] = useState<Map<number, number>>(new Map())
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [successTabs, setSuccessTabs] = useState<Set<number>>(new Set())

  const { draggedTab, dragOverTab, dropPosition, setDraggedTab, setDragOverTab, setDropPosition } = useTabDragDrop()
  const { isReordering, setIsReordering, reorderingTabs, addReorderingTab, setReorderingTabs } = useTabReorderLoading()

  const reorderTimeoutRef = useRef<NodeJS.Timeout>()
  const dropZoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isReordering && !draggedTab) {
      setLocalCategories(categories)
    }
  }, [categories, isReordering, draggedTab])

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowCategoryForm(true)
  }

  const handleDeleteCategory = async (category: Category) => {
    if (category.id === 1) {
      alert("Cannot delete the default category")
      return
    }

    const linkCount = linkCounts[category.id] || 0
    const confirmMessage =
      linkCount > 0
        ? `This category contains ${linkCount} link(s). They will be moved to the General category. Are you sure?`
        : "Are you sure you want to delete this category?"

    if (confirm(confirmMessage)) {
      try {
        await deleteCategory(category.id)
        if (activeCategory === category.id) {
          onCategoryChange(1)
        }
        onCategoriesChange()
      } catch (error) {
        console.error("Failed to delete category:", error)
        alert("Failed to delete category")
      }
    }
  }

  const handleCloseForm = () => {
    setShowCategoryForm(false)
    setEditingCategory(undefined)
    onCategoriesChange()
  }

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"

      if (!draggedTab || isReordering) return

      const dropZone = dropZoneRef.current
      if (!dropZone) return

      const tabElements = Array.from(dropZone.querySelectorAll("[data-category-id]"))
      let targetTab: Element | null = null
      let targetPosition: "before" | "after" = "after"

      for (const element of tabElements) {
        const rect = element.getBoundingClientRect()
        const midpoint = rect.left + rect.width / 2

        if (e.clientX >= rect.left && e.clientX <= rect.right) {
          targetTab = element
          targetPosition = e.clientX < midpoint ? "before" : "after"
          break
        }
      }

      if (targetTab) {
        const targetId = Number.parseInt(targetTab.getAttribute("data-category-id") || "0")
        if (targetId && targetId !== draggedTab) {
          setDragOverTab(targetId)
          setDropPosition(targetPosition)
        }
      }
    },
    [draggedTab, isReordering, setDragOverTab, setDropPosition],
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      const dropZone = dropZoneRef.current
      if (!dropZone) return

      const rect = dropZone.getBoundingClientRect()
      const { clientX, clientY } = e

      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
        setDragOverTab(null)
        setDropPosition(null)
      }
    },
    [setDragOverTab, setDropPosition],
  )

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleTabDragEnd = useCallback(async () => {
    if (!draggedTab || !dragOverTab || draggedTab === dragOverTab) {
      setDraggedTab(null)
      setDragOverTab(null)
      setDropPosition(null)
      return
    }

    const draggedIndex = localCategories.findIndex((cat) => cat.id === draggedTab)
    const targetIndex = localCategories.findIndex((cat) => cat.id === dragOverTab)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedTab(null)
      setDragOverTab(null)
      setDropPosition(null)
      return
    }

    const newCategories = [...localCategories]
    const [draggedCategory] = newCategories.splice(draggedIndex, 1)

    const insertIndex = dropPosition === "before" ? targetIndex : targetIndex + 1
    const adjustedIndex = insertIndex > draggedIndex ? insertIndex - 1 : insertIndex

    newCategories.splice(adjustedIndex, 0, draggedCategory)

    const tempOrderMap = new Map<number, number>()
    newCategories.forEach((category, index) => {
      tempOrderMap.set(category.id, index)
    })
    setTemporaryOrder(tempOrderMap)

    setLocalCategories(newCategories)

    setDraggedTab(null)
    setDragOverTab(null)
    setDropPosition(null)

    setIsReordering(true)
    addReorderingTab(draggedTab)
    addReorderingTab(dragOverTab)

    if (reorderTimeoutRef.current) {
      clearTimeout(reorderTimeoutRef.current)
    }

    try {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 800))
      const categoryIds = newCategories.map((category) => category.id)
      const updatePromise = updateCategoriesOrder(categoryIds)

      await Promise.all([updatePromise, minDelay])

      setTemporaryOrder(new Map())
      setSuccessTabs(new Set([draggedTab, dragOverTab]))
      reorderTimeoutRef.current = setTimeout(() => {
        setSuccessTabs(new Set())
        setReorderingTabs(new Set())
        setIsReordering(false)
        onCategoriesChange()
      }, 1000)
    } catch (error) {
      console.error("Failed to update tab order:", error)
      setLocalCategories(categories)
      setTemporaryOrder(new Map())
      setReorderingTabs(new Set())
      setIsReordering(false)
      alert("Failed to update tab order. Please try again.")
    }
  }, [
    draggedTab,
    dragOverTab,
    dropPosition,
    localCategories,
    categories,
    onCategoriesChange,
    setIsReordering,
    addReorderingTab,
    setReorderingTabs,
    setDraggedTab,
    setDragOverTab,
    setDropPosition,
  ])

  useEffect(() => {
    const handleGlobalDragStart = (e: DragEvent) => {
      const categoryId = e.dataTransfer?.getData("text/plain")
      if (categoryId) {
        setDraggedTab(Number.parseInt(categoryId))
      }
    }

    const handleGlobalDragEnd = () => {
      handleTabDragEnd()
    }

    document.addEventListener("dragstart", handleGlobalDragStart)
    document.addEventListener("dragend", handleGlobalDragEnd)

    return () => {
      document.removeEventListener("dragstart", handleGlobalDragStart)
      document.removeEventListener("dragend", handleGlobalDragEnd)
    }
  }, [handleTabDragEnd, setDraggedTab])

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/30">
      <div className="container mx-auto px-4">
        {isReordering && (
          <div className="flex items-center justify-center gap-2 py-2 bg-blue-900/20 border-b border-blue-500/30">
            <ReorderSpinner size="sm" />
            <p className="text-blue-300 text-xs font-medium">Updating order...</p>
          </div>
        )}

        <div
          ref={dropZoneRef}
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex items-center gap-1 min-w-0 flex-1 relative">
            {localCategories.map((category) => {
              const isTabActive = activeCategory === category.id
              const linkCount = linkCounts[category.id] || 0
              const isTabReordering = reorderingTabs.has(category.id)
              const isTabDragging = draggedTab === category.id
              const showSuccess = successTabs.has(category.id)

              return (
                <div key={category.id} className="relative">
                  {dragOverTab === category.id && dropPosition === "before" && (
                    <div className="absolute -left-1 top-0 bottom-0 w-0.5 bg-blue-500 rounded-full z-10 animate-pulse" />
                  )}

                  <DraggableTab
                    category={category}
                    isActive={isTabActive}
                    linkCount={linkCount}
                    onCategoryChange={onCategoryChange}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                    onDragEnd={handleTabDragEnd}
                    temporaryOrder={temporaryOrder.get(category.id)}
                    isDragging={isTabDragging}
                    isReordering={isTabReordering}
                    showSuccessIndicator={showSuccess}
                  />

                  {dragOverTab === category.id && dropPosition === "after" && (
                    <div className="absolute -right-1 top-0 bottom-0 w-0.5 bg-blue-500 rounded-full z-10 animate-pulse" />
                  )}
                </div>
              )
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCategoryForm(true)}
            disabled={isReordering}
            className="flex-shrink-0 h-8 px-2 text-xs border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800/50 disabled:opacity-50"
          >
            <Plus className="h-3 w-3 mr-1" />
            Tab
          </Button>
        </div>
      </div>

      {showCategoryForm && <CategoryForm category={editingCategory} onClose={handleCloseForm} />}
    </div>
  )
}

export function CompactTabNavigation(props: CompactTabNavigationProps) {
  return (
    <TabReorderLoadingProvider>
      <TabDragDropProvider>
        <CompactTabNavigationContent {...props} />
      </TabDragDropProvider>
    </TabReorderLoadingProvider>
  )
}
