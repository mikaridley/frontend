import { taskService } from '../../services/task/task.service.local'
import { useState, useEffect } from 'react'

export function TaskDetailsMembers({ board, groupId, taskId, onClose, onSave, position }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMemberIds, setSelectedMemberIds] = useState([])
    const availableMembers = taskService.getMembers(board)
    
    useEffect(() => {
        const task = taskService.getTaskById(board, groupId, taskId)
        if (task?.members && Array.isArray(task.members)) {
            const memberIds = task.members.map(member => member._id || member.id)
            setSelectedMemberIds(memberIds)
        } else {
            setSelectedMemberIds([])
        }
    }, [board, groupId, taskId])

    // Separate members into two groups: task members and non-task members
    const taskMembers = availableMembers.filter(member => 
        selectedMemberIds.includes(member._id)
    )
    const nonTaskMembers = availableMembers.filter(member => 
        !selectedMemberIds.includes(member._id)
    )

    // Filter members based on search term
    const filteredTaskMembers = taskMembers.filter(member =>
        member.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const filteredNonTaskMembers = nonTaskMembers.filter(member =>
        member.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    async function toggleMember(memberId, e) {
        if (e) e.stopPropagation()
        setSelectedMemberIds(prev => {
            const isSelected = prev.includes(memberId)
            const newSelection = isSelected
                ? prev.filter(id => id !== memberId)   //remove memberId from selectedMemberIds
                : [...prev, memberId]   //add memberId to selectedMemberIds
            
            // Calculate selected members from new selection
            const selectedMembers = availableMembers.filter(member => 
                newSelection.includes(member._id)
            )
            
            // Call onSave to update task and TaskDetails members state
            if (onSave) {
                onSave('members', selectedMembers)
            }
            
            return newSelection
        })
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div
                className="popup-content popup-members"
                onClick={(e) => e.stopPropagation()}
                style={position ? {
                    top: `${position.top}px`,
                    left: `${position.left}px`
                } : {}}
            >
                <button className="popup-close" onClick={onClose}>×</button>
                <h3>Members</h3>
                <div className="popup-body">
                    <form>
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                    
                    {/* Task Members Section */}
                    {filteredTaskMembers.length > 0 && (
                        <div className="members-section">
                            <h5>Task Members</h5>
                            {filteredTaskMembers.map(member => (
                                <div
                                    key={member._id}
                                    className="member-item selected"
                                    onClick={(e) => toggleMember(member._id, e)}
                                >
                                    <div className="member-info">
                                        <span>{member.fullname}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Non-Task Members Section */}
                    {filteredNonTaskMembers.length > 0 && (
                        <div className="members-section">
                            <h5>Board Members</h5>
                            {filteredNonTaskMembers.map(member => (
                                <div
                                    key={member._id}
                                    className="member-item"
                                    onClick={(e) => toggleMember(member._id, e)}
                                >
                                    <div className="member-info">
                                        <span>{member.fullname}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredTaskMembers.length === 0 && filteredNonTaskMembers.length === 0 && (
                        <div className="no-members">No members found</div>
                    )}
                </div>
            </div>
        </div>
    )
}

