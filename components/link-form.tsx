"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createLink, updateLink } from "@/lib/actions"
import { getCategories } from "@/lib/category-actions"
import { IconPicker } from "./icon-picker"
import { IconDisplay } from "./icon-display"
import type { Link, Category } from "@/lib/db"
import { X, ImageIcon } from "lucide-react"

interface LinkFormProps {
  link?: Link
  onClose: () => void
  defaultCategoryId?: number
}

export function LinkForm({ link, onClose, defaultCategoryId }: LinkFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    (link?.category_id || defaultCategoryId || 1).toString(),
  )
  const [selectedIcon, setSelectedIcon] = useState({
    type: (link?.icon_type || "predefined") as "predefined" | "uploaded" | "custom",
    value: link?.icon_value || "link",
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories as Category[])
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      formData.append("iconType", selectedIcon.type)
      formData.append("iconValue", selectedIcon.value)
      formData.append("categoryId", selectedCategoryId)

      if (link) {
        formData.append("id", link.id.toString())
        await updateLink(formData)
      } else {
        await createLink(formData)
      }
      onClose()
    } catch (error) {
      console.error("Failed to save link:", error)
      alert(error instanceof Error ? error.message : "Failed to save link")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleIconSelect = (iconType: "predefined" | "uploaded" | "custom", iconValue: string) => {
    setSelectedIcon({ type: iconType, value: iconValue })
  }

  const selectedCategory = categories.find((cat) => cat.id.toString() === selectedCategoryId)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-slate-900/95 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-100">{link ? "Edit Link" : "Add New Link"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-200">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={link?.title}
                placeholder="Enter link title"
                required
                className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-slate-200">
                URL
              </Label>
              <Input
                id="url"
                name="url"
                type="url"
                defaultValue={link?.url}
                placeholder="https://example.com"
                required
                className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Category</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                  <SelectValue>
                    {selectedCategory && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedCategory.color }} />
                        <IconDisplay iconType="predefined" iconValue={selectedCategory.icon} className="h-4 w-4" />
                        <span>{selectedCategory.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                      className="text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <IconDisplay iconType="predefined" iconValue={category.icon} className="h-4 w-4" />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Icon</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowIconPicker(true)}
                className="w-full justify-start gap-3 bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700"
              >
                <IconDisplay iconType={selectedIcon.type} iconValue={selectedIcon.value} className="h-4 w-4" />
                <span>Choose Icon</span>
                <ImageIcon className="h-4 w-4 ml-auto" />
              </Button>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? "Saving..." : link ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <IconPicker
        isOpen={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelect={handleIconSelect}
        currentIcon={selectedIcon}
      />
    </div>
  )
}
