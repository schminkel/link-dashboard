"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { DraggableLinkCard } from "./draggable-link-card"
import { DragDropProvider, useDragDrop } from "./drag-drop-context"
import { ReorderLoadingProvider, useReorderLoading } from "./reorder-loading-context"
import { updateLinksOrder } from "@/lib/drag-drop-actions"
import { ReorderSpinner } from "./reorder-spinner"
import type { Link } from "@/lib/db"

interface DraggableGridProps {
  links: Link[]
  onEdit: (link: Link) => void
  onOrderChange: () => void
}

function DraggableGridContent({ links, onEdit, onOrderChange }: DraggableGridProps) {
  const [localLinks, setLocalLinks] = useState(links)
  const [temporaryOrder, setTemporaryOrder] = useState<Map<number, number>>(new Map())
  const { draggedItem, dragOverItem, dropPosition, setDraggedItem, setDragOverItem, setDropPosition } = useDragDrop()
  const { isReordering, setIsReordering, addReorderingItem, setReorderingItems } = useReorderLoading()
  const reorderTimeoutRef = useRef<NodeJS.Timeout>()

  // Update local links when props change (but not during reordering)
  useEffect(() => {
    if (!isReordering && !draggedItem) {
      setLocalLinks(links)
    }
  }, [links, isReordering, draggedItem])

  const handleDragEnd = useCallback(async () => {
    console.log("Grid handling drag end", { draggedItem, dragOverItem, dropPosition })

    if (!draggedItem || !dragOverItem || draggedItem === dragOverItem) {
      setDraggedItem(null)
      setDragOverItem(null)
      setDropPosition(null)
      return
    }

    const draggedIndex = localLinks.findIndex((link) => link.id === draggedItem)
    const targetIndex = localLinks.findIndex((link) => link.id === dragOverItem)

    console.log("Drag indices", { draggedIndex, targetIndex })

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null)
      setDragOverItem(null)
      setDropPosition(null)
      return
    }

    // Immediate visual feedback - update local state
    const newLinks = [...localLinks]
    const [draggedLink] = newLinks.splice(draggedIndex, 1)

    const insertIndex = dropPosition === "before" ? targetIndex : targetIndex + 1
    const adjustedIndex = insertIndex > draggedIndex ? insertIndex - 1 : insertIndex

    newLinks.splice(adjustedIndex, 0, draggedLink)

    console.log(
      "New order",
      newLinks.map((l) => l.title),
    )

    // Set temporary order mapping for visual feedback
    const tempOrderMap = new Map<number, number>()
    newLinks.forEach((link, index) => {
      tempOrderMap.set(link.id, index)
    })
    setTemporaryOrder(tempOrderMap)

    // Update local state immediately for responsive UI
    setLocalLinks(newLinks)

    // Clean up drag state
    setDraggedItem(null)
    setDragOverItem(null)
    setDropPosition(null)

    // Mark affected items as reordering
    setIsReordering(true)
    addReorderingItem(draggedItem)
    addReorderingItem(dragOverItem)

    // Clear any existing timeout
    if (reorderTimeoutRef.current) {
      clearTimeout(reorderTimeoutRef.current)
    }

    try {
      // Add a minimum delay to show the loading state
      const minDelay = new Promise((resolve) => setTimeout(resolve, 800))

      const linkIds = newLinks.map((link) => link.id)
      const updatePromise = updateLinksOrder(linkIds)

      // Wait for both the update and minimum delay
      await Promise.all([updatePromise, minDelay])

      // Success - clear temporary states
      setTemporaryOrder(new Map())

      // Show success state briefly
      reorderTimeoutRef.current = setTimeout(() => {
        setReorderingItems(new Set())
        setIsReordering(false)
        onOrderChange()
      }, 500)
    } catch (error) {
      console.error("Failed to update order:", error)

      // Error - revert to original state
      setLocalLinks(links)
      setTemporaryOrder(new Map())
      setReorderingItems(new Set())
      setIsReordering(false)

      // Show error notification
      alert("Failed to update order. Please try again.")
    }
  }, [
    draggedItem,
    dragOverItem,
    dropPosition,
    localLinks,
    links,
    onOrderChange,
    setIsReordering,
    addReorderingItem,
    setReorderingItems,
    setDraggedItem,
    setDragOverItem,
    setDropPosition,
  ])

  return (
    <div className="space-y-6">
      {/* Global reordering indicator */}
      {isReordering && (
        <div className="flex items-center justify-center gap-3 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg backdrop-blur-sm">
          <ReorderSpinner size="md" />
          <div className="text-center">
            <p className="text-blue-300 font-medium">Updating link order...</p>
            <p className="text-blue-400/70 text-sm">Please wait while we save your changes</p>
          </div>
        </div>
      )}

      {/* Optimized grid with better spacing for overlay elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
        {localLinks.map((link) => (
          <DraggableLinkCard
            key={link.id}
            link={link}
            onEdit={onEdit}
            onDragEnd={handleDragEnd}
            temporaryOrder={temporaryOrder.get(link.id)}
          />
        ))}
      </div>
    </div>
  )
}

export function DraggableGrid({ links, onEdit, onOrderChange }: DraggableGridProps) {
  return (
    <ReorderLoadingProvider>
      <DragDropProvider>
        <DraggableGridContent links={links} onEdit={onEdit} onOrderChange={onOrderChange} />
      </DragDropProvider>
    </ReorderLoadingProvider>
  )
}
