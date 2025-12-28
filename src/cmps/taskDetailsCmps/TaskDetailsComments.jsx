import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { updateTask } from '../../store/actions/task.actions'
import { makeId } from '../../services/util.service'
import { showErrorMsg } from '../../services/event-bus.service'
import { userService } from '../../services/user'

export function TaskDetailsComments({ boardId, groupId, taskId, board, comments: initialComments, onCommentsUpdate, loggedinUser }) {
    const [comments, setComments] = useState(initialComments || [])
    const [newComment, setNewComment] = useState('')
    const [isAddingComment, setIsAddingComment] = useState(false)

    // update comments when initialComments changes
    useEffect(() => {
        setComments(initialComments || [])
    }, [initialComments])

    function startAddingComment() {
        setIsAddingComment(true)
    }

    async function saveComment(ev) {
        ev.preventDefault()
        if (!board || !newComment.trim()) return
        
        // Get user from prop or fallback to service
        const user = loggedinUser || userService.getLoggedinUser()
        if (!user) {
            showErrorMsg('You must be logged in to add a comment')
            return
        }
        
        try {
            const commentObj = {
                id: makeId(),
                userId: user._id,
                userFullname: user.fullname,
                userImgUrl: user.imgUrl,
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
                    {[...comments]
                        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
                        .map(comment => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                {comment.userImgUrl && (
                                    <img 
                                        src={comment.userImgUrl} 
                                        alt={comment.userFullname || 'User'} 
                                        className="comment-user-avatar"
                                    />
                                )}
                                <span className="comment-user-name">
                                    {comment.userFullname || 'Unknown User'}
                                </span>
                            </div>
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

