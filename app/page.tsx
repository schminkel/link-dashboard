"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LinkForm } from "@/components/link-form"
import { TabNavigation } from "@/components/tab-navigation"
import { EnhancedBackground } from "@/components/enhanced-background"
import { getLinksByCategory } from "@/lib/actions"
import { getCategories } from "@/lib/category-actions"
import type { Link, Category } from "@/lib/db"
import { Plus, LinkIcon, FolderOpen } from "lucide-react"
import { DraggableGrid } from "@/components/draggable-grid"
import { IconDisplay } from "@/components/icon-display"

export default function HomePage() {
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

      // Load link counts for all categories
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
    loadLinkCounts(categories) // Refresh counts
  }

  const handleCategoryChange = (categoryId: number) => {
    setActiveCategory(categoryId)
  }

  const handleOrderChange = () => {
    loadLinksForCategory(activeCategory)
  }

  const handleCategoriesChange = () => {
    loadInitialData() // Reload everything when categories change
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
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/20 rounded-xl backdrop-blur-sm border border-blue-500/20">
                <LinkIcon className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-100">Links Dashboard</h1>
                <p className="text-slate-400">Organize your links with custom categories and icons</p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 backdrop-blur-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        </div>

        {/* Tab Navigation with Drag & Drop */}
        <TabNavigation
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          linkCounts={linkCounts}
          onCategoriesChange={handleCategoriesChange}
        />

        {/* Content Area */}
        <div className="container mx-auto px-4 py-8">
          {/* Category Header */}
          {activeCategory_data && (
            <div className="flex items-center gap-4 mb-6">
              <div
                className="p-3 rounded-xl backdrop-blur-sm border"
                style={{
                  backgroundColor: `${activeCategory_data.color}20`,
                  borderColor: `${activeCategory_data.color}40`,
                }}
              >
                <IconDisplay
                  iconType="predefined"
                  iconValue={activeCategory_data.icon}
                  className="h-6 w-6"
                  style={{ color: activeCategory_data.color }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100">{activeCategory_data.name}</h2>
                <p className="text-slate-400">
                  {links.length} {links.length === 1 ? "link" : "links"} in this category
                  <span className="text-slate-500 ml-2">• Drag tabs to reorder</span>
                </p>
              </div>
            </div>
          )}

          {/* Links Grid */}
          {links.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl inline-block mb-4 border border-slate-700/50">
                <FolderOpen className="h-12 w-12 text-slate-500 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No links in this category</h3>
              <p className="text-slate-500 mb-4">Add your first link to get started</p>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Link to {activeCategory_data?.name}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Drag and drop to reorder your links</p>
                  <p className="text-xs text-slate-500 mt-1">Changes are saved automatically</p>
                </div>
              </div>
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
