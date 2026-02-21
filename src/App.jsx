import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8080/api";

function App() {

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchPosts = () =>
    fetch(`${API}/posts`).then(res => res.json()).then(setPosts);

  const fetchUsers = () =>
    fetch(`${API}/user`).then(res => res.json()).then(setUsers);

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const createUser = async (name, email) => {
    const res = await fetch(`${API}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });
    if (res.ok) {
      const newUser = await res.json();
      setUsers([...users, newUser]);
    }
  };


  const createPost = async (userId, title, content) => {
    const res = await fetch(`${API}/posts/user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    if (res.ok) {
      fetchPosts();          
    }
  };


  const addComment = async (postId, message) => {
    const res = await fetch(
      `${API}/comments/post/${postId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      }
    );

    if (res.ok) {
      const newComment = await res.json();

      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ));
    }
  };

  const deleteComment = async (commentId, postId) => {
    await fetch(
      `${API}/comments/${commentId}`,
      { method: "DELETE" }
    );

    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.filter(c => c.id !== commentId)
          }
        : post
    ));
  };

  return (
    <div>
      <div className="page-header">
        <h1>My React Blog</h1>
        <p>Share your thoughts with the world</p>
      </div>

      {/* ── Create Forms ── */}
      <div className="forms-row">
        <CreateUserForm createUser={createUser} />
        <CreatePostForm users={users} createPost={createPost} />
      </div>

      <hr className="divider" />

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📝</div>
          <p>No posts yet. Create a user and write your first post!</p>
        </div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="card post-card">
            <h2>{post.title}</h2>
            <p className="post-content">{post.content}</p>
            <div className="post-meta">
              <span className="avatar">
                {post.user?.name?.charAt(0).toUpperCase() || "?"}
              </span>
              <span>{post.user?.name || "Unknown"}</span>
            </div>

            <div className="comments-section">
              <h4>Comments ({post.comments?.length || 0})</h4>

              {post.comments?.map(comment => (
                <div key={comment.id} className="comment-item">
                  <span>{comment.message}</span>
                  <button
                    onClick={() => deleteComment(comment.id, post.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              ))}

              <CommentForm postId={post.id} addComment={addComment} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}


function CreateUserForm({ createUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    createUser(name, email);
    setName("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      <h3><span className="icon">👤</span> Create User</h3>
      <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
      <button type="submit" className="btn btn-primary">Create User</button>
    </form>
  );
}


function CreatePostForm({ users, createPost }) {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId || !title || !content) return;
    createPost(userId, title, content);
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      <h3><span className="icon">✍️</span> Create Post</h3>
      <select className="select" value={userId} onChange={e => setUserId(e.target.value)}>
        <option value="">Select Author</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>
      <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post Title" />
      <textarea className="textarea" value={content} onChange={e => setContent(e.target.value)} placeholder="Post Content" rows={3} />
      <button type="submit" className="btn btn-primary">Create Post</button>
    </form>
  );
}

// ── Comment Form ──
function CommentForm({ postId, addComment }) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message) return;
    addComment(postId, message);
    setMessage("");
  };

  return (
    <div className="comment-form">
      <input
        className="input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a comment..."
      />
      <button className="btn btn-comment" onClick={handleSubmit}>Add</button>
    </div>
  );
}

export default App;