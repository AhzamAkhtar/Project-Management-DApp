import styles from '../../styles/Todo.module.css'
import TodoItem from './TodoItem'

const TodoList = ({ todos, assigne ,  tag , action }) => {
    return (
        <ul className={styles.todoList}>
            {todos.map((todo) => (
                <TodoItem key={todo.account.idx} {...todo.account} publicKey={todo.publicKey} action={action} tag={tag} assigne = {assigne} />
            ))}
        </ul>
    )
}

export default TodoList
