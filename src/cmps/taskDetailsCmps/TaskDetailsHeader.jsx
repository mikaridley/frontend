import { useState, useRef, useEffect } from 'react'
import { updateTask } from '../../store/actions/task.actions'
import { showErrorMsg } from "../../services/event-bus.service.js"
import doneIcon from '../../assets/img/done.svg'
import emptyCircleIcon from '../../assets/img/empty-circle.svg'
import { LightTooltip } from '../LightToolTip'

export function TaskDetailsHeader({ task, board, groupId, taskId, onTaskUpdate, onOpenPopup }) {
    const [isEditing, setIsEditing] = useState(false)
    const [titleValue, setTitleValue] = useState(task?.title || '')
    const [isScrolled, setIsScrolled] = useState(false)
    const textareaRef = useRef(null)
    const h2Ref = useRef(null)
    const savedHeightRef = useRef(null)

    // handle focus/select only when entering edit mode
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            const textarea = textareaRef.current
            // if we have a saved height, use it to prevent layout shift
            if (savedHeightRef.current) {
                textarea.style.height = 'auto'
                const contentHeight = textarea.scrollHeight - 14
                textarea.style.height = Math.max(savedHeightRef.current - 14, contentHeight-14) + 'px'
                savedHeightRef.current = null // clear after first use
            } else {
                // auto-resize textarea to fit content (reduced height)
                textarea.style.height = 'auto'
                textarea.style.height = (textarea.scrollHeight - 14) + 'px'
            }
            textarea.focus()
            textarea.select()
        }
    }, [isEditing])

    // handle height resizing on content change (without focus/select)
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            const textarea = textareaRef.current
            // auto-resize textarea to fit content (reduced height)
            textarea.style.height = 'auto'
            textarea.style.height = (textarea.scrollHeight - 14) + 'px'
        }
    }, [titleValue, isEditing])

    useEffect(() => {
        setTitleValue(task?.title || '')
    }, [task?.title])

    // handle scroll detection for sticky header
    useEffect(() => {
        const contentElement = document.querySelector('.task-details-content')
        if (!contentElement) return

        const onScroll = () => {
            setIsScrolled(contentElement.scrollTop > 0)
        }

        contentElement.addEventListener('scroll', onScroll)
        return () => contentElement.removeEventListener('scroll', onScroll)
    }, [])

    async function onToggleStatus(ev) {
        ev.stopPropagation()

        if (!board) return
        const newStatus = task.status === 'done' ? 'inProgress' : 'done'
        
        try {
            await updateTask(board, groupId, taskId, { status: newStatus })
            onTaskUpdate({ ...task, status: newStatus })
        } catch (err) {
            console.log('Error toggling status:', err)
            showErrorMsg('Cannot update task status')
        }
    }

    async function handleSaveTitle() {
        if (!board || !task) return
        
        const trimmedTitle = titleValue.trim()
        if (trimmedTitle === task.title) {
            setIsEditing(false)
            return
        }

        if (!trimmedTitle) {
            setTitleValue(task.title)
            setIsEditing(false)
            return
        }

        try {
            await updateTask(board, groupId, taskId, { title: trimmedTitle })
            onTaskUpdate({ ...task, title: trimmedTitle })
            setIsEditing(false)
        } catch (err) {
            console.log('Error updating title:', err)
            showErrorMsg('Cannot update task title')
            setTitleValue(task.title)
            setIsEditing(false)
        }
    }

    function handleKeyDown(ev) {
        if (ev.key === 'Enter' && !ev.shiftKey) {
            ev.preventDefault()
            handleSaveTitle()
        } else if (ev.key === 'Escape') {
            setTitleValue(task.title)
            setIsEditing(false)
        }
    }

    function handleClick() {
        if (!isEditing && h2Ref.current) {
            // measure h2 height before switching to edit mode
            savedHeightRef.current = h2Ref.current.offsetHeight
            setIsEditing(true)
        }
    }

    if (!task) return null

    return (
        <div className={`task-details-header ${isScrolled ? 'scrolled' : ''}`}>
            <button className="toggle-done-btn" onClick={onToggleStatus}>
                {task.status === 'done' ?
                    <LightTooltip title="Mark incomplete">
                        <img src={doneIcon} style={{ width: '20px', height: '20px' }} alt="Done" />
                    </LightTooltip>
                    : <LightTooltip title="Mark complete">
                        <img src={emptyCircleIcon} style={{ width: '20px', height: '20px' }} alt="Not done" />
                    </LightTooltip>
                }
            </button>
            <div className="task-title-wrapper">
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        className="task-title-edit"
                        value={titleValue}
                        onChange={(e) => setTitleValue(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <h2 ref={h2Ref} onClick={handleClick}>{task.title}</h2>
                )}
            </div>
            {onOpenPopup && (
                <button 
                    className={`btn-add ${isScrolled ? 'visible' : ''}`} 
                    onClick={(e) => onOpenPopup('add', e)}
                >
                    + Add
                </button>
            )}
        </div>
    )
}

