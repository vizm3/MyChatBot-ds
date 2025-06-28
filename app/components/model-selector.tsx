"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Brain, Zap } from "lucide-react"

interface ModelSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onModelSelect: (model: string) => void
  currentModel: string
}

const models = [
  {
    id: "deepseek/deepseek-r1-0528:free",
    name: "DeepSeek R1 (Free)",
    description: "Advanced reasoning model, completely free",
    category: "Free",
  },
  {
    id: "meta-llama/llama-3.2-3b-instruct:free",
    name: "Llama 3.2 3B (Free)",
    description: "Fast and efficient, good for general tasks",
    category: "Free",
  },
  {
    id: "microsoft/phi-3-mini-128k-instruct:free",
    name: "Phi-3 Mini (Free)",
    description: "Compact model optimized for efficiency",
    category: "Free",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    description: "OpenAI's most capable model",
    category: "Premium",
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    description: "Anthropic's most intelligent model",
    category: "Premium",
  },
  {
    id: "google/gemini-pro-1.5",
    name: "Gemini Pro 1.5",
    description: "Google's advanced multimodal model",
    category: "Premium",
  },
]

export function ModelSelector({ open, onOpenChange, onModelSelect, currentModel }: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState(currentModel)

  const handleSave = () => {
    onModelSelect(selectedModel)
    onOpenChange(false)
  }

  const currentModelInfo = models.find((m) => m.id === currentModel)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Select AI Model
          </DialogTitle>
          <DialogDescription>
            Choose the AI model that best fits your needs. Free models have no usage costs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model-select">Available Models</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2 text-xs font-medium text-slate-500 uppercase tracking-wide">Free Models</div>
                {models
                  .filter((m) => m.category === "Free")
                  .map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-green-500" />
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-slate-500">{model.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                <div className="p-2 text-xs font-medium text-slate-500 uppercase tracking-wide mt-2">
                  Premium Models
                </div>
                {models
                  .filter((m) => m.category === "Premium")
                  .map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <Brain className="h-3 w-3 text-blue-500" />
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-slate-500">{model.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {currentModelInfo && (
            <div className="p-3 bg-slate-50 rounded-lg border">
              <div className="text-sm font-medium text-slate-700">Currently using:</div>
              <div className="text-sm text-slate-600">{currentModelInfo.name}</div>
              <div className="text-xs text-slate-500 mt-1">{currentModelInfo.description}</div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Select Model
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
