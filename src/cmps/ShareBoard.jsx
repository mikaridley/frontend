import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { loadUsers } from "../store/actions/user.actions"
import closeIcon from '../assets/img/close.svg'

export function ShareBoard({ onToggleShare, onUpdateBoard }) {
    const board = useSelector(storeState => storeState.boardModule.board)
    const users = useSelector(storeState => storeState.userModule.users)
    const [selectedUser, setSelectedUser] = useState()
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

        if (!selectedUser || board.members.find(member => member._id === selectedUser._id)) return

        const boardToEdit = { ...board, members: [...board.members, selectedUser] }
        onUpdateBoard(boardToEdit)
        setSelectedUser(null)
    }

    function onSelectMember(user) {
        setSelectedUser(user)
        setFilterUsers({ txt: '' })
    }

    const { txt } = filterUsers
    const placeHolder = selectedUser ? '' : 'Email adress or name'

    return (
        <div className="share-overlay grid" onClick={onToggleShare}>
            <section className="share-board grid" onClick={event => event.stopPropagation()}>
                <header className="share-header flex space-between">
                    <h1>Share board</h1>
                    <button onClick={onToggleShare}>
                        <img src={closeIcon} />
                    </button>
                </header>

                <form className="users-input flex" onSubmit={onAddMember}>
                    <input
                        type="text"
                        onClick={() => setSelectedUser(null)}
                        placeholder={placeHolder}
                        onChange={handleChange}
                        value={txt}
                    />
                    {selectedUser &&
                        <p className="selected-user">{selectedUser.fullname}</p>
                    }
                    {filterUsers.txt &&
                        <ul className="filtered-users grid">
                            {users.map(user =>
                                <li key={user._id}
                                    className='user-details grid'
                                    onClick={() => onSelectMember(user)}
                                >
                                    {user.imgUrl && <img src={user.imgUrl} />}
                                    <h1>{user.fullname}</h1>
                                    <p>{user.email}</p>
                                </li>
                            )}
                        </ul>
                    }
                    <button className="btn">Share</button>
                </form>
                <h2>Board members</h2>
                <ul className="board-members">
                    {board.members.filter(member => member).map(member =>
                        <li className='user-details grid' key={member._id}>
                            {member.imgUrl && <img src={member.imgUrl} />}
                            <h1>{member.fullname}</h1>
                            <p>{member.email}</p>
                        </li>
                    )}
                </ul>
            </section>
        </div >
    )
}