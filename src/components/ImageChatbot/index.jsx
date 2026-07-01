import { useState, useEffect } from 'react'
import './index.css'

const STYLE_PRESETS = {
  "None": "",
  "Cyberpunk": "cyberpunk neon style, high contrast, futuristic, synthwave",
  "Oil Painting": "classical oil painting, textured brushstrokes, fine art, museum quality",
  "Anime": "modern anime style, vibrant colors, clean lines, studio ghibli inspired",
  "3D Render": "octane render, unreal engine 5, 8k, hyper-detailed, 3d masterpiece",
  "Sketch": "charcoal pencil drawing, hand-drawn, minimalist, graphite",
  "Hyper-Realism": "photorealistic, 8k resolution, shot on 35mm lens, raw photo"
}

const SUGGESTIONS = [
  { icon: "🌃", text: "Cyberpunk Tokyo in rain" },
  { icon: "🚀", text: "Astronaut exploring Mars" },
  { icon: "🐱", text: "Cute cat in a tuxedo" },
  { icon: "🏝️", text: "Tropical island paradise" },
  { icon: "🏰", text: "Medieval fantasy castle" },
]

const ImageChatbot = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('imagenify_messages')
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        type: 'bot',
        text: '👋 Hi! I am Imagenify, your AI Image Generator. Describe your thoughts and I will transform them into art! What would you like to create today?'
      }
    ]
  })
  const [inputValue, setInputValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('imagenify_apiKey') || '')
  const [showApiInput, setShowApiInput] = useState(() => !localStorage.getItem('imagenify_apiKey'))
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('imagenify_theme')
    return saved ? saved === 'dark' : true // Default to dark
  })
  const [selectedStyle, setSelectedStyle] = useState("None")

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('imagenify_messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem('imagenify_apiKey', apiKey)
  }, [apiKey])

  useEffect(() => {
    localStorage.setItem('imagenify_theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(prev => !prev)

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      setMessages([
        {
          id: Date.now(),
          type: 'bot',
          text: 'History cleared. What should we create next? ✨'
        }
      ])
      localStorage.removeItem('imagenify_messages')
    }
  }

  // Freepik AI Image Generation via proxy server
  const generateImage = async (prompt) => {
    if (!apiKey) {
      throw new Error('Please enter your Freepik API key first')
    }

    setIsGenerating(true)

    try {
      // Step 1: Create generation task via proxy
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          apiKey: apiKey
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to generate image')
      }

      const taskId = data.data.task_id

      // Step 2: Poll for completion
      const imageUrl = await pollForImage(taskId)

      setIsGenerating(false)
      return imageUrl
    } catch (error) {
      setIsGenerating(false)
      throw error
    }
  }

  // Poll the API to check when image is ready via proxy
  const pollForImage = async (taskId) => {
    const maxAttempts = 30
    const pollInterval = 3000 // 3 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval))

      const response = await fetch(`http://localhost:3001/api/status/${taskId}`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey
        }
      })

      const data = await response.json()
      console.log('Poll response:', data)

      if (data.data.status === 'COMPLETED' && data.data.generated && data.data.generated.length > 0) {
        const imageUrl = data.data.generated[0]
        console.log('Image URL:', imageUrl)
        return imageUrl
      } else if (data.data.status === 'FAILED') {
        throw new Error('Image generation failed')
      }
    }

    throw new Error('Image generation timed out')
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    if (!apiKey) {
      const errorMessage = {
        id: Date.now(),
        type: 'bot',
        text: '⚠️ Please enter your Freepik API key first in the field above.',
      }
      setMessages(prev => [...prev, errorMessage])
      return
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Combine style and prompt
    const stylePrompt = STYLE_PRESETS[selectedStyle]
    const finalPrompt = stylePrompt ? `${inputValue}, ${stylePrompt}` : inputValue

    // Generate image
    try {
      const imageUrl = await generateImage(finalPrompt)

      console.log('Final image URL for message:', imageUrl)

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: selectedStyle !== "None"
          ? `Here's your ${selectedStyle} masterpiece for: "${inputValue}"`
          : `Here's your generated image for: "${inputValue}"`,
        imageUrl: imageUrl,
        prompt: inputValue, // Store the original prompt for regeneration
        style: selectedStyle
      }

      console.log('Bot message with image:', botMessage)
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: `❌ ${error.message || 'Sorry, I couldn\'t generate the image. Please try again.'}`,
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleRegenerate = async (prompt) => {
    if (!prompt) return;

    // Add advanced modifiers to the prompt
    const advancedPrompt = `${prompt}, ultra high resolution, 8k, photorealistic, masterpiece, highly detailed, cinematic lighting`;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: `🔄 Regenerate advanced version of: "${prompt}"`,
    }
    setMessages(prev => [...prev, userMessage])

    try {
      const imageUrl = await generateImage(advancedPrompt)

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: `Here's the advanced regenerated version for: "${prompt}"`,
        imageUrl: imageUrl,
        prompt: prompt,
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: `❌ ${error.message || 'Sorry, I couldn\'t regenerate the image.'}`,
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleSuggestionClick = (text) => {
    setInputValue(text)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleDownload = async (imageUrl, prompt) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `imagenify_${prompt.slice(0, 20).replace(/\s+/g, '_')}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab if blob fetch fails
      window.open(imageUrl, '_blank');
    }
  }

  return (
    <div className={`chatbot-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="chatbot-header">
        <h1>🎨 ImageNify</h1>
        <div className="header-actions">
          <p>Hi! I'm ImageNify, your AI Image Generator.</p>
          <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={clearHistory} className="clear-btn" title="Clear History">🧹 Clear</button>
        </div>
      </div>

      {showApiInput && (
        <div className="api-key-section glass">
          <label>
            <span>🔑 Freepik API Key:</span>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Freepik API key"
            />
          </label>
          <div className="api-actions">
            <button
              className="hide-btn"
              onClick={() => setShowApiInput(false)}
              disabled={!apiKey}
            >
              {apiKey ? '✓ Save' : 'Enter Key'}
            </button>
          </div>
        </div>
      )}

      <div className="messages-container">
        {messages.length <= 1 && (
          <div className="welcome-hero">
            <h2>Spark Your Imagination ✨</h2>
            <p>Try one of these creative prompts to get started:</p>
            <div className="suggestion-chips">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s.text)}
                  className="chip"
                >
                  {s.icon} {s.text}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              {message.imageUrl && (
                <div className="image-container">
                  <img
                    src={message.imageUrl}
                    alt="Generated"
                    onLoad={() => console.log('Image loaded successfully:', message.imageUrl)}
                    onError={(e) => console.error('Image failed to load:', message.imageUrl, e)}
                  />
                  <div className="image-actions">
                    <a href={message.imageUrl} target="_blank" rel="noopener noreferrer" className="download-btn">
                      🔗 View Full Size
                    </a>
                    <button
                      onClick={() => handleRegenerate(message.prompt)}
                      className="download-btn regenerate-btn"
                      disabled={isGenerating}
                    >
                      🔄 Regenerate
                    </button>
                    <button
                      onClick={() => handleDownload(message.imageUrl, message.prompt || message.text)}
                      className="download-btn download-action-btn"
                    >
                      📥 Download Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="generating-indicator">
                <div className="shimmer-box"></div>
                <div className="spinner"></div>
                <p>Manifesting your vision...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="input-container">
        <div className="input-tools">
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="style-select"
            disabled={isGenerating}
          >
            {Object.keys(STYLE_PRESETS).map(style => (
              <option key={style} value={style}>{style === "None" ? "🎨 Choose Style" : style}</option>
            ))}
          </select>
        </div>
        <div className="input-main">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the image you want to generate..."
            rows="2"
            disabled={isGenerating}
          />
          <button onClick={handleSendMessage} disabled={isGenerating || !inputValue.trim()}>
            {isGenerating ? '⏳' : '🚀'}
          </button>
        </div>
      </div>

      <div className="api-notice">
        💡 <strong>Get your API key:</strong> Sign up at <a href="https://freepik.com/api" target="_blank" rel="noopener noreferrer">freepik.com/api</a>
        {!showApiInput && (
          <button className="show-key-btn" onClick={() => setShowApiInput(true)}>
            Edit API Key
          </button>
        )}
      </div>
    </div>
  )
}

export default ImageChatbot
