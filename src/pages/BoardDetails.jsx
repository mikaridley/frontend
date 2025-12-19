import { useEffect } from 'react'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { loadBoard, updateBoard } from '../store/actions/board.actions'

import { BoardHeader } from '../cmps/BoardHeader'
import { GroupList } from '../cmps/GroupList'
import { useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router'

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
            if (!title || board.title === title) return

            board.title = title
            updateBoard(board)
            showSuccessMsg('Updated')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to update`)
        }
    }

    if (!board) return

    const bg = board.style.background.kind === 'solid' ? 'backgroundColor' : 'background'

    return (
        <section className='board-details' style={{ [bg]: board.style.background.color }}>
            <BoardHeader
                title={board.title}
                isStarred={board.isStarred}
                onUpdateBoard={onUpdateBoard}
            />
            <GroupList groups={board.groups} members={board.members} />
            <Outlet />
        </section>
    )
}