import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { updateTask } from '../../store/actions/task.actions'
import { makeId } from '../../services/util.service'
import { showErrorMsg } from '../../services/event-bus.service'

export function TaskDetailsComments({ boardId, groupId, taskId, board, comments: initialComments, onCommentsUpdate }) {
    const [comments, setComments] = useState(initialComments || [])
    const [newComment, setNewComment] = useState('')
    const [isAddingComment, setIsAddingComment] = useState(false)

    // Update comments when initialComments changes
    useEffect(() => {
        setComments(initialComments || [])
    }, [initialComments])

    function startAddingComment() {
        setIsAddingComment(true)
    }

    async function saveComment(ev) {
        ev.preventDefault()
        if (!board || !newComment.trim()) return
        try {
            const commentObj = {
                id: makeId(),
                text: newComment,
                createdAt: Date.now()
            }
            const updatedComments = [...comments, commentObj]
            await updateTask(board, groupId, taskId, { comments: updatedComments })
            setComments(updatedComments)
            onCommentsUpdate(updatedComments)
            setNewComment('')
            setIsAddingComment(false)
        } catch (err) {
            console.log('Error saving comment:', err)
            showErrorMsg('Cannot save comment')
        }
    }

    function cancelAddingComment() {
        setIsAddingComment(false)
        setNewComment('')
    }

    return (
        <div className="comments-section">
            <h5>Comments</h5>
            {isAddingComment && (
                <form onSubmit={saveComment}>
                    <ReactQuill
                        theme="snow"
                        value={newComment}
                        onChange={setNewComment}
                        placeholder="Write a comment..."
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={cancelAddingComment}>Cancel</button>
                </form>
            )}
            {!isAddingComment && (
                <div onClick={startAddingComment} className="task-comment-button">
                    <span>Write a comment...</span>
                </div>
            )}
            {comments.length > 0 && (
                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <div dangerouslySetInnerHTML={{ __html: comment.text }} />
                            <span className="comment-date">
                                {new Date(comment.createdAt).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            
            
        </div>
    )
}

