import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { boardService } from "../services/board.service";
import { updateBoard } from "../store/board.actions";
import { TaskDetails } from "./task-details";


//charecters icons
import { ReactComponent as AttachmentIcon } from '../assets/img/attachmaent-iconbig.svg'
import { ReactComponent as ChecklistIcon } from '../assets/img/checklist-icon.svg'
import { ReactComponent as DescriptionIcon } from '../assets/img/description-icon.svg'
import { ReactComponent as EditTaskIcon } from '../assets/img/edit-icon-task.svg'
import { ReactComponent as DueDate } from '../assets/img/due-date-preview-icon.svg'
import { MiniEdit } from "./mini-edit-cmp";
import { utilService } from "../services/util.service";

export function TaskPreview({ task, group }) {

    const [mouseClickLocation, setMouseClickLocation] = useState(null)

    const board = useSelector(state => state.boardModule.board)
    
    const labelsOpen = board.toggleLabels
    const [isMiniEditShown, setIsMiniEditShown] = useState(false)

    const [taskLabels, setTaskLabels] = useState()
    const [taskMembers, setTaskMembers] = useState()
    const [taskAttachments, setTaskAttachments] = useState()
    const [taskChecklists, setTaskChecklists] = useState()
    const dispatch = useDispatch()
    //task-cover
    const [coverTask, setCoverTask] = useState('')
    const [coverTaskUpper, setCoverTaskUpper] = useState('')
    const [bgColor, setBgColor] = useState(task.cover?.color ? `url(${task.cover.color})` : '')
    const [backgroundStyle, setBackgroundStyle] = useState(task.cover?.color?.length > 9 ? 'backgroundImage' : 'backgroundColor')
    const [heightImg, setHeightImg] = useState('')
    const [textColor, setTextColor] = useState('')
    const [taskTitlePos, setTaskTitlePos] = useState('task-title')

    const loadTaskCover = () => {
        setBackgroundStyle(task.cover?.color?.length > 9 ? 'backgroundImage' : 'backgroundColor')
        if (task.cover?.color?.length > 9) {
            setBgColor(task.cover?.color ? `url(${task.cover.color})` : '')
            setHeightImg(task.cover?.isFullCover ? '192px' : '162px')
            setTaskTitlePos(task.cover?.isFullCover ? 'task-title full ' : 'task-title ')
            if (task.cover.isFullCover) {
                setCoverTask(task.cover?.isDark ? `linear-gradient(180deg,#00000080,#000)` : `linear-gradient(180deg,#ffffff80,#fff)`)
                setTextColor(task.cover?.isDark ? '#ffff' : 'black')
                setCoverTaskUpper(task.cover?.isDark ? ' linear-gradient(180deg,#0000,#00000080)' : ' linear-gradient(180deg,#fff0,#ffffff80)')
            } else {
                setTextColor('black')
            }
        } else {
            setBgColor(task.cover?.color ? task.cover.color : '')
            setHeightImg('32px')
            setTaskTitlePos(task.cover?.isFullCover ? 'task-title text-full ' : 'task-title ')
        }
    }

    const loadLabels = () => {
        if (!task) return
        if (!task.labelIds) return

        const labelIds = task.labelIds
        
        // const taskLabel = boardService.getLabelsById(board, labelIds)

        const taskLabel = labelIds?.map(id => {
            return boardService.getLabelsById(board, id)
        })
        return setTaskLabels(taskLabel)
    }

    const loadMembers = () => {
        if (!task) return
        const membersIds = task.memberIds
        const taskMembers = membersIds?.map(id => {
            return boardService.getMembersById(board, id)
        })
        return setTaskMembers(taskMembers)
    }

    useEffect(() => {
        loadTaskCover()
        loadLabels()
        loadMembers()
    }, [board, task])

    const onToggleLabels = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        const newBoard = { ...board, toggleLabels: !board.toggleLabels }
        dispatch(updateBoard(newBoard))
    }

    const getMemberBackground = (member) => {
        if (member.img) return `url(${member.img}) center center / cover`
        else return `https://res.cloudinary.com/skello-dev-learning/image/upload/v1643564751/dl6faof1ecyjnfnknkla.svg) center center / cover;`
    }

    const onClickMiniEdit = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()

        const mouseClickLocation = ev.target.getClientRects()
        console.log('mouseClickLocation:', mouseClickLocation)
        

      
            setMouseClickLocation(mouseClickLocation[0])
        
        setIsMiniEditShown(!isMiniEditShown)
    }

    const labelsClass = labelsOpen ? 'task-preview-label-preview-open' : 'task-preview-label-preview'

    return (
        <section className={task.cover?.isFullCover ? "task-preview covered" : "task-preview "}>
            <EditTaskIcon className="edit-task-preview-icon" onClick={onClickMiniEdit} />
            <div >
                {isMiniEditShown &&
                    <MiniEdit
                        task={task}
                        group={group}
                        board={board}
                        bgColor={bgColor}
                        onToggleLabels={onToggleLabels}
                        mouseLocation={mouseClickLocation}
                        setIsMiniEditShown={setIsMiniEditShown}
                        getMemberBackground={getMemberBackground} />
                }
                {isMiniEditShown &&
                    <div>
                        <div className='black-screen' onClick={onClickMiniEdit}>
                        </div>
                    </div>
                }
            </div>
            {bgColor &&
                <div style={{ [backgroundStyle]: bgColor, height: heightImg }} className="task-cover-background">
                    {task.cover?.isFullCover && <div>
                        <div className="cover-dark-up" style={{ background: coverTaskUpper }}> </div>
                        <div className="cover-dark-task" style={{ background: coverTask }}></div>
                    </div>}
                </div>
            }

            {taskLabels && !task.cover?.isFullCover &&
                <div className="task-preview-labels-list">
                    {taskLabels.map(label => {
                        return <div onClick={onToggleLabels}
                            key={label.color}
                            className={labelsClass}
                            style={{ backgroundColor: label.color }}>
                            {labelsOpen && <div className='labels-task-preview-mini-color' style={{ backgroundColor: utilService.lightenDarkenColor(label.color, -20) }}></div>}
                            {labelsOpen && <span>{label.title}</span>}
                        </div>
                    })}
                </div>
            }

            <div className="task-preview-title">
                <p style={{ color: textColor }} className={taskTitlePos}>{task.title}</p>
            </div>
            {!task.cover?.isFullCover && <div className="task-preview-Characters">
                <div className="task-preview-pins">

                    {task.dueDate &&
                        <div className={task.dueDate.date < Date.now() ? 'task-preview-date-container overdue' : 'task-preview-date-container'} >

                            <div className="task-preview-date-pin">
                                {/* <DueDate/> */}
                            </div>
                            <div className="task-preview-date-due">
                                <span>{task.dueDate.dateToDisplay}</span>
                            </div>
                        </div>
                    }
                    {task.description && <div className="task-preview-pin description-pin-preview "><DescriptionIcon /></div>}
                    {task.attachments && <div className="task-preview-pin "><AttachmentIcon /> <span>{task.attachments.length}</span> </div>}
                    {task.checklists && <div className="task-preview-pin checklists-pin"><ChecklistIcon /> <span>{task.checklists.length}</span></div>}
                    <div className="task-preview-pin activities-pin"></div>
                </div>

                <div className="task-preview-members-container">
                    {taskMembers && taskMembers.map(member => {
                        { return member.img ? <div className='task-preview-member-box' key={member._id} style={{ background: getMemberBackground(member) }}></div> : <div key={member._id} className='avatar-img-guest-member-box-task-preview'></div> }
                    })}
                </div>
            </div>}
        </section>
    )
}