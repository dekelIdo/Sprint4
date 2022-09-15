import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { boardService } from '../services/board.service'
import { removeGroup, storeAddGroup } from '../store/board.actions'
import { GroupPreview } from './group-preview'
import { addGroup } from "../store/board.actions";
import { ReactComponent as CloseAddGroup } from '../assets/img/close-task-form.svg'

export function GroupList() {
  const board = useSelector(state => state.boardModule.board)
  const dispatch = useDispatch()

  const [isAddGroup, setIsAddGroup] = useState(false)

  const onAddGroup = (ev) => {
    ev.preventDefault()
    const listTitle = ev.target[0].value
    dispatch(addGroup(board._id, listTitle, 'user added a List'))
  }

  const onRemoveGroup = (ev, groupId) => {
    ev.preventDefault()
    dispatch(removeGroup(board._id, groupId, 'user deleted a List'))


  }

  return (
    <section className='group-list'>
      {board?.groups && board.groups.map(group => {
        return (
          <li key={group.id}>
            <GroupPreview 
                group={group}
                boardId={board._id}
                onRemoveGroup={onRemoveGroup}
            />
          </li>
        )
      })}

      {!isAddGroup && (
        <div
          className='add-group-view'
          onClick={() => setIsAddGroup(!isAddGroup)}
        >
          <span className='add-group-icon'>
            <svg
              stroke='currentColor'
              fill='currentColor'
              strokeWidth='0'
              viewBox='0 0 24 24'
              className='icon'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fill='none'
                stroke='#000'
                strokeWidth='2'
                d='M12,22 L12,2 M2,12 L22,12'
              ></path>
            </svg>
          </span>
          <span>Add another List</span>
        </div>
      )}

      {isAddGroup && (
        <div className='add-group-form'>
          <form className='add-group' onSubmit={onAddGroup}>
            <input type='text'  placeholder='Enter list title' />
            <div className='add-group-actions'>
              <button className='add-group-btn'>Add list</button>
              <CloseAddGroup
                className='close-add-group-icon'
                onClick={() => setIsAddGroup(!isAddGroup)}
              />
            </div>
          </form>
        </div>
      )}

    </section>
  )
}
