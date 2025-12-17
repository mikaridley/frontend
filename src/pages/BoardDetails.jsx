import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { boardService } from '../services/board/'
import { showErrorMsg } from '../services/event-bus.service'

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
    
    console.log('board:', board)

    if (!board) return
    return (
        <section className='board-details' style={{ backgroundColor: board.style.backgroundColor }}>
            <BoardHeader title={board.title} />
            <GroupList groups={board.groups} />
        </section>
    )
}