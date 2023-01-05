import styles from '../../styles/Todo.module.css'
import TodoList from './TodoList'

const TodoSection = ({ title,  tag , assigne,  todos, action }) => {
    return (
        <div className={styles.todoSection}>
            <h1 className="title">
                {/* {title} - {todos.length} */}
                {title} 
            </h1>

            <TodoList todos={todos} tag={tag} assigne = {assigne} action={action} />
        </div>
    )
}

export default TodoSection
