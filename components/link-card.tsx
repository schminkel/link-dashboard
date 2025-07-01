"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Edit, Trash2 } from "lucide-react"
import { IconDisplay } from "./icon-display"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import type { Link } from "@/lib/db"

interface LinkCardProps {
  link: Link
  onEdit: (link: Link) => void
}

export function LinkCard({ link, onEdit }: LinkCardProps) {
  const [isClicked, setIsClicked] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleCardClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)
    window.open(link.url, "_blank", "noopener,noreferrer")
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(link)
  }

  return (
    <>
      <Card
        className={`
          group cursor-pointer transition-all duration-300 ease-in-out
          bg-gradient-to-br from-slate-900/60 to-slate-800/40 
          border-slate-700/50 backdrop-blur-sm
          hover:border-blue-500/50 hover:shadow-2xl
          hover:shadow-blue-500/20 hover:-translate-y-2
          active:scale-95
          ${isClicked ? "animate-click-effect" : ""}
        `}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 p-2 bg-slate-800/50 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <IconDisplay
                  iconType={link.icon_type}
                  iconValue={link.icon_value}
                  className="h-5 w-5 text-slate-400 group-hover:text-blue-300 transition-colors"
                />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-100 group-hover:text-blue-300 transition-colors truncate">
                {link.title}
              </CardTitle>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 w-8 p-0 hover:bg-blue-500/20 hover:text-blue-300"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{link.url}</span>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog link={link} isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
    </>
  )
}
