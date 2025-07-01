"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DragDropContextType {
  draggedItem: number | null
  setDraggedItem: (id: number | null) => void
  dragOverItem: number | null
  setDragOverItem: (id: number | null) => void
  dropPosition: "before" | "after" | null
  setDropPosition: (position: "before" | "after" | null) => void
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined)

export function DragDropProvider({ children }: { children: ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [dragOverItem, setDragOverItem] = useState<number | null>(null)
  const [dropPosition, setDropPosition] = useState<"before" | "after" | null>(null)

  return (
    <DragDropContext.Provider
      value={{
        draggedItem,
        setDraggedItem,
        dragOverItem,
        setDragOverItem,
        dropPosition,
        setDropPosition,
      }}
    >
      {children}
    </DragDropContext.Provider>
  )
}

export function useDragDrop() {
  const context = useContext(DragDropContext)
  if (context === undefined) {
    throw new Error("useDragDrop must be used within a DragDropProvider")
  }
  return context
}
