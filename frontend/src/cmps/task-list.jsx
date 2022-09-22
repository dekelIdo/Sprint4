import { useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { boardService } from "../services/board.service";
import { TaskDetails } from "./task-details";
import { TaskPreview } from "./task-preview";

export function TaskList({ group }) {
    const board = useSelector(state => state.boardModule.board)

    return (
        <div className="list-container">
            {group.tasks.map((task, index) => {
                return (
                    <Link to={`${group.id}/${task.id}`} key={task.id}>
                       
                            <Draggable draggableId={task.id} index={index}>

                                {(provided) => {
                                    return (<div key={task.id+index} index={index}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef} >
                                        <TaskPreview
                                            task={task}
                                            group={group}
                                            
                                        >
                                        </TaskPreview>
                                        
                                    </div>)
                                }}
                            </Draggable>

                        
                    </Link>
                )
            })}
        </div>
    )
}
// {taskLabels && !task.cover?.isFullCover &&