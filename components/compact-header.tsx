"use client"

import { Button } from "@/components/ui/button"
import { Plus, LinkIcon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useStandaloneMode } from "@/hooks/use-standalone"

interface CompactHeaderProps {
  onAddLink: () => void
}

export function CompactHeader({ onAddLink }: CompactHeaderProps) {
  const isMobile = useIsMobile();
  const isStandalone = useStandaloneMode();
  
  return (
    <>      
      <div className={`px-2 sticky top-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/30 ${isStandalone ? 'header-with-inset' : ''}`}>
        <div className="container mx-auto px-4 py-3 ios-safe-area-left ios-safe-area-right">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/20">
                <LinkIcon className="text-blue-400 w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-slate-100 mx-0 my-0 py-0 leading-6 text-2xl">Links Dashboard</h1>
              </div>
            </div>
            <Button
              onClick={onAddLink}
              size="sm"
              className={`bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 ${isMobile ? 'w-9 h-9 p-0' : ''}`}
              title="Add new link"
            >
              <Plus className={`h-4 w-4 ${isMobile ? '' : 'mr-1'}`} />
              {!isMobile && 'Add'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
