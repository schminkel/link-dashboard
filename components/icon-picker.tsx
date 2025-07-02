"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Activity,
  AlarmClock,
  AlertCircle,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  AtSign,
  Award,
  Banknote,
  Barcode,
  Battery,
  Beer,
  Bike,
  Bitcoin,
  Bluetooth,
  Bookmark,
  Building,
  Building2,
  Bus,
  Cake,
  Calendar,
  CalendarDays,
  Camera,
  Car,
  Check,
  CheckCircle,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clipboard,
  Clock,
  Cloud,
  CloudRain,
  CloudSnow,
  Cog,
  Coins,
  Compass,
  Contact,
  Copy,
  CreditCard,
  Crosshair,
  Crown,
  Dice1,
  Dice6,
  DollarSign,
  Download,
  Droplets,
  Edit,
  Edit2,
  Edit3,
  Euro,
  ExternalLink,
  Eye,
  EyeOff,
  Facebook,
  FastForward,
  File,
  FileAudio,
  FileCode,
  FileImage,
  FileMinus,
  FilePlus,
  FileText,
  FileVideo,
  Filter,
  Fingerprint,
  Flame,
  Flower,
  Folder,
  FolderOpen,
  FolderPlus,
  Fuel,
  Gamepad,
  Gamepad2,
  Gift,
  Github,
  Globe,
  Grab,
  Hand,
  Hash,
  Headphones,
  Heart,
  HeartPulse,
  HelpCircle,
  Home,
  Hotel,
  IceCream,
  Info,
  Instagram,
  JapaneseYenIcon as Yen,
  Key,
  Laptop,
  Leaf,
  Lightbulb,
  Link,
  Linkedin,
  Lock,
  Mail,
  Map,
  MapPin,
  Medal,
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  MicOff,
  Minus,
  Monitor,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Move,
  Music,
  Navigation,
  Package,
  Package2,
  Paintbrush,
  Palette,
  Paperclip,
  Pause,
  PenTool,
  Percent,
  Phone,
  Pill,
  Pipette,
  Pizza,
  Plane,
  Play,
  Plus,
  PoundSterling,
  Power,
  Printer,
  QrCode,
  Radio,
  Receipt,
  RefreshCw,
  Rewind,
  RotateCcw,
  RotateCw,
  Ruler,
  Save,
  Scan,
  Scissors,
  Search,
  Send,
  Settings,
  Share,
  Share2,
  Shield,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SkipBack,
  SkipForward,
  Sliders,
  Smartphone,
  SortAsc,
  SortDesc,
  Square,
  Star,
  Stethoscope,
  Store,
  Sun,
  Syringe,
  Tablet,
  Tag,
  Tags,
  Target,
  Thermometer,
  ThermometerSun,
  ThumbsDown,
  ThumbsUp,
  Timer,
  ToggleLeft,
  ToggleRight,
  Train,
  Trash2,
  TreePine,
  Trophy,
  Truck,
  Tv,
  Twitter,
  Unlock,
  Upload,
  Usb,
  User,
  UserCheck,
  UserMinus,
  UserPlus,
  UserX,
  Users,
  Utensils,
  Video,
  Volume2,
  VolumeX,
  Wallet,
  Watch,
  Wifi,
  WifiOff,
  Wind,
  Wine,
  Wrench,
  X,
  XCircle,
  Youtube,
  Zap,
  Coffee,
} from "lucide-react"
import { getCustomIcons, saveCustomIcon, deleteCustomIcon } from "@/lib/custom-icons-actions"
import type { CustomIcon } from "@/lib/db"

