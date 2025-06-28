export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, apiKey, model = "deepseek/deepseek-r1-0528:free" } = await req.json()

    if (!apiKey) {
      return new Response("API key is required", { status: 400 })
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "AI Assistant Chatbot",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        // Optimize for faster responses
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("OpenRouter API error:", error)
      return new Response(`API Error: ${response.status}`, { status: response.status })
    }

    // High-performance streaming with minimal buffering
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        // Process chunks immediately without buffering
        const text = decoder.decode(chunk, { stream: true })

        // Handle partial lines by maintaining a buffer
        const lines = text.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim()

            if (data === "[DONE]") {
              return
            }

            if (data && data !== "") {
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content

                if (content) {
                  // Send raw text content directly - no JSON wrapping
                  controller.enqueue(encoder.encode(content))
                }
              } catch (e) {
                // Skip invalid JSON but continue processing
              }
            }
          }
        }
      },

      // Flush immediately without waiting
      flush(controller) {
        // Ensure any remaining data is sent immediately
      },
    })

    return new Response(response.body?.pipeThrough(transformStream), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        // Disable buffering at all levels
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Accel-Buffering": "no", // Disable nginx buffering
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
