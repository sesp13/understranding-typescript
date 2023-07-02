interface TodoListProps {
  items: { id: string; text: string }[];
  onDelete: (todoId: string) => void;
}

export const TodoList = (props: TodoListProps) => {
  return (
    <ul>
      {props.items.map((todo) => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={props.onDelete.bind(null, todo.id)}>DELETE</button>
        </li>
      ))}
    </ul>
  );
};
