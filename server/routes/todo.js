const express = require("express");
const router = express.Router();
const TodoList = require("../models/TodoList");
const auth = require("../middleware/auth");

// GET all todo lists for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const lists = await TodoList.find({ userId: req.user.id });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch to-do lists" });
  }
});

// POST create a new todo list
router.post("/", auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "List name is required" });

  try {
    const newList = new TodoList({
      name,
      userId: req.user.id,
      items: [], // empty list to start
    });
    await newList.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ error: "Failed to create to-do list" });
  }
});

// DELETE a todo list
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await TodoList.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!deleted) return res.status(404).json({ error: "List not found" });

    res.json({ message: "List deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete to-do list" });
  }
});

// POST add a new item to a list
router.post("/:listId/items", auth, async (req, res) => {
  const { listId } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Item text is required" });

  try {
    const list = await TodoList.findOne({ _id: listId, userId: req.user.id });
    if (!list) return res.status(404).json({ error: "List not found" });

    const newItem = { text };
    list.items.push(newItem);
    await list.save();

    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to add item" });
  }
});

// Toggle completed
router.patch("/:listId/items/:itemId", auth, async (req, res) => {
  try {
    const list = await TodoList.findOne({
      _id: req.params.listId,
      userId: req.user.id,
    });
    if (!list) return res.status(404).json({ error: "List not found" });

    const item = list.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.completed = !item.completed;
    await list.save();

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE a todo item from a list
router.delete("/:listId/items/:itemId", auth, async (req, res) => {
  const { listId, itemId } = req.params;

  try {
    const list = await TodoList.findOne({ _id: listId, userId: req.user.id });
    if (!list) return res.status(404).json({ error: "List not found" });

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.deleteOne();
    await list.save();

    res.json(list);
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// PATCH: Edit item text
router.patch("/:listId/items/:itemId/edit", auth, async (req, res) => {
  const { listId, itemId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const list = await TodoList.findOne({
      _id: listId,
      userId: req.user.id,
    });
    if (!list) return res.status(404).json({ error: "List not found" });

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.text = text;
    await list.save();

    res.json(list);
  } catch (err) {
    console.error("Error editing item:", err);
    res.status(500).json({ error: "Failed to edit item" });
  }
});

module.exports = router;
