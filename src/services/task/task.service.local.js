import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
const STORAGE_KEY = 'boardDB'

export const taskService = {
  addTask,
  updateTask,
  removeTask,
  moveTask,
  transferTask,
  addComment,
  removeComment,
  addChecklist,
  addTodo,
  toggleTodoDone,
  getTaskById,
  getLabels,
  getMembers,
  openAttachmentInNewTab,
  getDominantColor,
}

async function addTask(board, group, taskToAdd) {
  if (!group.tasks?.length) group.tasks = []
  const task = {
    id: makeId(),
    title: taskToAdd.title,
    cover: '',
  }
  group.tasks.push(task)
  await storageService.put(STORAGE_KEY, board)
  return board
}

async function updateTask(board, groupId, taskId, changes) {
  const group = board.groups?.find(group => group.id === groupId)
  const groupIdx = board.groups?.findIndex(group => group.id === groupId)

  if (!group || !group.tasks) return
  const taskIdx = group.tasks.findIndex(task => task.id === taskId)

  if (taskIdx === -1) return
  group.tasks[taskIdx] = { ...group.tasks[taskIdx], ...changes }
  board.groups[groupIdx] = { ...board.groups[groupIdx], ...group }

  await storageService.put(STORAGE_KEY, board)
  return board
}

function removeTask(board, groupId, taskId) {
  const group = board.groups?.find(group => group.id === groupId)
  if (!group || !group.tasks) return board
  group.tasks = group.tasks.filter(task => task.id !== taskId)
  return board
}

function moveTask(board, fromGroupId, toGroupId, fromIdx, toIdx) {
  const fromGroup = board.groups?.find(group => group.id === fromGroupId)
  const toGroup = board.groups?.find(group => group.id === toGroupId)
  if (!fromGroup || !toGroup || !fromGroup.tasks) return board
  const tasksFrom = [...fromGroup.tasks]
  const [moved] = tasksFrom.splice(fromIdx, 1)
  fromGroup.tasks = tasksFrom
  toGroup.tasks = toGroup.tasks || []
  toGroup.tasks.splice(toIdx, 0, moved)
  return board
}

async function transferTask(task, sourceBoardId, sourceGroupId, newBoardId, newGroupId) {
  const isSameBoard = sourceBoardId === newBoardId

  //Get the source board and group
  const sourceBoard = await storageService.get(STORAGE_KEY, sourceBoardId)
  const sourceGroup = sourceBoard.groups?.find(g => g.id === sourceGroupId)
  if (!sourceGroup) {
    throw new Error(`Group with id ${sourceGroupId} not found in board ${sourceBoardId}`)
  }
  if (!sourceGroup.tasks) {
    throw new Error(`Task with id ${task.id} not found in group ${sourceGroupId}`)
  }
  const taskIdx = sourceGroup.tasks.findIndex(t => t.id === task.id)
  if (taskIdx === -1) {
    throw new Error(`Task with id ${task.id} not found in group ${sourceGroupId}`)
  }

  // Get the dest board and group
  // If same board, use the same board object to avoid duplicate modifications
  const destBoard = isSameBoard ? sourceBoard : await storageService.get(STORAGE_KEY, newBoardId)
  const destGroup = destBoard.groups?.find(g => g.id === newGroupId)
  if (!destGroup) {
    throw new Error(`Group with id ${newGroupId} not found in board ${newBoardId}`)
  }

  // Remove task from source
  const taskToMove = sourceGroup.tasks[taskIdx]
  // Create a new tasks array without the task
  sourceGroup.tasks = sourceGroup.tasks.filter(t => t.id !== task.id)
  // Update the source group in the board
  const sourceGroupIdx = destBoard.groups.findIndex(g => g.id === sourceGroupId)
  destBoard.groups[sourceGroupIdx] = {
    ...destBoard.groups[sourceGroupIdx],
    tasks: sourceGroup.tasks
  }

  //Add task to destination
  if (!destGroup.tasks) destGroup.tasks = []
  destGroup.tasks.push(taskToMove)
  // Update the dest group in the board
  const destGroupIdx = destBoard.groups.findIndex(g => g.id === newGroupId)
  destBoard.groups[destGroupIdx] = {
    ...destBoard.groups[destGroupIdx],
    tasks: destGroup.tasks
  }

  //Save boards (if same board, only save once)
  await storageService.put(STORAGE_KEY, destBoard)
  if (!isSameBoard) {
    await storageService.put(STORAGE_KEY, sourceBoard)
  }

  return { sourceBoard: isSameBoard ? destBoard : sourceBoard, destBoard }
}

