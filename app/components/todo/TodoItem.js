import styles from '../../styles/Todo.module.css'
import { CalendarIcon, TrashIcon } from '@heroicons/react/outline'

const TodoItem = ({ idx, content, marked, dateline, publicKey, action , tag , assigne}) => {
    const handleMarkTodo = () => {
        // Only allow unchecked todo to be marked
        if (marked) return
       
        action(publicKey,idx)
        
    }

    const handleRemoveTodo = () => {
        // Only allow checked todo to be removed
        if(!marked) return

        action(publicKey,idx)

    }

    return (
        <li key={idx} className={styles.todoItem}>
            <div onClick={handleMarkTodo} className={`${styles.todoCheckbox} ${marked && styles.checked}`} />
            <div>
                <span className="todoText" style={{color:"#00bbf9",fontSize:"20px"}}>{content}</span>
                <h1 style={{color:"#00f5d4",fontSize:"15px",marginTop:"5px"}}>{"TAG - "+tag}</h1>
                <h1 style={{color:"#00f5d4",fontSize:"15px",marginTop:"5px"}}>{"ASSIGNED TO - "+assigne}</h1>
                {dateline && (
                    <div className={styles.todoDateline}>
                        <CalendarIcon className={styles.calendarIcon} />
                        <span>{dateline}</span>
                    </div>
                )}
            </div>
            <div className={styles.iconContainer}>
                <TrashIcon onClick={handleRemoveTodo} className={`${styles.trashIcon} ${!marked && styles.checked}`} />
            </div>
        </li>
    )
}

export default TodoItem
