"use client"

import { useRef, useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportAllData } from "@/lib/export-actions"
import { importAllData } from "@/lib/import-actions"
import { AlertTriangle, CheckCircle, Download, Plus, LinkIcon, MoreVertical, Upload, X } from "lucide-react"

type ImportPayload = {
  categories: unknown[]
  links: unknown[]
  custom_icons: unknown[]
}

type ImportStats = {
  categories: number
  links: number
  custom_icons: number
}

interface CompactHeaderProps {
  onAddLink: () => void
}

export function CompactHeader({ onAddLink }: CompactHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingImport, setPendingImport] = useState<ImportPayload | null>(null)
  const [showImportConfirm, setShowImportConfirm] = useState(false)
  const [showImportResult, setShowImportResult] = useState(false)
  const [importStats, setImportStats] = useState<ImportStats | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [shouldReloadAfterImport, setShouldReloadAfterImport] = useState(false)

  const handleExport = async () => {
    try {
      const payload = await exportAllData()
      const json = JSON.stringify(payload, null, 2)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      const dateStamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")

      anchor.href = url
      anchor.download = `${dateStamp}_link-dashboard-export.json`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const handleImportFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as ImportPayload

      if (!Array.isArray(parsed.categories) || !Array.isArray(parsed.links) || !Array.isArray(parsed.custom_icons)) {
        throw new Error("Invalid import data")
      }

      setPendingImport(parsed)
      setShowImportConfirm(true)
    } catch (error) {
      console.error("Failed to read import file:", error)
      alert("The selected file is not a valid export.")
    } finally {
      event.target.value = ""
    }
  }

  const handleConfirmImport = async () => {
    if (!pendingImport || isImporting) return

    setIsImporting(true)
    try {
      const stats = await importAllData(pendingImport as any)
      setImportStats(stats)
      setShowImportConfirm(false)
      setShowImportResult(true)
      setShouldReloadAfterImport(true)
    } catch (error) {
      console.error("Import failed:", error)
      alert("Import failed. Please check the file and try again.")
    } finally {
      setIsImporting(false)
    }
  }

  const handleCancelImport = () => {
    setShowImportConfirm(false)
    setPendingImport(null)
  }

  const handleCloseImportResult = () => {
    setShowImportResult(false)
    setImportStats(null)
    setPendingImport(null)
    if (shouldReloadAfterImport) {
      window.location.reload()
    }
  }

  return (
    <>
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/20">
                <LinkIcon className="text-blue-400 w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-slate-100 mx-0 my-0 py-0 leading-6 text-2xl">Links Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-200 hover:bg-slate-800/70"
                    aria-label="Open menu"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem
                    onSelect={() => void handleExport()}
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => fileInputRef.current?.click()}
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Upload className="h-4 w-4" />
                    Import
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={onAddLink}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportFileChange}
      />

      {showImportConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-70">
          <Card className="w-full max-w-md bg-slate-900/95 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Confirm Import
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCancelImport} className="h-8 w-8 p-0 hover:bg-slate-700">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-300">This will overwrite all existing data with the contents of the import file.</p>
                <p className="text-sm text-slate-400">This action cannot be undone.</p>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelImport}
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    disabled={isImporting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmImport}
                    disabled={isImporting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isImporting ? "Importing..." : "OK"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showImportResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-70">
          <Card className="w-full max-w-md bg-slate-900/95 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Import Complete
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCloseImportResult} className="h-8 w-8 p-0 hover:bg-slate-700">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-slate-300">Your data has been imported successfully.</p>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 text-slate-200 text-sm">
                  <p>{importStats?.links ?? 0} links</p>
                  <p>{importStats?.categories ?? 0} categories</p>
                  <p>{importStats?.custom_icons ?? 0} icons</p>
                </div>
                <div className="pt-4">
                  <Button onClick={handleCloseImportResult} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    OK
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
