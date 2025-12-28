import { useState } from 'react'
import { useSelector } from 'react-redux'
import { sendAICommand } from '../store/actions/board.actions'

export function AiChat({ addAiBoard }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (!input) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const aiResult = await sendAICommand(input)
      const aiMessage = { role: 'ai', content: aiResult }
      setMessages(prev => [...prev, aiMessage])
      addAiBoard(aiResult)
    } catch (err) {
      const aiMessage = { role: 'ai', content: 'Sorry, something went wrong.' }
      setMessages(prev => [...prev, aiMessage])
    } finally {
      setLoading(false)
      setInput('')
    }
  }

  return (
    <div className={`ai-chat ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(prev => !prev)}>
        AI
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
          </div>

          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask AI..."
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
