import React, { useState } from "react";
import PropTypes from "prop-types";

function TodoItem({ todo, onUpdate, onDelete }) {
  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);

  // Handle save/update operation
  const handleUpdate = () => {
    if (title.trim() === "" || description.trim() === "") {
      alert("Title and description cannot be empty.");
      return;
    }
    onUpdate(todo.id, { title, description }); // Pass updated data to the parent component
    setIsEditing(false); // Exit editing mode
  };

  return (
    <li className="todo-item border p-4 rounded shadow mb-4">
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
            placeholder="Enter title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
            placeholder="Enter description"
          ></textarea>
          <div className="actions">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <h3 className="text-lg font-bold mb-2">{todo.title}</h3>
          <p className="text-gray-700 mb-4">{todo.description}</p>
          <div className="actions">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

// Prop validation to ensure correct usage
TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TodoItem;
