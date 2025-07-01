"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Link,
  Github,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  Globe,
  Home,
  User,
  Settings,
  Heart,
  Star,
  Bookmark,
  Calendar,
  Camera,
  Music,
  Video,
  File,
  Folder,
  ShoppingCart,
  CreditCard,
  Truck,
  Package,
  X,
  Upload,
  Check,
} from "lucide-react"
import { getCustomIcons, saveCustomIcon, deleteCustomIcon } from "@/lib/custom-icons-actions"
import type { CustomIcon } from "@/lib/db"
import { Trash2 } from "lucide-react"

const predefinedIcons = [
  { name: "link", icon: Link, label: "Link" },
  { name: "github", icon: Github, label: "GitHub" },
  { name: "twitter", icon: Twitter, label: "Twitter" },
  { name: "youtube", icon: Youtube, label: "YouTube" },
  { name: "instagram", icon: Instagram, label: "Instagram" },
  { name: "facebook", icon: Facebook, label: "Facebook" },
  { name: "linkedin", icon: Linkedin, label: "LinkedIn" },
  { name: "mail", icon: Mail, label: "Email" },
  { name: "phone", icon: Phone, label: "Phone" },
  { name: "globe", icon: Globe, label: "Website" },
  { name: "home", icon: Home, label: "Home" },
  { name: "user", icon: User, label: "Profile" },
  { name: "settings", icon: Settings, label: "Settings" },
  { name: "heart", icon: Heart, label: "Favorite" },
  { name: "star", icon: Star, label: "Star" },
  { name: "bookmark", icon: Bookmark, label: "Bookmark" },
  { name: "calendar", icon: Calendar, label: "Calendar" },
  { name: "camera", icon: Camera, label: "Camera" },
  { name: "music", icon: Music, label: "Music" },
  { name: "video", icon: Video, label: "Video" },
  { name: "file", icon: File, label: "File" },
  { name: "folder", icon: Folder, label: "Folder" },
  { name: "shopping-cart", icon: ShoppingCart, label: "Shopping" },
  { name: "credit-card", icon: CreditCard, label: "Payment" },
  { name: "truck", icon: Truck, label: "Delivery" },
  { name: "package", icon: Package, label: "Package" },
]

interface IconPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (iconType: "predefined" | "uploaded" | "custom", iconValue: string) => void
  currentIcon?: { type: "predefined" | "uploaded" | "custom"; value: string }
}