const predefinedIcons = [
  // Social & Communication
  { name: "link", icon: Link, label: "Link" },
  { name: "github", icon: Github, label: "GitHub" },
  { name: "twitter", icon: Twitter, label: "Twitter" },
  { name: "youtube", icon: Youtube, label: "YouTube" },
  { name: "instagram", icon: Instagram, label: "Instagram" },
  { name: "facebook", icon: Facebook, label: "Facebook" },
  { name: "linkedin", icon: Linkedin, label: "LinkedIn" },
  { name: "mail", icon: Mail, label: "Email" },
  { name: "phone", icon: Phone, label: "Phone" },
  { name: "message-circle", icon: MessageCircle, label: "Message" },
  { name: "message-square", icon: MessageSquare, label: "Chat" },
  { name: "send", icon: Send, label: "Send" },
  { name: "share", icon: Share, label: "Share" },
  { name: "share-2", icon: Share2, label: "Share Alt" },

  // Navigation & Web
  { name: "globe", icon: Globe, label: "Website" },
  { name: "home", icon: Home, label: "Home" },
  { name: "external-link", icon: ExternalLink, label: "External" },
  { name: "arrow-right", icon: ArrowRight, label: "Arrow Right" },
  { name: "arrow-left", icon: ArrowLeft, label: "Arrow Left" },
  { name: "arrow-up", icon: ArrowUp, label: "Arrow Up" },
  { name: "arrow-down", icon: ArrowDown, label: "Arrow Down" },
  { name: "chevron-right", icon: ChevronRight, label: "Chevron Right" },
  { name: "chevron-left", icon: ChevronLeft, label: "Chevron Left" },
  { name: "chevron-up", icon: ChevronUp, label: "Chevron Up" },
  { name: "chevron-down", icon: ChevronDown, label: "Chevron Down" },
  { name: "menu", icon: Menu, label: "Menu" },
  { name: "more-horizontal", icon: MoreHorizontal, label: "More" },
  { name: "more-vertical", icon: MoreVertical, label: "More Vertical" },

  // User & Profile
  { name: "user", icon: User, label: "Profile" },
  { name: "users", icon: Users, label: "Users" },
  { name: "user-plus", icon: UserPlus, label: "Add User" },
  { name: "user-minus", icon: UserMinus, label: "Remove User" },
  { name: "user-check", icon: UserCheck, label: "User Check" },
  { name: "user-x", icon: UserX, label: "User X" },
  { name: "contact", icon: Contact, label: "Contact" },
  { name: "crown", icon: Crown, label: "Crown" },
  { name: "shield", icon: Shield, label: "Shield" },
  { name: "shield-check", icon: ShieldCheck, label: "Shield Check" },

  // System & Settings
  { name: "settings", icon: Settings, label: "Settings" },
  { name: "cog", icon: Cog, label: "Cog" },
  { name: "wrench", icon: Wrench, label: "Wrench" },
  { name: "pen-tool", icon: PenTool, label: "Tool" },
  { name: "sliders", icon: Sliders, label: "Sliders" },
  { name: "toggle-left", icon: ToggleLeft, label: "Toggle Off" },
  { name: "toggle-right", icon: ToggleRight, label: "Toggle On" },
  { name: "power", icon: Power, label: "Power" },
  { name: "refresh-cw", icon: RefreshCw, label: "Refresh" },
  { name: "rotate-ccw", icon: RotateCcw, label: "Undo" },
  { name: "rotate-cw", icon: RotateCw, label: "Redo" },

  // Files & Documents
  { name: "file", icon: File, label: "File" },
  { name: "file-text", icon: FileText, label: "Document" },
  { name: "file-image", icon: FileImage, label: "Image File" },
  { name: "file-video", icon: FileVideo, label: "Video File" },
  { name: "file-audio", icon: FileAudio, label: "Audio File" },
  { name: "file-code", icon: FileCode, label: "Code File" },
  { name: "file-plus", icon: FilePlus, label: "New File" },
  { name: "file-minus", icon: FileMinus, label: "Remove File" },
  { name: "folder", icon: Folder, label: "Folder" },
  { name: "folder-open", icon: FolderOpen, label: "Open Folder" },
  { name: "folder-plus", icon: FolderPlus, label: "New Folder" },
  { name: "archive", icon: Archive, label: "Archive" },
  { name: "download", icon: Download, label: "Download" },
  { name: "upload", icon: Upload, label: "Upload" },
  { name: "paperclip", icon: Paperclip, label: "Attachment" },
  { name: "save", icon: Save, label: "Save" },

  // Media & Entertainment
  { name: "camera", icon: Camera, label: "Camera" },
  { name: "video", icon: Video, label: "Video" },
  { name: "music", icon: Music, label: "Music" },
  { name: "headphones", icon: Headphones, label: "Headphones" },
  { name: "mic", icon: Mic, label: "Microphone" },
  { name: "mic-off", icon: MicOff, label: "Mic Off" },
  { name: "volume-2", icon: Volume2, label: "Volume" },
  { name: "volume-x", icon: VolumeX, label: "Mute" },
  { name: "play", icon: Play, label: "Play" },
  { name: "pause", icon: Pause, label: "Pause" },
  { name: "square", icon: Square, label: "Stop" },
  { name: "skip-forward", icon: SkipForward, label: "Next" },
  { name: "skip-back", icon: SkipBack, label: "Previous" },
  { name: "fast-forward", icon: FastForward, label: "Fast Forward" },
  { name: "rewind", icon: Rewind, label: "Rewind" },
  { name: "radio", icon: Radio, label: "Radio" },
  { name: "tv", icon: Tv, label: "TV" },
  { name: "monitor", icon: Monitor, label: "Monitor" },
  { name: "smartphone", icon: Smartphone, label: "Phone" },
  { name: "tablet", icon: Tablet, label: "Tablet" },
  { name: "laptop", icon: Laptop, label: "Laptop" },

  // Actions & Status
  { name: "heart", icon: Heart, label: "Favorite" },
  { name: "star", icon: Star, label: "Star" },
  { name: "bookmark", icon: Bookmark, label: "Bookmark" },
  { name: "thumbs-up", icon: ThumbsUp, label: "Like" },
  { name: "thumbs-down", icon: ThumbsDown, label: "Dislike" },
  { name: "plus", icon: Plus, label: "Add" },
  { name: "minus", icon: Minus, label: "Remove" },
  { name: "x", icon: X, label: "Close" },
  { name: "check", icon: Check, label: "Check" },
  { name: "check-circle", icon: CheckCircle, label: "Success" },
  { name: "x-circle", icon: XCircle, label: "Error" },
  { name: "alert-circle", icon: AlertCircle, label: "Warning" },
  { name: "info", icon: Info, label: "Info" },
  { name: "help-circle", icon: HelpCircle, label: "Help" },
  { name: "search", icon: Search, label: "Search" },
  { name: "filter", icon: Filter, label: "Filter" },
  { name: "sort-asc", icon: SortAsc, label: "Sort Asc" },
  { name: "sort-desc", icon: SortDesc, label: "Sort Desc" },

  // Time & Calendar
  { name: "calendar", icon: Calendar, label: "Calendar" },
  { name: "calendar-days", icon: CalendarDays, label: "Calendar Days" },
  { name: "clock", icon: Clock, label: "Clock" },
  { name: "timer", icon: Timer, label: "Timer" },
  { name: "alarm-clock", icon: AlarmClock, label: "Alarm" },
  { name: "watch", icon: Watch, label: "Watch" },

  // Shopping & Commerce
  { name: "shopping-cart", icon: ShoppingCart, label: "Shopping" },
  { name: "shopping-bag", icon: ShoppingBag, label: "Shopping Bag" },
  { name: "credit-card", icon: CreditCard, label: "Payment" },
  { name: "banknote", icon: Banknote, label: "Money" },
  { name: "coins", icon: Coins, label: "Coins" },
  { name: "wallet", icon: Wallet, label: "Wallet" },
  { name: "receipt", icon: Receipt, label: "Receipt" },
  { name: "tag", icon: Tag, label: "Tag" },
  { name: "tags", icon: Tags, label: "Tags" },
  { name: "percent", icon: Percent, label: "Discount" },
  { name: "gift", icon: Gift, label: "Gift" },
  { name: "truck", icon: Truck, label: "Delivery" },
  { name: "package", icon: Package, label: "Package" },
  { name: "package-2", icon: Package2, label: "Package Alt" },
  { name: "store", icon: Store, label: "Store" },

  // Location & Travel
  { name: "map-pin", icon: MapPin, label: "Location" },
  { name: "map", icon: Map, label: "Map" },
  { name: "navigation", icon: Navigation, label: "Navigation" },
  { name: "compass", icon: Compass, label: "Compass" },
  { name: "car", icon: Car, label: "Car" },
  { name: "plane", icon: Plane, label: "Plane" },
  { name: "train", icon: Train, label: "Train" },
  { name: "bus", icon: Bus, label: "Bus" },
  { name: "bike", icon: Bike, label: "Bike" },
  { name: "fuel", icon: Fuel, label: "Fuel" },
  { name: "hotel", icon: Hotel, label: "Hotel" },
  { name: "building", icon: Building, label: "Building" },
  { name: "building-2", icon: Building2, label: "Office" },

  // Weather & Nature
  { name: "sun", icon: Sun, label: "Sun" },
  { name: "moon", icon: Moon, label: "Moon" },
  { name: "cloud", icon: Cloud, label: "Cloud" },
  { name: "cloud-rain", icon: CloudRain, label: "Rain" },
  { name: "cloud-snow", icon: CloudSnow, label: "Snow" },
  { name: "zap", icon: Zap, label: "Lightning" },
  { name: "wind", icon: Wind, label: "Wind" },
  { name: "thermometer", icon: Thermometer, label: "Temperature" },
  { name: "droplets", icon: Droplets, label: "Water" },
  { name: "flame", icon: Flame, label: "Fire" },
  { name: "leaf", icon: Leaf, label: "Nature" },
  { name: "tree-pine", icon: TreePine, label: "Tree" },
  { name: "flower", icon: Flower, label: "Flower" },

  // Tools & Utilities
  { name: "scissors", icon: Scissors, label: "Cut" },
  { name: "copy", icon: Copy, label: "Copy" },
  { name: "clipboard", icon: Clipboard, label: "Clipboard" },
  { name: "edit", icon: Edit, label: "Edit" },
  { name: "edit-2", icon: Edit2, label: "Edit Alt" },
  { name: "edit-3", icon: Edit3, label: "Edit Pen" },
  { name: "paintbrush", icon: Paintbrush, label: "Paint" },
  { name: "palette", icon: Palette, label: "Colors" },
  { name: "pipette", icon: Pipette, label: "Color Picker" },
  { name: "ruler", icon: Ruler, label: "Ruler" },
  { name: "move", icon: Move, label: "Move" },
  { name: "grab", icon: Grab, label: "Grab" },
  { name: "hand", icon: Hand, label: "Hand" },

  // Security & Privacy
  { name: "lock", icon: Lock, label: "Lock" },
  { name: "unlock", icon: Unlock, label: "Unlock" },
  { name: "key", icon: Key, label: "Key" },
  { name: "eye", icon: Eye, label: "View" },
  { name: "eye-off", icon: EyeOff, label: "Hide" },
  { name: "fingerprint", icon: Fingerprint, label: "Fingerprint" },

  // Gaming & Fun
  { name: "gamepad", icon: Gamepad, label: "Gaming" },
  { name: "gamepad-2", icon: Gamepad2, label: "Controller" },
  { name: "dice-1", icon: Dice1, label: "Dice 1" },
  { name: "dice-6", icon: Dice6, label: "Dice 6" },
  { name: "trophy", icon: Trophy, label: "Trophy" },
  { name: "award", icon: Award, label: "Award" },
  { name: "medal", icon: Medal, label: "Medal" },
  { name: "target", icon: Target, label: "Target" },
  { name: "crosshair", icon: Crosshair, label: "Crosshair" },

  // Health & Medical
  { name: "heart-pulse", icon: HeartPulse, label: "Health" },
  { name: "activity", icon: Activity, label: "Activity" },
  { name: "stethoscope", icon: Stethoscope, label: "Medical" },
  { name: "pill", icon: Pill, label: "Medicine" },
  { name: "syringe", icon: Syringe, label: "Injection" },
  { name: "thermometer-sun", icon: ThermometerSun, label: "Fever" },

  // Food & Drink
  { name: "coffee", icon: Coffee, label: "Coffee" },
  { name: "wine", icon: Wine, label: "Wine" },
  { name: "beer", icon: Beer, label: "Beer" },
  { name: "utensils", icon: Utensils, label: "Food" },
  { name: "chef-hat", icon: ChefHat, label: "Cooking" },
  { name: "pizza", icon: Pizza, label: "Pizza" },
  { name: "cake", icon: Cake, label: "Cake" },
  { name: "ice-cream", icon: IceCream, label: "Ice Cream" },

  // Miscellaneous
  { name: "lightbulb", icon: Lightbulb, label: "Idea" },
  { name: "battery", icon: Battery, label: "Battery" },
  { name: "wifi", icon: Wifi, label: "WiFi" },
  { name: "wifi-off", icon: WifiOff, label: "No WiFi" },
  { name: "bluetooth", icon: Bluetooth, label: "Bluetooth" },
  { name: "usb", icon: Usb, label: "USB" },
  { name: "printer", icon: Printer, label: "Print" },
  { name: "scan", icon: Scan, label: "Scan" },
  { name: "qr-code", icon: QrCode, label: "QR Code" },
  { name: "barcode", icon: Barcode, label: "Barcode" },
  { name: "hash", icon: Hash, label: "Hash" },
  { name: "at-sign", icon: AtSign, label: "At Sign" },
  { name: "dollar-sign", icon: DollarSign, label: "Dollar" },
  { name: "euro", icon: Euro, label: "Euro" },
  { name: "pound-sterling", icon: PoundSterling, label: "Pound" },
  { name: "yen", icon: Yen, label: "Yen" },
  { name: "bitcoin", icon: Bitcoin, label: "Bitcoin" },
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

              {/* Fixed height container for all tab content */}
              <div className="h-[380px] mt-4 relative">
                <TabsContent value="predefined" className="absolute inset-0">
                  <div className="grid grid-cols-6 gap-3 h-full overflow-y-auto pr-1">
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

                <TabsContent value="custom" className="absolute inset-0">
                  <div className="h-full overflow-y-auto pr-1">
                    {customIcons.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 flex flex-col items-center justify-center h-full">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                        <p>No custom icons yet</p>
                        <p className="text-sm">Upload your first custom icon to get started</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-6 gap-3">
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

                <TabsContent value="uploaded" className="absolute inset-0">
                  <div className="h-full flex items-center">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center w-full">
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
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
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
              </div>
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
