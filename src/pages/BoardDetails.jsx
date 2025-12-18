import { useEffect, useState } from 'react'

import { boardService } from '../services/board/'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { loadBoard, updateBoard } from '../store/actions/board.actions'

import { BoardHeader } from '../cmps/BoardHeader'
import { GroupList } from '../cmps/GroupList'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

export function BoardDetails() {
    const board = useSelector(storeState => storeState.boardModule.board)
    const [title, setTitle] = useState('')
    const { boardId } = useParams()

    useEffect(() => {
        loadBoard(boardId)
        setTitle(board.title)
    }, [])

    // async function loadBoard() {
    //     try {
    //         const board = await boardService.getById(boardId)
    //         setBoard(board)
    //     } catch (err) {
    //         console.log('err:', err)
    //         showErrorMsg('Could not load board')
    //     }
    // }

    function handleChange({ target }) {
        console.log('target:', target)
        let value = target.value
        setTitle(value)
    }

    function onUpdateBoard() {
        try {
            if (!title) return
            board.title = title
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
                title={title}
                handleChange={handleChange}
                onUpdateBoard={onUpdateBoard}
            />
            <GroupList groups={board.groups} members={board.members} />
        </section>
    )
}