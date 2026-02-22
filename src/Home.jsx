import { useEffect, useState, useContext } from "react";
import api from "./api/axios";
import { AuthContext } from "./context/AuthContext";

function Home() {
  const [posts, setPosts] = useState([]);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    api.get("/api/posts")
      .then((res) => setPosts(res.data))
      .catch(() => alert("Unauthorized"));
  }, []);

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
    
  );
}

export default Home;