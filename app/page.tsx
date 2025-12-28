"use client"

import { useState, useEffect } from "react"
import { LinkForm } from "@/components/link-form"
import { CompactTabNavigation } from "@/components/compact-tab-navigation"
import { CompactHeader } from "@/components/compact-header"
import { EnhancedBackground } from "@/components/enhanced-background"
import { PasswordProtection } from "@/components/password-protection"
import { getLinksByCategory } from "@/lib/actions"
import { getCategories } from "@/lib/category-actions"
import type { Link, Category } from "@/lib/db"
import { Plus, FolderOpen } from "lucide-react"
import { DraggableGrid } from "@/components/draggable-grid"
import { Button } from "@/components/ui/button"

function DashboardContent() {
  const [links, setLinks] = useState<Link[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<number>(1)
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | undefined>()
  const [loading, setLoading] = useState(true)
  const [linkCounts, setLinkCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadLinksForCategory(activeCategory)
  }, [activeCategory])

  const loadInitialData = async () => {
    try {
      const [fetchedCategories] = await Promise.all([getCategories()])

      const categoriesData = fetchedCategories as Category[]
      setCategories(categoriesData)

      if (categoriesData.length > 0) {
        setActiveCategory(categoriesData[0].id)
      }

      await loadLinkCounts(categoriesData)
    } catch (error) {
      console.error("Failed to load initial data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadLinkCounts = async (categoriesData: Category[]) => {
    try {
      const counts: Record<number, number> = {}

      for (const category of categoriesData) {
        const categoryLinks = await getLinksByCategory(category.id)
        counts[category.id] = categoryLinks.length
      }

      setLinkCounts(counts)
    } catch (error) {
      console.error("Failed to load link counts:", error)
    }
  }

  const loadLinksForCategory = async (categoryId: number) => {
    try {
      const fetchedLinks = await getLinksByCategory(categoryId)
      setLinks(fetchedLinks as Link[])
    } catch (error) {
      console.error("Failed to load links:", error)
    }
  }

  const handleEdit = (link: Link) => {
    setEditingLink(link)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingLink(undefined)
    loadLinksForCategory(activeCategory)
    loadLinkCounts(categories)
  }

  const handleCategoryChange = (categoryId: number) => {
    setActiveCategory(categoryId)
  }

  const handleOrderChange = () => {
    loadLinksForCategory(activeCategory)
  }

  const handleCategoriesChange = () => {
    loadInitialData()
  }

  const activeCategory_data = categories.find((cat) => cat.id === activeCategory)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedBackground />
        <div className="text-slate-300">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <EnhancedBackground />
      <div className="relative">
        {/* Compact Header */}
        <CompactHeader onAddLink={() => setShowForm(true)} />

        {/* Compact Tab Navigation */}
        <CompactTabNavigation
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          linkCounts={linkCounts}
          onCategoriesChange={handleCategoriesChange}
        />

        {/* Main Content - Focused on Links */}
        <div className="container mx-auto px-4 py-4">
          {/* Links Grid - Maximum Focus */}
          {links.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-slate-800/30 backdrop-blur-sm rounded-xl inline-block mb-4 border border-slate-700/50">
                <FolderOpen className="h-10 w-10 text-slate-500 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No links yet</h3>
              <p className="text-slate-500 mb-4 text-sm">
                {activeCategory_data ? `Add your first link to ${activeCategory_data.name}` : "Add your first link"}
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          ) : (
            <div className="space-y-4">


              {/* Enhanced Grid Layout */}
              <DraggableGrid links={links} onEdit={handleEdit} onOrderChange={handleOrderChange} />
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showForm && <LinkForm link={editingLink} onClose={handleCloseForm} defaultCategoryId={activeCategory} />}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <PasswordProtection>
      <DashboardContent />
    </PasswordProtection>
  )
}
