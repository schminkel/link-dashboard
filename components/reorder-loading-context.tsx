"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ReorderLoadingContextType {
  isReordering: boolean
  setIsReordering: (loading: boolean) => void
  reorderingItems: Set<number>
  setReorderingItems: (items: Set<number>) => void
  addReorderingItem: (id: number) => void
  removeReorderingItem: (id: number) => void
}

const ReorderLoadingContext = createContext<ReorderLoadingContextType | undefined>(undefined)

export function ReorderLoadingProvider({ children }: { children: ReactNode }) {
  const [isReordering, setIsReordering] = useState(false)
  const [reorderingItems, setReorderingItems] = useState<Set<number>>(new Set())

  const addReorderingItem = (id: number) => {
    setReorderingItems((prev) => new Set([...prev, id]))
  }

  const removeReorderingItem = (id: number) => {
    setReorderingItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  return (
    <ReorderLoadingContext.Provider
      value={{
        isReordering,
        setIsReordering,
        reorderingItems,
        setReorderingItems,
        addReorderingItem,
        removeReorderingItem,
      }}
    >
      {children}
    </ReorderLoadingContext.Provider>
  )
}

export function useReorderLoading() {
  const context = useContext(ReorderLoadingContext)
  if (context === undefined) {
    throw new Error("useReorderLoading must be used within a ReorderLoadingProvider")
  }
  return context
}
