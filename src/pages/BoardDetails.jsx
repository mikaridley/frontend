import { useEffect } from 'react'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { loadBoard, updateBoard } from '../store/actions/board.actions'

import { BoardHeader } from '../cmps/BoardHeader'
import { GroupList } from '../cmps/GroupList'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

export function BoardDetails() {
    const board = useSelector(storeState => storeState.boardModule.board)
    const { boardId } = useParams()

    useEffect(() => {
        try {
            loadBoard(boardId)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Could not load board')
        }
    }, [])

    function onUpdateBoard(title) {
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
                title={board.title}
                onUpdateBoard={onUpdateBoard}
            />
            <GroupList groups={board.groups} members={board.members} />
        </section>
    )
}