export function IconPicker({ isOpen, onClose, onSelect, currentIcon }: IconPickerProps) {
  const [selectedIcon, setSelectedIcon] = useState(currentIcon?.value || "link")
  const [selectedIconType, setSelectedIconType] = useState<"predefined" | "uploaded" | "custom">(
    currentIcon?.type || "predefined",
  )
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [customIcons, setCustomIcons] = useState<CustomIcon[]>([])
  const [iconName, setIconName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      loadCustomIcons()
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const loadCustomIcons = async () => {
    const icons = await getCustomIcons()
    setCustomIcons(icons as CustomIcon[])
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
        setIconName(file.name.split(".")[0]) // Set default name from filename
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveCustomIcon = async () => {
    if (uploadedImage && iconName.trim()) {
      try {
        await saveCustomIcon(iconName.trim(), uploadedImage)
        setUploadedImage(null)
        setIconName("")
        await loadCustomIcons()
        // Switch to custom icons tab to show the newly saved icon
        setSelectedIconType("custom")
      } catch (error) {
        console.error("Failed to save custom icon:", error)
      }
    }
  }

  const handleDeleteCustomIcon = async (iconId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    if (confirm("Are you sure you want to delete this custom icon?")) {
      try {
        await deleteCustomIcon(iconId)
        await loadCustomIcons()
      } catch (error) {
        console.error("Failed to delete custom icon:", error)
      }
    }
  }

  const handleSelect = () => {
    if (selectedIconType === "uploaded" && uploadedImage) {
      onSelect("uploaded", uploadedImage)
    } else if (selectedIconType === "custom") {
      onSelect("custom", selectedIcon)
    } else {
      onSelect("predefined", selectedIcon)
    }
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md"
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10050,
      }}
    >
      <div
        className="flex items-center justify-center min-h-screen p-4"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10051,
        }}
      >
        <Card
          className="w-full max-w-2xl bg-slate-900/98 border-slate-700/80 animate-in slide-in-from-bottom-4 duration-300 shadow-2xl backdrop-blur-xl"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(148, 163, 184, 0.1)",
            backdropFilter: "blur(20px)",
            zIndex: 10052,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/50">
            <CardTitle className="text-slate-100">Choose Icon</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-slate-700/50 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs
              value={selectedIconType}
              onValueChange={(value) => setSelectedIconType(value as any)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/80">
                <TabsTrigger value="predefined" className="data-[state=active]:bg-slate-700">
                  Predefined Icons
                </TabsTrigger>
                <TabsTrigger value="custom" className="data-[state=active]:bg-slate-700">
                  Custom Icons
                </TabsTrigger>
                <TabsTrigger value="uploaded" className="data-[state=active]:bg-slate-700">
                  Upload New
                </TabsTrigger>
              </TabsList>

              <TabsContent value="predefined" className="mt-4">
                <div className="grid grid-cols-6 gap-3 max-h-80 overflow-y-auto">
                  {predefinedIcons.map((iconItem) => {
                    const IconComponent = iconItem.icon
                    return (
                      <button
                        key={iconItem.name}
                        onClick={() => {
                          setSelectedIcon(iconItem.name)
                          setUploadedImage(null)
                        }}
                        className={`
                          p-3 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1
                          ${
                            selectedIcon === iconItem.name && selectedIconType === "predefined"
                              ? "border-blue-500 bg-blue-500/20 text-blue-300"
                              : "border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                          }
                        `}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="text-xs truncate w-full">{iconItem.label}</span>
                      </button>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="mt-4">
                <div className="space-y-4">
                  {customIcons.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                      <p>No custom icons yet</p>
                      <p className="text-sm">Upload your first custom icon to get started</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-6 gap-3 max-h-80 overflow-y-auto">
                      {customIcons.map((icon) => (
                        <div
                          key={icon.id}
                          className={`
                            relative group p-3 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1 cursor-pointer
                            ${
                              selectedIcon === icon.id.toString() && selectedIconType === "custom"
                                ? "border-blue-500 bg-blue-500/20 text-blue-300"
                                : "border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                            }
                          `}
                          onClick={() => setSelectedIcon(icon.id.toString())}
                        >
                          <img
                            src={icon.data_url || "/placeholder.svg"}
                            alt={icon.name}
                            className="w-5 h-5 object-cover rounded"
                          />
                          <span className="text-xs truncate w-full">{icon.name}</span>
                          <button
                            onClick={(e) => handleDeleteCustomIcon(icon.id, e)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="uploaded" className="mt-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                    {uploadedImage ? (
                      <div className="flex flex-col items-center gap-4">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded icon"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="space-y-2 w-full max-w-xs">
                          <Input
                            value={iconName}
                            onChange={(e) => setIconName(e.target.value)}
                            placeholder="Enter icon name"
                            className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={handleSaveCustomIcon}
                              disabled={!iconName.trim()}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              Save to Library
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              Change
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <Upload className="h-12 w-12 text-slate-500" />
                        <div>
                          <p className="text-slate-300 mb-2">Upload a custom icon</p>
                          <p className="text-sm text-slate-500">PNG, JPG, SVG up to 2MB</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-6 border-t border-slate-700/50">
              <Button
                onClick={handleSelect}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={selectedIconType === "uploaded" && !uploadedImage}
              >
                <Check className="h-4 w-4 mr-2" />
                Select Icon
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
