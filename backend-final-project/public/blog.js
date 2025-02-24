document.addEventListener("DOMContentLoaded", () => {
    const blogForm = document.getElementById("blogForm");
    const blogList = document.getElementById("blogList");
    const token = localStorage.getItem("token");
    console.log("📢 Токен, который отправляем:", token);
    const username = localStorage.getItem("username"); 

    if (!token) {
        alert("Вы не вошли в систему!");
        window.location.href = "/login.html";
    }

    blogForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        const res = await fetch("/blog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, content }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("Пост создан!");
            blogForm.reset();
            loadPosts();
        } else {
            alert(data.message || "Ошибка при создании поста");
        }
    });

    async function loadPosts() {
        const res = await fetch("/blog");
        const posts = await res.json();

        blogList.innerHTML = "";
        posts.forEach((post) => {
            const isOwner = post.author === username; 

            const postElement = document.createElement("div");
            postElement.classList.add("blog-post");
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <p><small>Автор: ${post.author} | Дата: ${new Date(post.createdAt).toLocaleString()}</small></p>
                ${
                    isOwner
                        ? `<div class="blog-actions">
                            <button class="edit-btn" onclick="editPost('${post._id}', '${post.title}', '${post.content}')">✏ Редактировать</button>
                            <button class="delete-btn" onclick="deletePost('${post._id}')">🗑 Удалить</button>
                        </div>`
                        : ""
                }
            `;
            blogList.appendChild(postElement);
        });
    }

    window.editPost = async (postId, title, content) => {
        const newTitle = prompt("Измените заголовок", title);
        const newContent = prompt("Измените содержание", content);
        if (!newTitle || !newContent) return;

        const res = await fetch(`/blog/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title: newTitle, content: newContent }),
        });

        if (res.ok) {
            alert("Пост обновлён!");
            loadPosts();
        } else {
            alert("Ошибка при редактировании поста");
        }
    };

    window.deletePost = async (postId) => {
        if (!confirm("Удалить этот пост?")) return;

        const res = await fetch(`/blog/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            alert("Пост удалён!");
            loadPosts();
        } else {
            alert("Ошибка при удалении поста");
        }
    };

    loadPosts();
});
