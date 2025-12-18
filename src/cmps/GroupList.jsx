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
            if (!title || group.title === title) return

            group.title = title
            await groupService.updateGroup(board, group.id, { title })
            showSuccessMsg('Updated')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to update`)
        }
    }

    async function onAddGroup(ev) {
        ev.preventDefault()
        setIsAddingGroup(false)

        try {
            if (!newGroup.title) return

            await groupService.addGroup(board, newGroup)
            setIsAddingGroup(true)
            showSuccessMsg('Added')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to Add`)
        }
        setNewGroup(newGroup => newGroup.title = '')
    }

    function handleChange({ target }) {
        const value = target.value
        setNewGroup(prevGroup => ({ ...prevGroup, title: value }))
    }

    return (
        <ul className='group-list flex clean-list'>
            {groups?.length &&
                groups.map(group =>
                    <li key={group.id}>
                        <GroupPreview group={group} onUpdateGroup={onUpdateGroup} />
                    </li>
                )}
            <li>
                {!isAddingGroup &&
                    <button className='add-btn' onClick={() => setIsAddingGroup(true)}>
                        Add another list
                    </button>
                }
                {isAddingGroup &&
                    <form className='add-form'>
                        <input
                            onChange={handleChange}
                            onBlur={() => setIsAddingGroup(false)}
                            value={newGroup.title}
                            autoFocus
                        />

                        <div className='form-btns'>
                            <button className='btn'
                                onMouseDown={onAddGroup}
                                onClick={onAddGroup}
                            >
                                Add List
                            </button>
                            <button type='button' onClick={() => setIsAddingGroup(false)}>X</button>
                        </div>
                    </form>
                }
            </li>
        </ul>
    )
}