import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DynamicCmp } from './dynamic-cmp'

//icons//
import { ReactComponent as CalenderIcon } from '../assets/img/calender-details.svg'
import { ReactComponent as CloseDetailsModal } from '../assets/img/close-task-form.svg'
import { ReactComponent as MembersIcon } from '../assets/img/members-icon.svg'
import { ReactComponent as LabelsIcon } from '../assets/img/labels-icon.svg'
import { ReactComponent as ChecklistIcon } from '../assets/img/checklist-icon.svg'
import { ReactComponent as DatesIcon } from '../assets/img/dates-icon.svg'
import { ReactComponent as AttachmentIcon } from '../assets/img/attachment-icon.svg'
import { ReactComponent as CoverIcon } from '../assets/img/cover-icon.svg'
import { ReactComponent as ArchiveIcon } from '../assets/img/archive-icon.svg'
import { ReactComponent as DescriptionIcon } from '../assets/img/description-icon.svg'
import { ReactComponent as ActivityIcon } from '../assets/img/activity-icon.svg'
import { ReactComponent as AttachmentBigIcon } from '../assets/img/attachmaent-iconbig.svg'
import { removeTask, saveTask } from '../store/board.actions'
import { boardService } from '../services/board.service'
import { TaskChecklist } from './task-checklist'


