import { useDispatch, useSelector } from 'react-redux'
import { BoardList } from '../cmps/BoardList'
import { boardService } from '../services/board'
import {
  addBoard,
  loadBoards,
  updateBoard,
} from '../store/actions/board.actions'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Loader } from '../cmps/Loader'
import { AiChat } from '../cmps/AiChat'
import {
  getRandomColor,
  getRandomGradientColor,
  makeId,
} from '../services/util.service'

export function BoardIndex() {
  const boards = useSelector(storeState => storeState.boardModule.boards)
  const loggedinUser = useSelector(
    storeState => storeState.userModule.loggedinUser
  )
  const navigate = useNavigate()
  const [newBoardColor, setNewBoardColor] = useState('')

  useEffect(() => {
    loadBoards()
  }, [])

  async function _addBoard(ev, value) {
    ev.preventDefault()
    const boardToSave = boardService.getEmptyBoard()
    boardToSave.members = [loggedinUser]
    boardToSave.title = value
    boardToSave.style.background = {
      color: newBoardColor.color || '#0079bf',
      kind: newBoardColor.kind || 'solid',
    }
    console.log(loggedinUser)
    if (loggedinUser)
      boardToSave.createdBy = {
        _id: loggedinUser._id,
        fullname: loggedinUser.fullname,
        imgUrl: loggedinUser.imgUrl,
      }
    const savedBoard = await addBoard(boardToSave)
    navigate(`/board/${savedBoard._id}`)
  }

  async function addAiBoard(board) {
    const boardObject = JSON.parse(board)
    console.log(boardObject)

    const boardToSave = boardService.getEmptyBoard()
    boardToSave.members = [loggedinUser]
    boardToSave.title = boardObject.title
    boardToSave.style.background = getRandomColor()

    if (loggedinUser)
      boardToSave.createdBy = {
        _id: loggedinUser._id,
        fullname: loggedinUser.fullname,
        imgUrl: loggedinUser.imgUrl,
      }

    const randomCover = Math.random() < 0.75 ? getRandomGradientColor() : ''
    const randomLables = boardService.getDefaultLabels()

    if (boardObject.groups && boardObject.groups.length) {
      boardToSave.groups = boardObject.groups.map(group => ({
        id: makeId(),
        title: group.title,
        tasks: group.tasks.map(task => ({
          id: makeId(),
          title: task.title,
          cover: randomCover,
        })),
      }))
    }

    const savedBoard = await addBoard(boardToSave)
    navigate(`/board/${savedBoard._id}`)
  }

  async function addAiBoardFic() {
    const newBoard = await addBoard(boardToSave)
    navigate(`/board/${newBoard._id}`)
  }

  async function starToggle(board) {
    board.isStarred = !board.isStarred
    try {
      await updateBoard(board)
    } catch (err) {
      console.log(err)
    }
  }

  function changeColor({ color, kind }) {
    setNewBoardColor({ color, kind })
  }

  if (!boards) return <Loader />
  return (
    <section className="board-index">
      <BoardList
        boards={boards}
        addBoard={_addBoard}
        starToggle={starToggle}
        changeColor={changeColor}
      />
      <AiChat addAiBoard={addAiBoard} addAiBoardFic={addAiBoardFic} />
    </section>
  )
}
