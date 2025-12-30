import { useState } from 'react'
import { useSelector } from 'react-redux'
import { sendAICommand } from '../store/actions/board.actions'

export function AiChat({ addAiBoard, addAiBoardFic }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (!input) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    const autoAiMessage = {
      role: 'ai',
      content: 'Working on it... please wait',
    }
    setMessages(prev => [...prev, autoAiMessage])

    // wait 2 seconds before creating the board
    setTimeout(() => {
      addAiBoardFic()
      setInput('')
      setLoading(false)
    }, 2000)

    // try {
    //   const aiResult = await sendAICommand(input)
    //   const aiMessage = { role: 'ai', content: 'Done!' }
    //   setMessages(prev => [...prev, aiMessage])
    //   addAiBoard(aiResult)
    // } catch (err) {
    //   // Check if the backend sent a 403 AI limit
    //   let errorMsg = 'Sorry, something went wrong.'
    //   if (err.response?.status === 403) {
    //     errorMsg = 'You have reached your daily AI limit (2 uses).'
    //   }

    //   const aiMessage = { role: 'ai', content: errorMsg }
    //   setMessages(prev => [...prev, aiMessage])
    // } finally {
    //   setLoading(false)
    //   setInput('')
    // }
  }

  function toggleIsOpen() {
    setIsOpen(prev => !prev)
  }

  return (
    <div className={`ai-chat ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={toggleIsOpen}>
        Ai
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
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Create a bord with AI..."
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="btn" onClick={handleSend} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
