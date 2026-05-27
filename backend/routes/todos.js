const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [todos] = await db.execute(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    res.json(todos);
  } catch (error) {
    console.error('获取待办事项错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: '标题为必填项' });
    }

    const [result] = await db.execute(
      'INSERT INTO todos (user_id, title, description) VALUES (0, ?, ?)',
      [title, description || '']
    );

    const [newTodo] = await db.execute(
      'SELECT * FROM todos WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newTodo[0]);
  } catch (error) {
    console.error('创建待办事项错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todoId = parseInt(req.params.id);

    const [existingTodos] = await db.execute(
      'SELECT id FROM todos WHERE id = ?',
      [todoId]
    );

    if (existingTodos.length === 0) {
      return res.status(404).json({ error: '待办事项不存在' });
    }

    const updateFields = [];
    const values = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      values.push(title);
    }

    if (description !== undefined) {
      updateFields.push('description = ?');
      values.push(description);
    }

    if (completed !== undefined) {
      updateFields.push('completed = ?');
      values.push(completed);
    }

    values.push(todoId);

    const [result] = await db.execute(
      `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '待办事项不存在' });
    }

    const [updatedTodo] = await db.execute(
      'SELECT * FROM todos WHERE id = ?',
      [todoId]
    );

    res.json(updatedTodo[0]);
  } catch (error) {
    console.error('更新待办事项错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const todoId = parseInt(req.params.id);

    const [result] = await db.execute(
      'DELETE FROM todos WHERE id = ?',
      [todoId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '待办事项不存在' });
    }

    res.json({ message: '待办事项删除成功' });
  } catch (error) {
    console.error('删除待办事项错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;