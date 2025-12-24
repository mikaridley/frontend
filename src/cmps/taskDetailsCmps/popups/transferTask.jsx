import { useState, useEffect, useRef } from 'react'
import { boardService } from '../../../services/board'
import { taskService } from '../../../services/task'
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service'
import { useNavigate } from 'react-router-dom'
import { loadBoard, updateBoard } from '../../../store/actions/board.actions'
import { popupToViewportHook } from '../../../customHooks/popupToViewportHook'

export function TransferTask({ board, groupId, taskId, onClose, position }) {
    const [boards, setBoards] = useState([])
    const [selectedBoardId, setSelectedBoardId] = useState(board?._id || '')
    const [selectedGroupId, setSelectedGroupId] = useState(groupId || '')
    const [selectedBoard, setSelectedBoard] = useState(null)
    const isInitialMount = useRef(true)
    const popupRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        async function initializeDropdowns() {
            await loadBoards()
            // Use the board prop directly if available, otherwise load it
            if (board?._id) {
                if (board.groups) {
                    // Use the board prop directly
                    setSelectedBoard(board)
                    if (groupId && board.groups.some(g => g.id === groupId)) {
                        setSelectedGroupId(groupId)
                    }
                } else {
                    // Load the board if groups aren't available
                    await loadSelectedBoard(board._id, groupId)
                }
            }
        }
        initializeDropdowns()
    }, [])

  // Keep popup fully visible vertically.
  popupToViewportHook(popupRef, position)

    useEffect(() => {  //update the selected board and group when the selected board id changes
        // Skip on initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }
        if (selectedBoardId) {
            loadSelectedBoard(selectedBoardId, '')
        } else {
            setSelectedBoard(null)
            setSelectedGroupId('')
        }
    }, [selectedBoardId])

    async function loadBoards() {
        try {
            const allBoards = await boardService.query()
            setBoards(allBoards)
        } catch (err) {
            console.error('Error loading boards:', err)
            showErrorMsg('Cannot load boards')
        }
    }

    async function loadSelectedBoard(boardId, preserveGroupId = '') {   //preserveGroupId: if new board has the same group, keep the same group
        try {
            const loadedBoard = await boardService.getById(boardId)
            setSelectedBoard(loadedBoard)
            if (preserveGroupId && loadedBoard.groups?.some(g => g.id === preserveGroupId)) {
                setSelectedGroupId(preserveGroupId)
            } else {
                setSelectedGroupId('') //reset group selection when board changes
            }
        } catch (err) {
            console.error('Error loading board:', err)
            showErrorMsg('Cannot load board')
        }
    }

    async function handleMove() {
        if (!selectedBoardId || !selectedGroupId) {
            showErrorMsg('Please select both board and list')
            return
        }

        const task = taskService.getTaskById(board, groupId, taskId)
        if (!task) {
            showErrorMsg('Task not found')
            return
        }

        try {
            const { sourceBoard, destBoard } = await taskService.transferTask(
                task,
                board._id,
                groupId,
                selectedBoardId,
                selectedGroupId
            )
            // Update both boards in Redux store
            await updateBoard(destBoard)
            if (sourceBoard._id !== destBoard._id) {
                await updateBoard(sourceBoard)
            }
            // Reload the destination board to ensure UI is up to date
            await loadBoard(selectedBoardId)
            showSuccessMsg('Task moved successfully')
            onClose()
            // Navigate to the new board
            navigate(`/board/${selectedBoardId}`)
        } catch (err) {
            console.error('Error transferring task:', err)
            showErrorMsg(err.message || 'Cannot transfer task')
        }
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div 
                ref={popupRef}
                className="popup-content popup-transfer-task" 
                onClick={(e) => e.stopPropagation()}
                style={position ? {
                    top: `${position.top}px`,
                    left: `${position.left}px`
                } : {}}
            >
                <h4>Transfer Task</h4>
                <button className="popup-close" onClick={onClose}>×</button>
                <div className="popup-body">
                    <h5>Select destination</h5>
                    
                    <h4>Board</h4>
                    <select 
                        value={selectedBoardId} 
                        onChange={(e) => setSelectedBoardId(e.target.value)}
                    >
                        <option value="">Select a board</option>
                        {boards.map(board => (
                            <option key={board._id} value={board._id}>
                                {board.title || board.name}
                            </option>
                        ))}
                    </select>

                    {selectedBoard && (
                        <>
                            <h4>List</h4>
                            <select 
                                value={selectedGroupId} 
                                onChange={(e) => setSelectedGroupId(e.target.value)}
                            >
                                <option value="">Select a list</option>
                                {selectedBoard.groups?.map(group => (
                                    <option key={group.id} value={group.id}>
                                        {group.title}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    <button 
                        className="btn-move-task" 
                        onClick={handleMove}
                        disabled={!selectedBoardId || !selectedGroupId}
                    >
                        Move
                    </button>
                </div>
            </div>
        </div>
    )
}

