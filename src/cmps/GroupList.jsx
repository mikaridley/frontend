import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    DragOverlay
} from '@dnd-kit/core'
import {
    SortableContext,
    useSortable,
    arrayMove,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { GroupPreview } from './GroupPreview'
import { TaskPreview } from './TaskPreview'

import { groupService } from '../services/group/'
import { addGroup, updateGroup } from '../store/actions/group.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { updateBoard } from '../store/actions/board.actions'
import closeIcon from '../assets/img/close.svg'

export function GroupList() {
    const board = useSelector(storeState => storeState.boardModule.board)
    const [group, setGroup] = useState(groupService.getEmptyGroup())
    const [isAddingGroup, setIsAddingGroup] = useState(false)

    // For drag and drop
    const [groups, setGroups] = useState([])
    const [activeId, setActiveId] = useState(null)
    const [activeType, setActiveType] = useState(null)

    useEffect(() => {
        setGroups(board.groups || [])
    }, [board])

    async function onAddGroup(ev) {
        ev.preventDefault()
        setIsAddingGroup(false)

        try {
            if (!group.title) return
            const newGroup = await addGroup(board, group)

            setGroup(groupService.getEmptyGroup())
            setGroups(groups => [...groups, newGroup])

            setIsAddingGroup(true)
            showSuccessMsg('Added')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to Add`)
        }
    }

    async function onUpdateGroup(title, group) {
        try {
            if (!title || group.title === title) return

            await updateGroup(board, { ...group, title })
            showSuccessMsg('Updated')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to update`)
        }
    }

    async function archiveGroup(group) {
        try {
            const updatedGroup = await updateGroup(board, { ...group, archivedAt: Date.now() })
            setGroups(prevGroups => prevGroups.filter(group => group.id !== updatedGroup.id))
            showSuccessMsg('List archived')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to archive`)
        }
        setGroup(groupService.getEmptyGroup())
    }

    function handleChange({ target }) {
        const value = target.value
        console.log('group:', group)
        setGroup(prevGroup => ({ ...prevGroup, title: value }))
    }

    //Drag and drop//

    function SortableItem({ id, children }) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id })

        return (
            <div
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition,
                    opacity: isDragging ? 0.6 : 1,
                    cursor: 'grab',
                }}
            >
                {children}
            </div>
        )
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    )

    function findGroup(id) {
        if (groups.find(group => group.id === id)) return id
        return groups.find(group => group.tasks?.some(t => t.id === id))?.id
    }

    function handleDragStart({ active }) {
        setActiveId(active.id)
        const isGroup = groups.some(group => group.id === active.id)
        setActiveType(isGroup ? 'group' : 'task')
    }

    async function handleDragOver({ active, over }) {
        const overId = over?.id
        if (!overId || active.id === overId) return

        if (activeType === 'group') return

        const activeContainer = findGroup(active.id)
        const overContainer = findGroup(overId)

        if (!activeContainer || !overContainer || activeContainer === overContainer) return

        setGroups(prev => {
            const activeGroup = prev.find(group => group.id === activeContainer)
            const overGroup = prev.find(group => group.id === overContainer)

            if (!activeGroup || !overGroup || !activeGroup.tasks) return prev

            const activeIndex = activeGroup.tasks.findIndex(task => task.id === active.id)
            const overIndex = overGroup.tasks.findIndex(task => task.id === overId)

            let newIndex = overIndex >= 0 ? overIndex : overGroup.tasks.length

            return prev.map(group => {
                if (group.id === activeContainer) {
                    return { ...group, tasks: group.tasks.filter(task => task.id !== active.id) }
                }
                if (group.id === overContainer) {
                    const newTasks = [...(group.tasks || [])]
                    newTasks.splice(newIndex, 0, activeGroup.tasks[activeIndex])
                    return { ...group, tasks: newTasks }
                }
                return group
            })
        })
    }

    async function handleDragEnd({ active, over }) {
        try {
            if (!over) return

            if (activeType === 'group') {
                if (active.id !== over.id) {
                    const oldIndex = groups.findIndex(g => g.id === active.id)
                    const newIndex = groups.findIndex(g => g.id === over.id)
                    const newOrder = arrayMove(groups, oldIndex, newIndex)
                    setGroups(newOrder)
                    await updateBoard({ ...board, groups: newOrder })
                }
            } else await updateBoard({ ...board, groups })
            showSuccessMsg('Saved')
        } catch (err) {
            showErrorMsg('Failed to save')
            setGroups(board.groups)
        } finally {
            setActiveId(null)
            setActiveType(null)
        }
    }

    const visibleGroups = groups?.filter(group => group && !group.archivedAt) || []
    const activeGroup = activeType === 'group' ? groups.find(group => group.id === activeId) : null
    const activeTask = activeType === 'task' ? groups.flatMap(group =>
        group.tasks).find(task => task.id === activeId) : null

    return (
        <section className='group-list flex'>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
            >
                <SortableContext
                    items={visibleGroups.map(group => group.id)}
                    strategy={rectSortingStrategy}
                >

                    <div style={{ display: 'flex', flexDirection: 'row', gap: 12, }}>
                        {!!visibleGroups?.length && visibleGroups.map(group => (
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
            </DndContext >

            {!isAddingGroup &&
                <button className='add-btn' onClick={() => setIsAddingGroup(true)}>
                    Add another list
                </button>
            }
            {isAddingGroup &&
                <form className='add-form' onSubmit={onAddGroup}>
                    <input
                        onChange={handleChange}
                        onBlur={() => setIsAddingGroup(false)}
                        placeholder='Enter list name...'
                        autoFocus
                    />

                    <div className='form-btns flex'>
                        <button className='btn' onMouseDown={onAddGroup}>Add List</button>
                        <button type='button' onClick={() => setIsAddingGroup(false)}>
                            <img src={closeIcon} />
                        </button>
                    </div>
                </form>
            }
        </section >
    )
}