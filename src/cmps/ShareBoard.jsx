import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { loadUsers } from "../store/actions/user.actions"


export function ShareBoard({ onToggleShare, onUpdateBoard }) {
    const board = useSelector(storeState => storeState.boardModule.board)
    const users = useSelector(storeState => storeState.userModule.users)
    const [user, setUser] = useState()
    const [filterUsers, setFilterUsers] = useState({ txt: '' })

    useEffect(() => {
        loadUsers(filterUsers)
    }, [filterUsers])

    function handleChange({ target }) {
        const value = target.value
        setFilterUsers({ txt: value })
    }

    function onAddMember(ev) {
        ev.preventDefault()
        onToggleShare()

        const boardToEdit = { ...board, members: [...board.members, user] }
        onUpdateBoard(boardToEdit)
    }

    const { txt } = filterUsers
    console.log(txt)

    return (
        <div className="share-overlay"
        // onClick={onToggleShare}
        >
            <section className="share-board">
                <h1>Share board</h1>
                <form className="users-input flex" onSubmit={onAddMember}>
                    <input
                        type="text"
                        placeholder="Email adress or name"
                        onChange={handleChange}
                        value={txt}
                    />
                    <ul>
                        {filterUsers.txt && users.map(user =>
                            <li
                                key={user._id}
                                className='user-details grid'
                                onClick={() => setUser(user)}
                            >
                                {user.imgUrl && <img src={user.imgUrl} />}
                                <h1>{user.fullname}</h1>
                                <p>{user.email}</p>
                            </li>
                        )}
                    </ul>
                    <button>Share</button>
                </form>
                <h2>Board members</h2>
                <ul className="board-members">
                    {board.members.map(member =>
                        <li className='user-details grid' key={member._id}>
                            {member.imgUrl && <img src={member.imgUrl} />}
                            <h1>{member.fullname}</h1>
                            <p>{member.email}</p>
                        </li>
                    )}
                </ul>
            </section>
        </div>
    )
}