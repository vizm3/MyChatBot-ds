"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Settings, Sparkles, MessageCircle, Zap, Brain, Clock } from "lucide-react"
import { SettingsModal } from "./components/settings-modal"
import { ModelSelector } from "./components/model-selector"

export default function ChatBot() {
  const [apiKey, setApiKey] = useState<string>("")
  const [showSettings, setShowSettings] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  const [selectedModel, setSelectedModel] = useState("deepseek/deepseek-r1-0528:free")
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    streamProtocol: "text",
    body: { apiKey, model: selectedModel },
    onError: (error) => {
      console.error("Chat error:", error)
      setResponseTime(null)
      setIsTyping(false)
    },
    onResponse: () => {
      // First token received
      if (startTimeRef.current) {
        const firstTokenTime = Date.now() - startTimeRef.current
        setResponseTime(firstTokenTime)
      }
      setIsTyping(true)
    },
    onFinish: () => {
      setIsTyping(false)
    },
  })

  // Auto-scroll to bottom with smooth animation
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        })
      }
    }
  }, [messages, isLoading])

  useEffect(() => {
    const savedApiKey = localStorage.getItem("openrouter-api-key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
      setIsConfigured(true)
    } else {
      setShowSettings(true)
    }
  }, [])

  const handleApiKeySave = (key: string) => {
    setApiKey(key)
    setIsConfigured(true)
    localStorage.setItem("openrouter-api-key", key)
    setShowSettings(false)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!apiKey) {
      setShowSettings(true)
      return
    }

    // Track response time
    startTimeRef.current = Date.now()
    setResponseTime(null)
    setIsTyping(false)

    handleSubmit(e)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">AI Assistant</h1>
              <p className="text-sm text-slate-500">Powered by OpenRouter</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {responseTime && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Clock className="h-3 w-3 mr-1" />
                {responseTime}ms
              </Badge>
            )}
            {isConfigured && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                <Zap className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModelSelector(true)}
              className="border-slate-200 hover:bg-slate-50"
            >
              <Brain className="h-4 w-4 mr-1" />
              Model
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="border-slate-200 hover:bg-slate-50"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Card className="h-[calc(100vh-200px)] shadow-xl border-slate-200/60 bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              Chat
              {isTyping && (
                <div className="flex items-center gap-1 ml-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full">
                    <Sparkles className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-700 mb-2">Welcome to your AI Assistant</h3>
                    <p className="text-slate-500 max-w-md">
                      Start a conversation by typing a message below. Optimized for ultra-fast streaming responses.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 border-2 border-blue-100">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 transition-all duration-200 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                            : "bg-slate-100 text-slate-800 border border-slate-200"
                        }`}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                      </div>

                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 border-2 border-slate-200">
                          <AvatarFallback className="bg-slate-600 text-white text-sm">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start animate-in slide-in-from-bottom-2 duration-200">
                      <Avatar className="h-8 w-8 border-2 border-blue-100">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-slate-100 rounded-2xl px-4 py-3 border border-slate-200">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-slate-100 p-4 bg-slate-50/50">
              <form onSubmit={onSubmit} className="flex gap-3">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={isConfigured ? "Type your message..." : "Please configure your API key first..."}
                  disabled={!isConfigured || isLoading}
                  className="flex-1 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white transition-all duration-200"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  disabled={!isConfigured || isLoading || !input.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6"
                >
                  <Send className={`h-4 w-4 transition-transform duration-200 ${isLoading ? "animate-pulse" : ""}`} />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </main>

      <SettingsModal
        open={showSettings}
        onOpenChange={setShowSettings}
        onSave={handleApiKeySave}
        currentApiKey={apiKey}
      />
      <ModelSelector
        open={showModelSelector}
        onOpenChange={setShowModelSelector}
        onModelSelect={setSelectedModel}
        currentModel={selectedModel}
      />
    </div>
  )
}
