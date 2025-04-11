'use client'
import { useState, useRef, useEffect } from 'react'
import { HfInference } from '@huggingface/inference'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hfToken = process.env.NEXT_PUBLIC_HF_TOKEN
  if (!hfToken) {
    throw new Error('Hugging Face token is not configured. Please set NEXT_PUBLIC_HF_TOKEN in your environment variables.')
  }
  const hf = new HfInference(hfToken)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: input,
        parameters: { max_new_tokens: 200 }
      })

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.generated_text 
      }])
    } catch (error) {
      console.error('Hugging Face API error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error instanceof Error ? error.message : 'Failed to process request'}. Please check your token and try again.`
      }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 p-0 shadow-xl bg-red-600 hover:bg-red-700 transition-all animate-pulse"
        >
          <span className="text-2xl">💬</span>
        </Button>
      </div>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 flex flex-col z-[9999] shadow-2xl">
      <CardHeader className="p-3 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Financial Assistant</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs p-2 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-2 rounded-lg">Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
