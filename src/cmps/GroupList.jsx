import { useState } from 'react'
import { useSelector } from 'react-redux'

import { GroupPreview } from './GroupPreview'
import { groupService } from '../services/group/'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function GroupList({ groups }) {
    const [newGroup, setNewGroup] = useState(groupService.getEmptyGroup())
    const [isAddingGroup, setIsAddingGroup] = useState(false)
    const board = useSelector(storeState => storeState.boardModule.board)

    async function onUpdateGroup(title, group) {
        try {
            if (!title) return
            group.title = title
            await groupService.updateGroup(board, group.id, { title })
            showSuccessMsg('Updated')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to update`)
        }
    }

    function onAddGroup() {
        setIsAddingGroup(false)
        if(!newGroup.title) return
        groupService.addGroup(board, newGroup)
    }

    function handleChange({ target }) {
        const value = target.value
        setNewGroup(prevGroup => ({ ...prevGroup, title: value }))
    }

    return (
        <ul className='group-list flex clean-list'>
            {groups.map(group =>
                <li key={group.id}>
                    <GroupPreview group={group} onUpdateGroup={onUpdateGroup} />
                </li>
            )}
            <li>
                {!isAddingGroup &&
                    <button onClick={() => setIsAddingGroup(true)}>
                        Add another list
                    </button>
                }
                {isAddingGroup &&
                    <section className='add-group flex column'>
                        <input onChange={handleChange} />
                        <button onClick={onAddGroup}>Add List</button>
                        <button type='button' onClick={() => setIsAddingGroup(false)}>X</button>
                    </section>
                }
            </li>
        </ul>
    )
}