function addComment(board, groupId, taskId, comment) {
  const task = getTaskById(board, groupId, taskId)
  if (!task) return board
  task.comments = task.comments || []
  task.comments.push(comment)
  return board
}

function removeComment(board, groupId, taskId, commentId) {
  const task = getTaskById(board, groupId, taskId)
  if (!task || !task.comments) return board
  task.comments = task.comments.filter(comment => comment.id !== commentId)
  return board
}

function addChecklist(board, groupId, taskId, checklist) {
  const task = getTaskById(board, groupId, taskId)
  if (!task) return board
  task.checklists = task.checklists || []
  task.checklists.push(checklist)
  return board
}

function addTodo(board, groupId, taskId, checklistId, todo) {
  const task = getTaskById(board, groupId, taskId)
  if (!task || !task.checklists) return board
  const checklist = task.checklists.find(cl => cl.id === checklistId)
  if (!checklist) return board
  checklist.todos = checklist.todos || []
  checklist.todos.push(todo)
  return board
}

function toggleTodoDone(board, groupId, taskId, checklistId, todoId) {
  const task = getTaskById(board, groupId, taskId)
  if (!task || !task.checklists) return board
  const checklist = task.checklists.find(cl => cl.id === checklistId)
  if (!checklist || !checklist.todos) return board
  const todo = checklist.todos.find(td => td.id === todoId)
  if (todo) todo.isDone = !todo.isDone
  return board
}

function getTaskById(board, groupId, taskId) {
  const group = board.groups?.find(group => group.id === groupId)
  if (!group || !group.tasks) return null
  return group.tasks.find(task => task.id === taskId) || null
}

function getLabels(board, groupId, taskId) {
  // Return board labels (available labels to choose from)
  if (board && board.labels && board.labels.length > 0) {
    return board.labels
  }
  // If no board labels exist, return default labels
  const defaultLabels = [
    { color: '#ae2e24', title: '', colorName: 'red' },
    { color: '#7f5f01', title: '', colorName: 'yellow' },
    { color: '#216e4e', title: '', colorName: 'green' },
    { color: '#1558bc', title: '', colorName: 'blue' },
    { color: '#803fa5', title: '', colorName: 'purple' },
    { color: '#9e4c00', title: '', colorName: 'orange' },
  ]
  return defaultLabels
}

function getMembers(board) {
  return board?.members || []
}

