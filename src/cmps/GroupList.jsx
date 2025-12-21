import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    SortableContext,
    useSortable,
    arrayMove,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"

import { GroupPreview } from './GroupPreview'

import { groupService } from '../services/group/'
import { addGroup, updateGroup } from '../store/actions/group.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { updateBoard } from '../store/actions/board.actions'
import closeIcon from '../assets/img/close.svg'

export function GroupList() {
    const board = useSelector(storeState => storeState.boardModule.board)
    const [groups, setGroups] = useState([])
    const [group, setGroup] = useState(groupService.getEmptyGroup())
    const [isAddingGroup, setIsAddingGroup] = useState(false)

    useEffect(() => {
        setGroups(board.groups || [])
    }, [board])

    async function onAddGroup(ev) {
        ev.preventDefault()
        setIsAddingGroup(false)

        try {
            if (!group.title) return
            await addGroup(board, group)
            setGroup({ title: '' })

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

            group.title = title
            await updateGroup(board, group)
            showSuccessMsg('Updated')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to update`)
        }
    }

    async function archiveGroup(group) {
        try {
            group.archivedAt = Date.now()
            await updateGroup(board, group)
            showSuccessMsg('List archived')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to archive`)
        }
        setGroup({ id: '', title: '' })
    }

    function handleChange({ target }) {
        const value = target.value
        setGroup(prevGroup => ({ ...prevGroup, title: value }))
    }

    function SortableItem({ id, children }) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id });

        return (
            <div
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition,
                    opacity: isDragging ? 0.6 : 1,
                    cursor: "grab",
                }}
            >
                {children}
            </div>
        )
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // prevents accidental drags
            },
        })
    )

    const visibleGroups = groups.filter(group => !group.archivedAt);

    return (
        <section className='group-list flex'>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                    if (!over || active.id === over.id) return;

                    setGroups((groups) => {
                        const oldIndex = groups.findIndex(g => g.id === active.id);
                        const newIndex = groups.findIndex(g => g.id === over.id);
                        const newOrder = arrayMove(groups, oldIndex, newIndex)

                        updateBoard({ ...board, groups: newOrder })

                        return newOrder
                    })
                }}
            >
                <SortableContext items={visibleGroups.map(g => g.id)} strategy={rectSortingStrategy}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 12,
                        }}
                    >
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