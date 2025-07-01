"use client"

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
} from "lucide-react"
import { getCustomIconById } from "@/lib/custom-icons-actions"
import { useEffect, useState } from "react"

const iconMap = {
  link: Link,
  github: Github,
  twitter: Twitter,
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  mail: Mail,
  phone: Phone,
  globe: Globe,
  home: Home,
  user: User,
  settings: Settings,
  heart: Heart,
  star: Star,
  bookmark: Bookmark,
  calendar: Calendar,
  camera: Camera,
  music: Music,
  video: Video,
  file: File,
  folder: Folder,
  "shopping-cart": ShoppingCart,
  "credit-card": CreditCard,
  truck: Truck,
  package: Package,
}

interface IconDisplayProps {
  iconType: "predefined" | "uploaded" | "custom"
  iconValue: string
  className?: string
}

export function IconDisplay({ iconType, iconValue, className = "h-5 w-5" }: IconDisplayProps) {
  const [customIconData, setCustomIconData] = useState<string | null>(null)

  useEffect(() => {
    if (iconType === "custom") {
      const loadCustomIcon = async () => {
        const icon = await getCustomIconById(Number.parseInt(iconValue))
        if (icon) {
          setCustomIconData(icon.data_url)
        }
      }
      loadCustomIcon()
    }
  }, [iconType, iconValue])

  if (iconType === "uploaded") {
    return (
      <img src={iconValue || "/placeholder.svg"} alt="Custom icon" className={`${className} object-cover rounded`} />
    )
  }

  if (iconType === "custom") {
    return (
      <img
        src={customIconData || "/placeholder.svg"}
        alt="Custom icon"
        className={`${className} object-cover rounded`}
      />
    )
  }

  const IconComponent = iconMap[iconValue as keyof typeof iconMap] || Link
  return <IconComponent className={className} />
}
