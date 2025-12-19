import { useState } from 'react'
import { useSelector } from 'react-redux'

import { GroupPreview } from './GroupPreview'

import { groupService } from '../services/group/'
import { addGroup, updateGroup } from '../store/actions/group.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function GroupList({ groups }) {
    const board = useSelector(storeState => storeState.boardModule.board)
    const [group, setGroup] = useState(groupService.getEmptyGroup())
    const [isAddingGroup, setIsAddingGroup] = useState(false)

    async function onAddGroup(ev) {
        ev.preventDefault()
        setIsAddingGroup(false)

        try {
            if (!group.title) return
            await addGroup(board, group)
            setIsAddingGroup(true)
            showSuccessMsg('Added')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to Add`)
        }
        setGroup(group => group.title = '')
    }

    async function onUpdateGroup(title, group) {
        try {
            if (!title || group.title === title) return

            group.title = title
            await updateGroup(board, group)
            showSuccessMsg('Updated')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to update`)
        }
    }

    async function archiveGroup(group) {
        try {
            group.archivedAt = Date.now()
            await updateGroup(board, group)
            showSuccessMsg('List archived')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to archive`)
        }
        setGroup({ id: '', title: '' })
    }

    function handleChange({ target }) {
        const value = target.value
        setGroup(prevGroup => ({ ...prevGroup, title: value }))
    }

    return (
        <ul className='group-list flex clean-list'>
            {!!groups?.length &&
                groups.map(group =>
                    !group.archivedAt &&
                    <li key={group.id}>
                        <GroupPreview
                            group={group}
                            onUpdateGroup={onUpdateGroup}
                            archiveGroup={archiveGroup}
                        />
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
                            value={group.title}
                            autoFocus
                        />

                        <div className='form-btns'>
                            <button className='btn'
                                onMouseDown={onAddGroup}
                                onClick={onAddGroup}
                            >Add List
                            </button>
                            <button type='button' onClick={() => setIsAddingGroup(false)}>X</button>
                        </div>
                    </form>
                }
            </li>
        </ul>
    )
}