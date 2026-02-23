import { useEffect, useState, useContext } from "react";
import api from "./api/axios";
import { AuthContext } from "./context/AuthContext";

function Home() {
  const [posts, setPosts] = useState([]);
  const [content,setContent]=useState("");
  const [title,setTitle]=useState("");
  const { token,logout } = useContext(AuthContext);

  useEffect(() => {
    api.get("/api/posts")
      .then((res) => setPosts(res.data))
      .catch(() => alert("Unauthorized"));
  }, []);
  const createPost =async (e) =>{
    e.preventDefault();
  
  try{
  const res=await api.post(
    "/api/posts",
    {title,content},
    {
      headers: {
        Authorization :`Bearer ${token}`,
      },
    }
  );
  setPosts([...posts,res.data]);
  setTitle("");
  setContent("");
} catch (err){
  console.error("failes to create post",err);
  alert("Failed to create post,Please log in.");
}};

  return (
    <div className="home-page">
      {/* Navbar */}
      <header className="navbar">
        <h1 className="navbar-brand">📝 Blog</h1>
        <button onClick={logout} className="btn btn-logout">Logout</button>
      </header>

      {/* Create Post Form */}
      <div className="card form-card create-post-section">
        <h3><span className="icon">✍️</span> Create a Post</h3>
        <form onSubmit={createPost} className="create-post-form">
          <input
            className="input"
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="textarea"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
          />
          <button type="submit" className="btn btn-primary">Publish</button>
        </form>
      </div>

      {/* Posts Feed */}
      <section className="posts-feed">
        <h2 className="section-title">Recent Posts</h2>
        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No posts yet. Be the first to publish!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="card post-card">
              <h2>{post.title}</h2>
              {post.user && (
                <div className="post-meta">
                  <div className="avatar">{post.user.name?.charAt(0).toUpperCase()}</div>
                  <span>{post.user.name}</span>
                </div>
              )}
              <p className="post-content">{post.content}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Home;