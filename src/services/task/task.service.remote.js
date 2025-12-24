import { httpService } from '../http.service'

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

async function addTask(boardId , groupId, taskToAdd) {
    // Ensure boardId is a string
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    return httpService.post(`board/${id}/group/${groupId}/task`, taskToAdd)
}

async function updateTask(boardId, groupId, taskId, changes) {
    // Ensure boardId is a string (handle both board object and string ID)
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    return httpService.put(`board/${id}/group/${groupId}/task/${taskId}`, changes)
}

async function removeTask(boardId, groupId, taskId) {
    // Ensure boardId is a string
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    return httpService.delete(`board/${id}/group/${groupId}/task/${taskId}`)
}

async function moveTask(boardId, fromGroupId, toGroupId, fromIdx, toIdx) {
    // Ensure boardId is a string
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    return httpService.put(`board/${id}/group/${fromGroupId}/task/${fromIdx}/move/${toGroupId}/${toIdx}`)
}

async function addComment(boardId, groupId, taskId, comment) {
    // Ensure boardId is a string
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    return httpService.post(`board/${id}/group/${groupId}/task/${taskId}/comment`, comment)
}

async function removeComment(boardId, groupId, taskId, commentId) {
    // Ensure boardId is a string
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    return httpService.delete(`board/${id}/group/${groupId}/task/${taskId}/comment/${commentId}`)
}

async function addChecklist(boardId, groupId, taskId, checklist) {
    // Ensure boardId is a string
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    return httpService.post(`board/${id}/group/${groupId}/task/${taskId}/checklist`, checklist)
}

async function addTodo(boardId, groupId, taskId, checklistId, todo) {
    // Ensure boardId is a string
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    return httpService.post(`board/${id}/group/${groupId}/task/${taskId}/checklist/${checklistId}/todo`, todo)
}

async function toggleTodoDone(boardId, groupId, taskId, checklistId, todoId) {
    // Ensure boardId is a string
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    return httpService.put(`board/${id}/group/${groupId}/task/${taskId}/checklist/${checklistId}/todo/${todoId}/toggle`)
}
//added from local
async function transferTask(task, sourceBoardId, sourceGroupId, newBoardId, newGroupId) {
    // Ensure boardIds are strings
    const sourceId = typeof sourceBoardId === 'string' ? sourceBoardId : (sourceBoardId?._id ? String(sourceBoardId._id) : String(sourceBoardId))
    const newId = typeof newBoardId === 'string' ? newBoardId : (newBoardId?._id ? String(newBoardId._id) : String(newBoardId))
    return httpService.put(`board/${sourceId}/group/${sourceGroupId}/task/${task.id}/transfer`, {
        newBoardId: newId,
        newGroupId
    })
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

function openAttachmentInNewTab(attachmentFile) {
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
        // Regular URL - open directly
        window.open(attachmentFile, '_blank', 'noopener,noreferrer')
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

