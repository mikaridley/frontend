import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { sendAICommand } from '../store/actions/board.actions'
import { AiAgent } from './AiAjent'
import sendImg from '../assets/img/send.svg'
import ajentPhoto from '../assets/img/ajent-photo.svg'
import { AnimatePresence, motion } from 'framer-motion'

export function AiChat({ addAiBoard, addAiBoardFic }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMessages([
      {
        role: 'ai',
        content:
          'Hi 👋 I am Mr.Shmello what board would you like me to build for you?',
      },
    ])
  }, [])

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function handleSend() {
    setInput('')
    if (!input) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    setTimeout(() => {
      const autoAiMessage = {
        role: 'ai',
        content: 'Working on it... please wait',
      }
      setMessages(prev => [...prev, autoAiMessage])
    }, 1000)

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
      <AiAgent toggleIsOpen={toggleIsOpen} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
            exit={{ scale: 0, opacity: 0 }} // optional if using AnimatePresence
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ transformOrigin: 'bottom right' }}
            className="chat-window"
          >
            <header className="chat-header">
              <div className="ajent-photo">
                <img src={ajentPhoto} />
              </div>
              <p>Chat with</p>
              <p>Mr.Shmello</p>
            </header>

            <div class="wavy">
              <svg viewBox="0 0 1440 150" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient
                    id="chatGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stop-color="#131a5f" />
                    <stop offset="100%" stop-color="#7d8aff" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#chatGradient)"
                  d="M0,80 C360,150 1080,0 1440,80 L1440,150 L0,150 Z"
                ></path>
              </svg>
            </div>

            <div className="messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            <div className="input-container">
              <textarea
                row="1"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Create a bord with AI..."
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button
                className="btn toggle-btn"
                onClick={handleSend}
                disabled={loading}
              >
                <img src={sendImg} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
