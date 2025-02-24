const express = require("express");
const authMiddleware = require("../middleware/auth");
const Blog = require("../models/Blog");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Введите заголовок и содержание" });
        }

        const post = new Blog({
            title,
            content,
            author: req.user.username, 
            createdAt: new Date(),
        });

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера при создании поста" });
    }
});

router.get("/", async (req, res) => {
    try {
        const posts = await Blog.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера при получении постов" });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Blog.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Пост не найден" });
        }

        if (post.author !== req.user.username) {
            return res.status(403).json({ message: "Вы не можете редактировать этот пост" });
        }

        post.title = title;
        post.content = content;
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера при редактировании поста" });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Пост не найден" });
        }

        if (post.author !== req.user.username) {
            return res.status(403).json({ message: "Вы не можете удалить этот пост" });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Пост удалён" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера при удалении поста" });
    }
});

module.exports = router;
