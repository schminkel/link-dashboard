"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface TabReorderLoadingContextType {
  isReordering: boolean
  setIsReordering: (loading: boolean) => void
  reorderingTabs: Set<number>
  setReorderingTabs: (tabs: Set<number>) => void
  addReorderingTab: (id: number) => void
  removeReorderingTab: (id: number) => void
}

const TabReorderLoadingContext = createContext<TabReorderLoadingContextType | undefined>(undefined)

export function TabReorderLoadingProvider({ children }: { children: ReactNode }) {
  const [isReordering, setIsReordering] = useState(false)
  const [reorderingTabs, setReorderingTabs] = useState<Set<number>>(new Set())

  const addReorderingTab = (id: number) => {
    setReorderingTabs((prev) => new Set([...prev, id]))
  }

  const removeReorderingTab = (id: number) => {
    setReorderingTabs((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  return (
    <TabReorderLoadingContext.Provider
      value={{
        isReordering,
        setIsReordering,
        reorderingTabs,
        setReorderingTabs,
        addReorderingTab,
        removeReorderingTab,
      }}
    >
      {children}
    </TabReorderLoadingContext.Provider>
  )
}

export function useTabReorderLoading() {
  const context = useContext(TabReorderLoadingContext)
  if (context === undefined) {
    throw new Error("useTabReorderLoading must be used within a TabReorderLoadingProvider")
  }
  return context
}
