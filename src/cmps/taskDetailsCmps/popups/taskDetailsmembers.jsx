import { taskService } from '../../../services/task'
import { useState, useEffect, useRef } from 'react'
import { getMemberInitials } from '../../../services/util.service'
import { popupToViewportHook } from '../../../customHooks/popupToViewportHook'
export function TaskDetailsMembers({ board, groupId, taskId, onClose, onSave, position }) {

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMemberIds, setSelectedMemberIds] = useState([])
    const popupRef = useRef(null)
    const availableMembers = (taskService.getMembers(board) || []).filter(member => member)

    useEffect(() => {
        const task = taskService.getTaskById(board, groupId, taskId)
        if (task?.members && Array.isArray(task.members)) {
            const memberIds = task.members
                .filter(member => member) // filter out null/undefined members
                .map(member => member._id || member.id)
                .filter(id => id) // filter out any null/undefined ids
            setSelectedMemberIds(memberIds)
        } else {
            setSelectedMemberIds([])
        }
    }, [board, groupId, taskId])

    // separate members into two groups: task members and non-task members
    const taskMembers = availableMembers.filter(member => 
        selectedMemberIds.includes(member._id)
    )
    const nonTaskMembers = availableMembers.filter(member =>
        !selectedMemberIds.includes(member._id)
    )

    // filter members based on search term
    const filteredTaskMembers = taskMembers.filter(member =>
        member.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const filteredNonTaskMembers = nonTaskMembers.filter(member =>
        member.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
    )

  // keep popup fully visible vertically
  popupToViewportHook(popupRef, position)

    async function toggleMember(memberId, e) {
        if (e) e.stopPropagation()
        setSelectedMemberIds(prev => {
            const isSelected = prev.includes(memberId)
            const newSelection = isSelected
                ? prev.filter(id => id !== memberId)   //remove memberId from selectedMemberIds
                : [...prev, memberId]   //add memberId to selectedMemberIds
            
            // calculate selected members from new selection
            const selectedMembers = availableMembers.filter(member => 
                newSelection.includes(member._id)
            )
            
            // call onSave to update task and taskDetails members state
            if (onSave) {
                onSave('members', selectedMembers)
            }

            return newSelection
        })
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div
                ref={popupRef}
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
                    
                    {/* task members section */}
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
                                        <img src={member.imgUrl} className="member-avatar" />
                                        <span>{member.fullname}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* non-task members section */}
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
                                        <img src={member.imgUrl} className="member-avatar" />
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

