import { useState } from 'react'
import { GroupPreview } from './GroupPreview'

export function GroupList({ groups }) {
    return (
        <ul className='group-list flex clean-list'>
            {groups.map(group =>
                <li key={group.id}>
                    <GroupPreview group={group} />
                </li>
            )}
            <li>
                <button>Add another list</button>
            </li>
        </ul>
    )
}