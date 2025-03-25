"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import Cookie from "js-cookie"
interface CreateFolderDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onCreateFolder?: (name: string) => void
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  onCreateFolder,
}: CreateFolderDialogProps) {
  const [folderName, setFolderName] = React.useState("")
const  Router = useRouter()
  const handleCreate = () => {
    if (folderName.trim()) {
      onCreateFolder?.(folderName)
      Cookie.set("folderName", folderName)
      Router.push("/mediaManagement-table/import/subfolder")
      setFolderName("")
      onOpenChange?.(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Folder Name</DialogTitle>
          {/* <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          
          >
            <X    onClick={() => onOpenChange?.(false)} className="h-4 w-4" />
      
          </Button> */}
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <Input
            placeholder="Enter Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="flex-1 bg-background"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreate()
              }
            }}
          />
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

