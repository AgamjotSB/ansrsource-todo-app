import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [userEmail, setUserEmail] = useState("");
  const [todoLists, setTodoLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user info
        const userRes = await axios.get(`${API}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserEmail(userRes.data.email);

        // Fetch todo lists
        const listRes = await axios.get(`${API}/todos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodoLists(listRes.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate, token]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const res = await axios.post(
        `${API}/todos`,
        { name: newListName },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setTodoLists((prev) => [...prev, res.data]);
      setNewListName("");
    } catch (err) {
      console.error("Failed to create list:", err);
    }
  };

  const handleDeleteList = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this list?",
    );
    if (!confirmed) {
      return;
    }
    try {
      await axios.delete(`${API}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodoLists((prev) => prev.filter((list) => list._id !== id));
    } catch (err) {
      console.error("Failed to delete list:", err);
    }
  };

  const [newItems, setNewItems] = useState({}); // { listId: newItemText }

  const handleAddItem = async (e, listId) => {
    e.preventDefault();
    const text = newItems[listId];
    if (!text?.trim()) return;

    try {
      const res = await axios.post(
        `${API}/todos/${listId}/items`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setTodoLists((prev) =>
        prev.map((list) => (list._id === listId ? res.data : list)),
      );
      setNewItems((prev) => ({ ...prev, [listId]: "" }));
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleDeleteItem = async (listId, itemId) => {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;

    try {
      const res = await axios.delete(`${API}/todos/${listId}/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodoLists((prev) =>
        prev.map((list) => (list._id === listId ? res.data : list)),
      );
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleEditItem = (listId, item) => {
    setEditingItemId(item._id);
    setEditingText(item.text);
  };

  const handleSaveEdit = async (listId, itemId) => {
    if (!editingText.trim()) return;

    try {
      const res = await axios.patch(
        `${API}/todos/${listId}/items/${itemId}/edit`,
        { text: editingText },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setTodoLists((prev) =>
        prev.map((list) => (list._id === listId ? res.data : list)),
      );
      setEditingItemId(null);
      setEditingText("");
    } catch (err) {
      console.error("Failed to edit item:", err);
    }
  };

  const handleToggleItem = async (listId, itemId) => {
    try {
      const res = await axios.patch(
        `${API}/todos/${listId}/items/${itemId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setTodoLists((prev) =>
        prev.map((list) => (list._id === listId ? res.data : list)),
      );
    } catch (err) {
      console.error("Failed to toggle item:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Welcome back, {userEmail}!</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleCreateList} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name"
          className="px-3 py-2 border rounded w-full max-w-sm"
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Add List
        </button>
      </form>

      {todoLists.length === 0 ? (
        <p>No to-do lists yet. Add one above!</p>
      ) : (
        <ul className="space-y-4">
          {todoLists.map((list) => (
            <li
              key={list._id}
              className="bg-white p-4 rounded shadow-sm border"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{list.name}</h2>
                <button
                  onClick={() => handleDeleteList(list._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>

              {/* Items */}
              <ul className="mb-3 space-y-1">
                {list.items.map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleItem(list._id, item._id)}
                      />
                      {editingItemId === item._id ? (
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onBlur={() => handleSaveEdit(list._id, item._id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleSaveEdit(list._id, item._id);
                          }}
                          className="border rounded px-1 py-0.5 text-sm"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={
                            item.completed ? "line-through text-gray-500" : ""
                          }
                        >
                          {item.text}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 text-sm">
                      <button onClick={() => handleEditItem(list._id, item)}>
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteItem(list._id, item._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Add new item */}
              <form
                onSubmit={(e) => handleAddItem(e, list._id)}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="New item"
                  value={newItems[list._id] || ""}
                  onChange={(e) =>
                    setNewItems((prev) => ({
                      ...prev,
                      [list._id]: e.target.value,
                    }))
                  }
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
                <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">
                  Add
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