async function openAttachmentInNewTab(attachmentFile, fileType = null) {
  // Check if it's a base64 data URL
  if (attachmentFile.startsWith('data:')) {
    try {
      // Parse the data URL
      const [header, base64Data] = attachmentFile.split(',')
      const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/png'

      // Convert base64 to binary
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // Create blob and URL
      const blob = new Blob([bytes], { type: mimeType })
      const blobUrl = URL.createObjectURL(blob)

      // Open the blob URL in a new tab
      window.open(blobUrl, '_blank', 'noopener,noreferrer')

      // Clean up the blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    } catch (error) {
      console.error('Error opening attachment:', error)
      // Fallback: create HTML page with the data URL
      const newWindow = window.open('', '_blank', 'noopener,noreferrer')
      if (newWindow) {
        newWindow.document.open()
        newWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <title>Attachment</title>
                            <style>
                                body {
                                    margin: 0;
                                    padding: 20px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    min-height: 100vh;
                                    background-color: #f5f5f5;
                                }
                                img {
                                    max-width: 100%;
                                    max-height: 100vh;
                                    object-fit: contain;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                }
                            </style>
                        </head>
                        <body>
                            <img src="${attachmentFile}" alt="Attachment" />
                        </body>
                    </html>
                `)
        newWindow.document.close()
      }
    }
  } else {
    // Regular URL (Cloudinary or other)
    // Check if it's a Cloudinary URL
    const isCloudinaryUrl = attachmentFile.includes('cloudinary.com')
    
    if (isCloudinaryUrl && fileType) {
      // Determine if file should be displayed or downloaded
      const isImage = fileType.startsWith('image/')
      const isPDF = fileType === 'application/pdf'
      const isText = fileType.startsWith('text/')
      
      // Handle PDFs - fetch and create blob with correct MIME type
      if (isPDF) {
        try {
          // Fetch the PDF from Cloudinary
          const response = await fetch(attachmentFile, {
            method: 'GET',
            headers: {
              'Accept': 'application/pdf'
            }
          })
          
          if (!response.ok) {
            throw new Error('Failed to fetch PDF')
          }
          
          // Create blob with explicit PDF MIME type
          const blob = await response.blob()
          const pdfBlob = new Blob([blob], { type: 'application/pdf' })
          const blobUrl = URL.createObjectURL(pdfBlob)
          
          // Open blob URL - browser will display PDF
          const pdfWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer')
          
          if (!pdfWindow) {
            // Popup blocked - fallback to direct URL
            window.open(attachmentFile, '_blank', 'noopener,noreferrer')
          }
          
          // Clean up blob URL after window loads (don't revoke too early)
          setTimeout(() => {
            // Keep blob URL alive while window is open
            // Browser will handle cleanup when tab closes
          }, 100)
        } catch (error) {
          console.error('Error opening PDF:', error)
          // Fallback: try opening Cloudinary URL directly
          window.open(attachmentFile, '_blank', 'noopener,noreferrer')
        }
      } else if (isImage || isText) {
        // Images and text files - open directly
        window.open(attachmentFile, '_blank', 'noopener,noreferrer')
      } else {
        // For documents that browsers can't display (Word, Excel, archives, etc.)
        // For Cloudinary raw files, we need to fetch and download
        try {
          // Fetch the file and create a blob for download
          const response = await fetch(attachmentFile)
          if (!response.ok) throw new Error('Failed to fetch file')
          
          const blob = await response.blob()
          const blobUrl = URL.createObjectURL(blob)
          
          // Create a temporary anchor element to trigger download
          const link = document.createElement('a')
          link.href = blobUrl
          // Extract filename from URL or use a default
          const urlParts = attachmentFile.split('/')
          const filename = urlParts[urlParts.length - 1].split('?')[0] || 'attachment'
          link.download = filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          // Clean up the blob URL after a delay
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
        } catch (error) {
          console.error('Error downloading file:', error)
          // Fallback: try to open directly
          window.open(attachmentFile, '_blank', 'noopener,noreferrer')
        }
      }
    } else {
      // Regular URL - open directly
      window.open(attachmentFile, '_blank', 'noopener,noreferrer')
    }
  }
}

function getDominantColor(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "Anonymous"

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Sample from a smaller version for performance
      canvas.width = 100
      canvas.height = 100

      ctx.drawImage(img, 0, 0, 100, 100)
      const imageData = ctx.getImageData(0, 0, 100, 100).data

      // Count color frequencies
      const colorMap = {}

      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i]
        const g = imageData[i + 1]
        const b = imageData[i + 2]

        // Skip very light/dark colors (optional)
        const brightness = (r + g + b) / 3
        if (brightness < 20 || brightness > 240) continue

        // Group similar colors (reduce precision)
        const key = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`
        colorMap[key] = (colorMap[key] || 0) + 1
      }

      // Find most common color
      let maxCount = 0
      let dominantColor = '128,128,128'

      for (const [color, count] of Object.entries(colorMap)) {
        if (count > maxCount) {
          maxCount = count
          dominantColor = color
        }
      }

      resolve(`rgb(${dominantColor})`)
    }

    img.onerror = reject
    img.src = imageUrl
  })
}