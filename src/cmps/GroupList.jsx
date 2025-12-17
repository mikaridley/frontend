import { GroupPreview } from './GroupPreview'

export function GroupList({ groups }) {
    console.log('groups:', groups)

    return (
        <section className="group-list flex">
            <ul className='flex clean-list'>
                {groups.map(group =>
                    <li key={group.id}>
                        <GroupPreview group={group} />
                    </li>
                )}
            </ul>
            <button>Add another list</button>
        </section>
    )
}