export function TaskDetails() {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const board = useSelector(state => state.boardModule.board)

  const groupId = params.groupId
  const taskId = params.taskId
  const group = board.groups.find(group => group.id === groupId)
  const initTask = group.tasks.find(task => task.id === taskId)
  // ELDAD
  const bgColor = initTask.cover?.color ? initTask.cover.color.length > 9 ? ' #80837f' : initTask.cover.color : ''

  let backgroundStyle = bgColor?.length > 9 ? 'backgroundImage' : 'backgroundColor'

  const [isDescription, setIsDescription] = useState(false)
  const [isChecklist, setIsChecklist] = useState(false)
  const [dynamicType, setDynamicType] = useState('')
 
  
  const [task, setTask] = useState(JSON.parse(JSON.stringify(initTask)))
  
  const [taskLabels, setTaskLabels] = useState(null)
  const [taskMembers, setTaskMembers] = useState(null)
  
  const loadLabels = () => {
    if (!task) return
    const labelIds = task.labelIds
    const taskLabel = labelIds?.map(id => {
      return boardService.getLabelsById(board, id)
    })
    return setTaskLabels(taskLabel)
  }

  const loadMembers = () =>{
    if (!task) return
    const membersIds = task.memberIds
    const taskMembers = membersIds?.map(id => {
      console.log('iddddddddddd:',id)
      
      return boardService.getMembersById(board, id)
    })
    console.log('taskMembers:',taskMembers )
    
    return setTaskMembers(taskMembers)
  }

  
  useEffect(() => {
    setTimeout(()=>{
      loadLabels()
    },500)
    
    onSaveTask()
    loadMembers()
  }, [task])

  const onSaveTask = () => {
    dispatch(saveTask(board._id, group.id, task, 'user updated task'))
    if (isDescription) setIsDescription(false)
  }

  const onRemoveTask = (ev) => {
    ev.preventDefault()
    setIsDescription(false)
    dispatch(removeTask(board._id, group.id, task.id, 'user deleted a task'))
    navigate(-1)
  }
  const onRemoveChecklist = (ev,checklistId) => {
    ev.preventDefault()
    const checklistsToUpdate = task.checklists.filter(checklist => checklist.id !== checklistId) 
    const taskToUpdate = {...task, checklists: checklistsToUpdate}
    setTask(taskToUpdate)
  }
  
  const handleChange = ({ target }) => {
    const field = target.name
    const value = target.type === 'number' ? (+target.value || '') : target.value
    setTask(prevTask => ({ ...prevTask, [field]: value }))
  }

  const getMemberBackground = (member) => {
    
    if (member.img) return  `url(${member.img}) center center / cover` 

    else return `https://res.cloudinary.com/skello-dev-learning/image/upload/v1643564751/dl6faof1ecyjnfnknkla.svg) center center / cover;` 
  }


  if (!task) return <h1>Loading</h1>
  return (
    <section className='task-details-view'>
      <div className='task-details-modal'>
        {bgColor && <div style={{ backgroundColor: bgColor }} className='details-bgColor'>
          {initTask.cover?.color.length > 9 && <img src={initTask.cover?.color} />}
          <button className='side-bar-action-btn-inCover' onClick={() => setDynamicType('cover')}>
            <CoverIcon /> Cover
          </button>
        </div>}
        <Link key={board._id} to={`/workspace/board/${board._id}`}>
          <CloseDetailsModal
            className='close-details-modal-icon'
            onClick={onSaveTask} />
        </Link>

        <section className='details-header'>
          <CalenderIcon className='calender-icon' />
          {/* <textarea onChange={(ev) => setDescription(ev.target.value)} */}
          <textarea onChange={handleChange}
            name='title'
            id='details-title'
            value={task.title}
          >
            {task.title}
          </textarea>
        </section>

        <section className='details-content'>
          <section className='details-main-content'>
            <section className='first-content'>
              <div className='actions-type'>
                <h4>Members</h4>
                <div className='action-type-content'>
                  {taskMembers&& taskMembers.map(member=>{
                    return <div key={member._id} className='task-details-member-box' style={{ background:getMemberBackground(member)}}></div>
                  })}
                </div>
              </div>

              <div className='actions-type'>
                <h4>Labels</h4>
                <div className='action-type-content'>
                  {taskLabels && taskLabels.map(label => {                    
                    return <div key={label.id} className='task-details-label-box' style={{ backgroundColor: label.color? label.color:'green' }}>{label.title?label.title:''}</div>
                  })}
                </div>
              </div>
            </section>

            <div className='description-container'>
              <div className='container-title'>
                <DescriptionIcon className='title-icon' />
                <h5>Description</h5>
              </div>
              <textarea
                onChange={handleChange}
                onClick={() => setIsDescription(true)}
                name='description'
                id='description-textarea-basic'
                value={task.description ? task.description : ''}
              ></textarea>
              {isDescription &&
                <div className='description-edit'>
                  <button className='save-description' onMouseDown={onSaveTask}>Save</button>
                  <button className='close-description' onClick={() => setIsDescription(false)}>Cancel</button>
                </div>}
            </div>

            <div className='description-container'>
              <div className='container-title'>
                <AttachmentBigIcon className='title-icon' />
                <h5>Attachment</h5>
              </div>

              {initTask.attachments?.map(attachment => {
                return <div className='attachment-container'>
                  <div className='img-attachment' >
                    <a src={attachment.url}/>
                    <img src={attachment.url}/>
            
                  </div>
                  <div className='attachment-detalis'>
                    <a src={attachment.url}> {attachment.title}</a>
                  </div>
                </div>
              })}
            </div>

            <div className='activity-container'>
              <div className='container-title'>
                <ActivityIcon className='title-icon' />
                <h5>Activity</h5>
              </div>
              <textarea
                name=''
                id='activity-textarea'
                placeholder='Comment..'
              ></textarea>
            </div>

            {task.checklists && 
              task.checklists.map((checklist) => {
                return <TaskChecklist
                key={checklist.id}
                task={task}
                initChecklist={checklist}
                setTask={setTask}
                checklistId={checklist.id}
                board={board}
                onRemoveChecklist={onRemoveChecklist}
                 
                />}
              )}
          </section>

          {/*details side-bar: */}
          <section className='details-side-actions'>
            <div className='details-actions'>
              <h5>Add to task</h5>
              <div className='details-actions'>
                <button className='side-bar-action-btn' onClick={() => setDynamicType('members')} >
                  <MembersIcon /> Members
                </button>
                <button className='side-bar-action-btn' onClick={() => setDynamicType('labels')}>
                  <LabelsIcon /> Labels
                </button>
                <button className='side-bar-action-btn' onClick={() => setDynamicType('checklist')}>
                  <ChecklistIcon /> Checklist
                </button>
              </div>
              <div className='details-actions'>
                <button className='side-bar-action-btn' onClick={() => setDynamicType('dates')}>
                  <DatesIcon /> Dates
                </button>
                <button className='side-bar-action-btn' onClick={() => setDynamicType('attachment')}>
                  <AttachmentIcon /> Attachment
                </button>
                <button className='side-bar-action-btn' onClick={() => setDynamicType('cover')}>
                  <CoverIcon /> Cover
                </button>
              </div>
            </div>

            <div className='details-actions'>
              <h5>Actions</h5>
              <button onClick={onRemoveTask}>
                <ArchiveIcon /> Archive
              </button>
            </div>
            {dynamicType &&
              <DynamicCmp
                task={task}
                setTask={setTask} 
                type={dynamicType} 
                setDynamicType={setDynamicType} 
                group={group}
                setIsChecklist={setIsChecklist}
                 />
                
            }
          </section>
        </section>
      </div>
    </section>
  )
}