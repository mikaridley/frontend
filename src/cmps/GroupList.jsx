import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable'

import { GroupPreview } from './GroupPreview'
import { TaskPreview } from './TaskPreview'
import { SortableItem } from './SortableItem'

import { addGroup, updateGroup } from '../store/actions/group.actions'
import { groupService } from '../services/group/'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import closeIcon from '../assets/img/close.svg'

export function GroupList({ filteredBoard, onUpdateBoard }) {
  const [searchParams] = useSearchParams()
  const [group, setGroup] = useState(groupService.getEmptyGroup())
  const [isAddingGroup, setIsAddingGroup] = useState(false)

  // For drag and drop
  const [groups, setGroups] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [activeType, setActiveType] = useState(null)
  const isFilteredBoard = searchParams.size > 0

  useEffect(() => {
    setGroups(filteredBoard?.groups || [])
  }, [filteredBoard])

  async function onAddGroup(ev) {
    ev.preventDefault()
    setIsAddingGroup(false)
    if (!group.title) return

    try {
      const newGroup = { ...group }
      setGroup(groupService.getEmptyGroup())
      setGroups(prev => [...(prev || []), newGroup])

      await addGroup(filteredBoard, newGroup)
      setIsAddingGroup(true)
    } catch (err) {
      console.log('err:', err)
      showErrorMsg(`Failed to add`)
      setGroups(filteredBoard.groups)
    }
  }

  async function onUpdateGroup(groupToEdit) {
    try {
      await updateGroup(filteredBoard, groupToEdit)
    } catch (err) {
      console.log('err:', err)
      showErrorMsg(`Failed to update`)
    }
  }

  async function archiveGroup(groupToArchive) {
    try {
      const updatedGroups = groups.filter(
        group => group.id !== groupToArchive.id
      )
      setGroups(updatedGroups)
      setGroup(groupService.getEmptyGroup())

      await updateGroup(
        filteredBoard,
        { ...groupToArchive, archivedAt: Date.now() },
        true
      )
      showSuccessMsg('List archived')
    } catch (err) {
      console.log('err:', err)
      showErrorMsg(`Failed to archive`)
      setGroups(filteredBoard.groups)
    }
  }

  function handleChange({ target }) {
    const value = target.value
    setGroup(prevGroup => ({ ...prevGroup, title: value }))
  }

  //Drag and drop//
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  function getContainer(id) {
    if (groups.find(group => group.id === id)) return id
    return groups.find(group => group.tasks?.some(task => task.id === id))?.id
  }

  function handleDragStart({ active }) {
    if (isFilteredBoard) return

    const isGroup = groups.some(group => group.id === active.id)
    setActiveType(isGroup ? 'group' : 'task')
    setActiveId(active.id)
  }

  function handleDragEnd({ active, over }) {
    if (isFilteredBoard) return

    setActiveId(null)
    setActiveType(null)

    if (!over) return
    let nextGroups = groups

    if (activeType === 'group' && active.id !== over.id) {
      const oldIndex = groups.findIndex(group => group.id === active.id)
      const newIndex = groups.findIndex(group => group.id === over.id)
      nextGroups = arrayMove(groups, oldIndex, newIndex)
    }

    if (activeType === 'task') {
      const fromId = getContainer(active.id)
      const toId = getContainer(over.id)

      if (!fromId || !toId) return

      if (fromId === toId) {
        nextGroups = groups.map(group => {
          if (group.id !== fromId) return group

          const oldIndex = group.tasks.findIndex(task => task.id === active.id)
          const newIndex = group.tasks.findIndex(task => task.id === over.id)

          return {
            ...group,
            tasks: arrayMove(group.tasks, oldIndex, newIndex),
          }
        })
      }

      else {
        const fromGroup = groups.find(group => group.id === fromId)
        const task = fromGroup.tasks.find(task => task.id === active.id)

        nextGroups = groups.map(group => {
          if (group.id === fromId) {
            return {
              ...group,
              tasks: group.tasks.filter(task => task.id !== active.id),
            }
          }

          if (group.id === toId) {
            const index = group.tasks.findIndex(task => task.id === over.id)
            const newTasks = [...group.tasks]
            newTasks.splice(index < 0 ? newTasks.length : index, 0, task)
            return { ...group, tasks: newTasks }
          }

          return group
        })
      }
    }

    setGroups(nextGroups)
    onUpdateBoard({ ...filteredBoard, groups: nextGroups }).catch(() => {
      setGroups(filteredBoard.groups)
    })
  }


  const visibleGroups =
    groups?.filter(group => group && !group.archivedAt) || []

  const activeGroup =
    activeType === 'group' ? groups.find(group => group.id === activeId) : null

  const activeTask =
    activeType === 'task'
      ? groups
        .flatMap(group => group.tasks || [])
        .find(task => task.id === activeId)
      : null

  return (
    <section className="group-list board-details-layout">
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={isFilteredBoard ? () => showErrorMsg('Cannot drag when board is filtered') : handleDragStart}
        onDragEnd={isFilteredBoard ? null : handleDragEnd}
      >
        <SortableContext
          items={visibleGroups.map(group => group.id)}
          strategy={rectSortingStrategy}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 12,
            }}
          >
            {!!visibleGroups?.length &&
              visibleGroups.map(group => (
                <SortableItem key={group.id} id={group.id}>
                  <GroupPreview
                    group={group}
                    onUpdateGroup={onUpdateGroup}
                    archiveGroup={archiveGroup}
                  />
                </SortableItem>
              ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeType === 'group' && activeGroup ? (
            <div style={{ transform: 'rotate(2deg)', opacity: 0.9 }}>
              <GroupPreview group={activeGroup} isOverlay />
            </div>
          ) : activeType === 'task' && activeTask ? (
            <div style={{ transform: 'rotate(3deg)', width: '250px' }}>
              <TaskPreview task={activeTask} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {!isAddingGroup && (
        <button className="add-btn" onClick={() => setIsAddingGroup(true)}>
          Add another list
        </button>
      )}
      {isAddingGroup && (
        <form className="add-form" onSubmit={onAddGroup}>
          <input
            onChange={handleChange}
            onBlur={() => setIsAddingGroup(false)}
            placeholder="Enter list name..."
            autoFocus
          />

          <div className="form-btns flex">
            <button className="btn" onMouseDown={onAddGroup}>
              Add List
            </button>
            <button type="button" onClick={() => setIsAddingGroup(false)}>
              <img src={closeIcon} />
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
