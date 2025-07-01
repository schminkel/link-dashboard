"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, AlertTriangle } from "lucide-react"
import { deleteLink } from "@/lib/actions"
import type { Link } from "@/lib/db"

interface DeleteConfirmationDialogProps {
  link: Link
  isOpen: boolean
  onClose: () => void
}

export function DeleteConfirmationDialog({ link, isOpen, onClose }: DeleteConfirmationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteLink(link.id)
      onClose()
    } catch (error) {
      console.error("Failed to delete link:", error)
      alert(error instanceof Error ? error.message : "Failed to delete link")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-slate-900/95 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Delete Link
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-slate-300">Are you sure you want to delete this link?</p>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <p className="font-medium text-slate-100">{link.title}</p>
                <p className="text-sm text-slate-400 truncate">{link.url}</p>
              </div>
              <p className="text-sm text-slate-400">This action cannot be undone.</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
