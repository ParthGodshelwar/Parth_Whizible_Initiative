import React, { useState, useEffect } from "react";
import { Box, Typography, Drawer, Divider, IconButton, Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";

import ReplyIcon from "@mui/icons-material/Reply"; // Import ReplyIcon for replies
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon for deletion
import GetInitiativeDiscussion from "../../hooks/Editpage/GetInitiativeDiscussion";
import "./styles.css";
import { toast } from "react-toastify";

const CommentsSection = ({ name, id, initiativeId, commentDrawerOpen, setCommentDrawerOpen }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({}); // Track if reply input should be shown
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const userpic = sessionStorage.getItem("UserProfilePic");
  const [id1, setId1] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [initiativeId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const data = await GetInitiativeDiscussion(initiativeId);
      setId1(data.data.listInitiativeDiscussionParentEntity[0]);
      // Sort comments by discussioDate in descending order
      const sortedComments = data.data.listInitiativeDiscussionParentEntity;

      const formattedComments = sortedComments.map((comment) => {
        const dateObj = new Date(comment.discussioDate);
        return {
          userId: String(comment.discussionID),
          comId: String(comment.discussionID),
          fullName: comment.userName,
          // Format to include time and date
          discussionDate: `${dateObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true
          })} On ${dateObj.toLocaleDateString("en-GB")}`,
          avatarUrl: `https://ui-avatars.com/api/?name=${comment.userName}&background=random`,
          text: comment.comments,
          replies: comment.initiativeDiscussionChildEntity.map((reply) => {
            const replyDateObj = new Date(reply.discussioDate);
            return {
              userId: String(reply.discussionID),
              comId: String(reply.discussionID),
              fullName: reply.userName,
              // Format reply date similarly
              discussionDate: `${replyDateObj.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true
              })} On ${replyDateObj.toLocaleDateString("en-GB")}`,
              avatarUrl: `https://ui-avatars.com/api/?name=${reply.userName}&background=random`,
              text: reply.comments
            };
          }),
          canDelete: comment.canDelete
        };
      });
      setComments(formattedComments);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeCommentDrawer = () => {
    setCommentDrawerOpen(false);
  };

  const handleReplyChange = (comId, value) => {
    setReplyText((prev) => ({ ...prev, [comId]: value }));
  };

  const toggleReplyInput = (comId) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [comId]: !prev[comId] // Toggle visibility for the specific comment
    }));
  };

  const handleReplySubmit = async (comId) => {
    if (!replyText[comId]?.trim()) {
      toast.error("Reply should not be left blank");
      return;
    }

    const newReply = {
      userId: String(Math.random()),
      comId: String(Math.random()),
      fullName: userdata?.employeeName || "User",
      avatarUrl:
        userpic || `https://ui-avatars.com/api/?name=${userdata?.employeeName}&background=random`,
      text: replyText[comId]
    };

    try {
      const accessToken = sessionStorage.getItem("access_token");
      await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostInitiativeDiscussion?UserID=${employeeId}&IdeaID=${initiativeId}&ParentID=${comId}&Comments=${replyText[comId]}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.comId === comId
            ? {
                ...comment,
                replies: [...comment.replies, newReply]
              }
            : comment
        )
      );

      setReplyText((prev) => ({ ...prev, [comId]: "" }));
      setShowReplyInput((prev) => ({ ...prev, [comId]: false }));
      fetchComments();
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handleSubmitComment = async () => {
    if (newComment.trim() === "") {
      toast.error("Comment should not be left blank");
      return;
    }

    const newCommentObj = {
      userId: String(Math.random()),
      comId: String(Math.random()),
      fullName: userdata?.employeeName || "User",
      avatarUrl:
        userpic || `https://ui-avatars.com/api/?name=${userdata?.employeeName}&background=random`,
      text: newComment,
      replies: []
    };

    try {
      const accessToken = sessionStorage.getItem("access_token");
      await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostInitiativeDiscussion?UserID=${employeeId}&IdeaID=${initiativeId}&Comments=${newComment}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      setComments((prevComments) => [...prevComments, newCommentObj]);
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleDeleteComment = async (comId) => {
    try {
      // Replace with actual UserID (from session storage or passed as a prop)
      const accessToken = sessionStorage.getItem("access_token");
      const userId = userdata?.employeeId; // Assuming the UserID is in the userdata

      // Make the DELETE request to delete the comment
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/DeleteInitiativeDiscussion?DisucssionID=${comId}&UserID=${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (response.ok) {
        toast.success("Comment deleted successfully!");
        // Remove the deleted comment from the state
        setComments((prevComments) => prevComments.filter((comment) => comment.comId !== comId));
      } else {
        toast.error("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("An error occurred while deleting the comment.");
    }
  };
  console.log("commentDrawerOpen", name);
  return (
    <div>
      <Drawer anchor="right" open={commentDrawerOpen} onClose={closeCommentDrawer}>
        <Box sx={{ width: 600, padding: 2, position: "relative" }}>
          <IconButton
            onClick={closeCommentDrawer}
            sx={{ position: "absolute", top: 17, right: 12 }}
          >
            <Tooltip title="Close">
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </Tooltip>
          </IconButton>
          <Typography variant="h6" gutterBottom style={{ background: "#E7EDF0", width: "100%" }}>
            Discussion Thread
          </Typography>
          <Divider />
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
          >
            {/* Commented and Added by Gauri to fix issue for '0 Comments' on 12 Feb 2025 */}
            {/* <Typography variant="body1">
              {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
            </Typography> */}
            <Typography variant="body1">
              {comments ? comments.filter(c => c.text).length : 0}{" "}
              {comments && comments.filter(c => c.text).length === 1 ? "Comment" : "Comments"}
            </Typography>
            {/* End of Commented and Added by Gauri to fix issue for '0 Comments' on 12 Feb 2025 */}

            <Typography variant="body1">
              <strong>Initiative Code:</strong> <span className="text-danger">{name}</span>
            </Typography>
          </Box>
          <Divider />
          {isLoading && <Typography>Loading comments...</Typography>}
          {error && <Typography color="error">Error fetching comments: {error.message}</Typography>}

          <Box
            sx={{
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#f9f9f9",
              padding: "10px",
              boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "right",
              zIndex: 1000
            }}
          >
            <img
              src={userpic}
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "10px",
                objectFit: "cover"
              }}
            />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={1}
              placeholder="Write your comment..."
              style={{
                flexGrow: 1,
                padding: "6px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontFamily: "inherit",
                fontSize: "14px",
                backgroundColor: "#fff",
                marginRight: "10px",
                resize: "none",
                height: "40px"
              }}
            />
            <Button
              onClick={handleSubmitComment}
              variant="contained"
              color="primary"
              sx={{ height: "40px" }}
            >
              Post
            </Button>
          </Box>
          {comments.map(
            (comment) =>
              comment.fullName && comment.text ? (
                <Box key={comment.comId} sx={{ mb: 3, mt: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <img
                      src={comment.avatarUrl}
                      alt={comment.fullName}
                      width={40}
                      height={40}
                      style={{ borderRadius: "50%", marginRight: 10 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">
                        {comment.fullName}{" "}
                        <Typography component="span" sx={{ fontSize: "0.75rem", color: "gray" }}>
                          {comment.discussionDate}
                        </Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                        {comment.text}
                      </Typography>
                    </Box>
                  </Box>
                  {comment.canDelete === 1 && (
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <IconButton color="error" onClick={() => handleDeleteComment(comment.comId)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}

                  <Box sx={{ pl: 6 }}>
                    {comment.replies.map((reply) => (
                      <Box key={reply.comId} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <img
                          src={reply.avatarUrl}
                          alt={reply.fullName}
                          width={40}
                          height={40}
                          style={{ borderRadius: "50%", marginRight: 10 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1">
                            {reply.fullName}{" "}
                            <Typography
                              component="span"
                              sx={{ fontSize: "0.75rem", color: "gray" }}
                            >
                              {reply.discussionDate}
                            </Typography>
                          </Typography>
                          <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                            {reply.text}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    {showReplyInput[comment.comId] && (
                      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                        <textarea
                          value={replyText[comment.comId] || ""}
                          onChange={(e) => handleReplyChange(comment.comId, e.target.value)}
                          rows={2}
                          placeholder="Write a reply..."
                          style={{
                            flexGrow: 1,
                            padding: "6px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            fontFamily: "inherit",
                            fontSize: "14px",
                            backgroundColor: "#fff",
                            resize: "none"
                          }}
                        />
                        <Button
                          onClick={() => handleReplySubmit(comment.comId)}
                          variant="contained"
                          color="primary"
                          sx={{ marginLeft: "10px" }}
                        >
                          Reply
                        </Button>
                      </Box>
                    )}
                    <IconButton
                      onClick={() => toggleReplyInput(comment.comId)}
                      color="primary"
                      sx={{ mt: 1 }}
                    >
                      <ReplyIcon />
                    </IconButton>
                  </Box>
                </Box>
              ) : null // Do not render the comment if fullName or text is null
          )}
        </Box>
      </Drawer>
    </div>
  );
};

export default CommentsSection;
