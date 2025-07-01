"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface TabDragDropContextType {
  draggedTab: number | null
  setDraggedTab: (id: number | null) => void
  dragOverTab: number | null
  setDragOverTab: (id: number | null) => void
  dropPosition: "before" | "after" | null
  setDropPosition: (position: "before" | "after" | null) => void
}

const TabDragDropContext = createContext<TabDragDropContextType | undefined>(undefined)

export function TabDragDropProvider({ children }: { children: ReactNode }) {
  const [draggedTab, setDraggedTab] = useState<number | null>(null)
  const [dragOverTab, setDragOverTab] = useState<number | null>(null)
  const [dropPosition, setDropPosition] = useState<"before" | "after" | null>(null)

  return (
    <TabDragDropContext.Provider
      value={{
        draggedTab,
        setDraggedTab,
        dragOverTab,
        setDragOverTab,
        dropPosition,
        setDropPosition,
      }}
    >
      {children}
    </TabDragDropContext.Provider>
  )
}

export function useTabDragDrop() {
  const context = useContext(TabDragDropContext)
  if (context === undefined) {
    throw new Error("useTabDragDrop must be used within a TabDragDropProvider")
  }
  return context
}
