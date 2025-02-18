import React, { useEffect, useState } from "react";
import { collection, addDoc, query, orderBy, onSnapshot} from "firebase/firestore";
import { auth, db } from "../firebase";
import "./CommentSection.scss";

const CommentSection = ({ reviewId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const commentsRef = collection(db, `reviews/${reviewId}/comments`);
    const q = query(commentsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setComments(commentData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [reviewId]);

  const handleAddComment = async () => {
    if (!currentUser) {
      alert("You must be logged in to comment.");
      return;
    }
    if (newComment.trim() === "") return;

    try {
      const commentsRef = collection(db, `reviews/${reviewId}/comments`);

      // If no comments exist, Firestore will automatically create the subcollection
      await addDoc(commentsRef, {
        reviewId,
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName || "Anonymous",
        content: newComment.trim(),
        createdAt: new Date(),
      });

      setNewComment(""); // Clear input field
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Try again.");
    }
  };

  return (
    <div className="comment-section">
      {isLoading ? (
        <p>Loading comments...</p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <strong>{comment.userDisplayName}</strong>
            <span className="comment-date">{comment.createdAt.toLocaleDateString()}</span>
            <p>{comment.content}</p>
          </div>
        ))
      ) : (
        <p>No comments yet. Be the first to add one!</p>
      )}

      {currentUser && (
        <div className="comment-input">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>Post</button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;