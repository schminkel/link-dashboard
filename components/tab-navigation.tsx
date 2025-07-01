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

interface TabNavigationProps {
  categories: Category[]
  activeCategory: number
  onCategoryChange: (categoryId: number) => void
  linkCounts: Record<number, number>
  onCategoriesChange: () => void
}

function TabNavigationContent({
  categories,
  activeCategory,
  onCategoryChange,
  linkCounts,
  onCategoriesChange,
}: TabNavigationProps) {
  const [localCategories, setLocalCategories] = useState(categories)
  const [temporaryOrder, setTemporaryOrder] = useState<Map<number, number>>(new Map())
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [successTabs, setSuccessTabs] = useState<Set<number>>(new Set())

  const { draggedTab, dragOverTab, dropPosition, setDraggedTab, setDragOverTab, setDropPosition } = useTabDragDrop()
  const { isReordering, setIsReordering, reorderingTabs, addReorderingTab, setReorderingTabs } = useTabReorderLoading()

  const reorderTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Update local categories when props change (but not during reordering)
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
          onCategoryChange(1) // Switch to default category
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

      // Find the tab element under the cursor
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
    console.log("Tab drop event")
  }, [])

  const handleTabDragEnd = useCallback(async () => {
    console.log("Tab drag end handler", { draggedTab, dragOverTab, dropPosition })

    if (!draggedTab || !dragOverTab || draggedTab === dragOverTab) {
      setDraggedTab(null)
      setDragOverTab(null)
      setDropPosition(null)
      return
    }

    const draggedIndex = localCategories.findIndex((cat) => cat.id === draggedTab)
    const targetIndex = localCategories.findIndex((cat) => cat.id === dragOverTab)

    console.log("Tab drag indices", { draggedIndex, targetIndex })

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedTab(null)
      setDragOverTab(null)
      setDropPosition(null)
      return
    }

    // Immediate visual feedback - update local state
    const newCategories = [...localCategories]
    const [draggedCategory] = newCategories.splice(draggedIndex, 1)

    const insertIndex = dropPosition === "before" ? targetIndex : targetIndex + 1
    const adjustedIndex = insertIndex > draggedIndex ? insertIndex - 1 : insertIndex

    newCategories.splice(adjustedIndex, 0, draggedCategory)

    console.log(
      "New tab order",
      newCategories.map((c) => c.name),
    )

    // Set temporary order mapping for visual feedback
    const tempOrderMap = new Map<number, number>()
    newCategories.forEach((category, index) => {
      tempOrderMap.set(category.id, index)
    })
    setTemporaryOrder(tempOrderMap)

    // Update local state immediately for responsive UI
    setLocalCategories(newCategories)

    // Clean up drag state
    setDraggedTab(null)
    setDragOverTab(null)
    setDropPosition(null)

    // Mark affected tabs as reordering
    setIsReordering(true)
    addReorderingTab(draggedTab)
    addReorderingTab(dragOverTab)

    // Clear any existing timeout
    if (reorderTimeoutRef.current) {
      clearTimeout(reorderTimeoutRef.current)
    }

    try {
      // Add a minimum delay to show the loading state
      const minDelay = new Promise((resolve) => setTimeout(resolve, 800))

      const categoryIds = newCategories.map((category) => category.id)
      const updatePromise = updateCategoriesOrder(categoryIds)

      // Wait for both the update and minimum delay
      await Promise.all([updatePromise, minDelay])

      // Success - clear temporary states
      setTemporaryOrder(new Map())

      // Show success state briefly
      setSuccessTabs(new Set([draggedTab, dragOverTab]))
      reorderTimeoutRef.current = setTimeout(() => {
        setSuccessTabs(new Set())
        setReorderingTabs(new Set())
        setIsReordering(false)
        onCategoriesChange()
      }, 1000)
    } catch (error) {
      console.error("Failed to update tab order:", error)

      // Error - revert to original state
      setLocalCategories(categories)
      setTemporaryOrder(new Map())
      setReorderingTabs(new Set())
      setIsReordering(false)

      // Show error notification
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

  // Set up drag events
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
    <div className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Global reordering indicator */}
        {isReordering && (
          <div className="flex items-center justify-center gap-3 py-2 bg-blue-900/20 border-b border-blue-500/30">
            <ReorderSpinner size="sm" />
            <div className="text-center">
              <p className="text-blue-300 text-sm font-medium">Updating tab order...</p>
            </div>
          </div>
        )}

        <div
          ref={dropZoneRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drop indicators */}
          {dragOverTab && dropPosition && (
            <div className="absolute top-0 bottom-0 pointer-events-none z-40">
              <div className="w-1 h-full bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" />
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex items-center gap-2 min-w-0 flex-1 relative">
            {localCategories.map((category) => {
              const isTabActive = activeCategory === category.id
              const linkCount = linkCounts[category.id] || 0
              const isTabReordering = reorderingTabs.has(category.id)
              const isTabDragging = draggedTab === category.id
              const showSuccess = successTabs.has(category.id)

              return (
                <div key={category.id} className="relative">
                  {/* Drop indicator before */}
                  {dragOverTab === category.id && dropPosition === "before" && (
                    <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-10 animate-pulse shadow-lg shadow-blue-500/50" />
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

                  {/* Drop indicator after */}
                  {dragOverTab === category.id && dropPosition === "after" && (
                    <div className="absolute -right-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-10 animate-pulse shadow-lg shadow-blue-500/50" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Add Category Button */}
          <Button
            variant="outline"
            onClick={() => setShowCategoryForm(true)}
            disabled={isReordering}
            className="flex-shrink-0 h-12 px-4 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800/50 hover:border-slate-500 disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tab
          </Button>
        </div>
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && <CategoryForm category={editingCategory} onClose={handleCloseForm} />}
    </div>
  )
}

export function TabNavigation(props: TabNavigationProps) {
  return (
    <TabReorderLoadingProvider>
      <TabDragDropProvider>
        <TabNavigationContent {...props} />
      </TabDragDropProvider>
    </TabReorderLoadingProvider>
  )
}
