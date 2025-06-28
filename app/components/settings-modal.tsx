"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, ExternalLink, Shield } from "lucide-react"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (apiKey: string) => void
  currentApiKey: string
}

export function SettingsModal({ open, onOpenChange, onSave, currentApiKey }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(currentApiKey)
  const [isValid, setIsValid] = useState(true)

  const handleSave = () => {
    if (!apiKey.trim()) {
      setIsValid(false)
      return
    }

    // OpenRouter keys start with "sk-or-"
    if (!apiKey.startsWith("sk-or-")) {
      setIsValid(false)
      return
    }

    setIsValid(true)
    onSave(apiKey.trim())
  }

  const handleClear = () => {
    setApiKey("")
    localStorage.removeItem("openai-api-key")
    onSave("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-600" />
            OpenRouter API Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your OpenRouter API key to start chatting with various AI models.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-or-..."
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setIsValid(true)
              }}
              className={!isValid ? "border-red-300 focus:border-red-400" : ""}
            />
            {!isValid && (
              <p className="text-sm text-red-600">Please enter a valid OpenRouter API key (starts with 'sk-or-')</p>
            )}
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Your API key is stored locally in your browser and never sent to our servers.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-slate-600 space-y-2">
            <p>Don't have an API key?</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => window.open("https://openrouter.ai/keys", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Get your API key from OpenRouter
            </Button>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {currentApiKey && (
            <Button variant="outline" onClick={handleClear}>
              Clear Key
            </Button>
          )}
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
