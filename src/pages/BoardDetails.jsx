import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { boardService } from '../services/board/'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { updateBoard } from '../store/actions/board.actions'

import { BoardHeader } from '../cmps/BoardHeader'
import { GroupList } from '../cmps/GroupList'

export function BoardDetails() {
    const [board, setBoard] = useState()
    const { boardId } = useParams()

    useEffect(() => {
        loadBoard()
    }, [])

    async function loadBoard() {
        try {
            const board = await boardService.getById(boardId)
            setBoard(board)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Could noe load board')
        }
    }

    function handleChande({ target }) {
        let value = target.value
        setBoard(prevBoard => ({ ...prevBoard, title: value }))
    }

    function onUpdateBoard() {
        try {
            if (!board.title) return
            updateBoard(board)
            showSuccessMsg('Updated')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to update`)
        }
    }

    if (!board) return
    return (
        <section className='board-details' style={{ backgroundColor: board.style.backgroundColor }}>
            <BoardHeader
                title={board.title}
                handleChande={handleChande}
                onUpdateBoard={onUpdateBoard}
            />
            <GroupList groups={board.groups} members={board.members} />
        </section>
    )
}