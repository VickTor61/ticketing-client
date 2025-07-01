import { useState } from "react";
import {
  COMMENTS_QUERY,
  Comment as CommentType,
  CurrentUser,
  Ticket as TicketType,
} from "../../graphql/query";
import { Comment } from "./comment";
import { useMutation, useQuery } from "@apollo/client";
import { Loader } from "lucide-react";
import { CREATE_COMMENT_MUTATION } from "../../graphql/mutation";

interface TicketProps {
  ticket: TicketType;
  currentUser: CurrentUser;
  onBack: () => void;

  onTicketUpdate: (
    e: React.ChangeEvent<HTMLSelectElement>,
    type: "priority" | "status",
    id: string
  ) => void;
  formatDate: (dateString: string) => string;
  getPriorityColor: (priority: TicketType["priority"]) => string;
  getStatusColor: (status: TicketType["status"]) => string;
}

export const Ticket = ({
  ticket,
  currentUser,
  onBack,
  onTicketUpdate,
  formatDate,
  getPriorityColor,
  getStatusColor,
}: TicketProps) => {
  const [newComment, setNewComment] = useState<string>("");
  const [comments, setComments] = useState<CommentType[]>([]);

  const { loading } = useQuery(COMMENTS_QUERY, {
    variables: { ticketId: ticket.id },
    onCompleted: (data) => {
      setComments(data.comments);
    },
    onError: (error) => {
      console.error("fetch error", error);
    },
  });

  // Add a new comment

  const [create_comment, { loading: commentLoading }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      onCompleted: (data) => {
        const comment = data.createComment.comment;

        if (comment) {
          setComments((comments) => [...comments, comment]);
          setNewComment("");
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handleAddComment = async (comment: string) => {
    try {
      await create_comment({
        variables: {
          input: {
            ticketId: Number(ticket.id),
            content: comment,
            userId: Number(currentUser.id),
          },
        },
      });
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 text-sm rounded-md border border-gray-300 py-1.5 px-2.5 shadow-sm"
      >
        ← Back to Tickets
      </button>

      <div className="max-w-6xl p-4 mx-auto mt-2 bg-white border border-gray-200 rounded-md shadow">
        <div className="flex justify-between text-sm gap-x-2">
          <h1 className="mb-2 text-xl font-semibold">{ticket.title}</h1>

          {currentUser.role === "agent" ? (
            <div className="flex items-center gap-x-2">
              <select
                value={ticket.priority}
                onChange={(e) => onTicketUpdate(e, "priority", ticket.id)}
                className="border border-gray-300 rounded-md px-2.5 py-1 text-sm font-medium"
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="urgent">urgent</option>
              </select>

              <select
                value={ticket.status}
                onChange={(e) => onTicketUpdate(e, "status", ticket.id)}
                className="border border-gray-300 rounded-md px-2.5 py-1 font-medium text-sm"
              >
                <option value="open">open</option>
                <option value="in_progress">in progress</option>
                <option value="resolved">resolved</option>
                <option value="closed">closed</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              <span
                className={`py-1 text-xs px-1.5 rounded outline-none none bg-black text-white ${getPriorityColor(
                  ticket.priority
                )}`}
              >
                {ticket.priority}
              </span>
              <span
                className={`py-1 text-xs px-1.5 rounded text-white ${
                  getStatusColor(ticket.status) || "bg-gray-500"
                }`}
              >
                {ticket.status.replace("_", " ")}
              </span>
            </div>
          )}
        </div>
        <div className="pb-4 mt-2 text-sm text-left text-black border-b border-gray-200 text-wrap">
          <strong className="block mb-2 text-black">Description</strong>{" "}
          {ticket.description}
        </div>{" "}
        <div className="flex items-start my-4 text-gray-700 gap-x-2 text-wrap">
          <span className="text-sm truncate">
            created: {formatDate(ticket.createdAt)}
          </span>
          {ticket.closedAt && (
            <span className="text-sm truncate">
              closed on: {ticket.closedAt}{" "}
            </span>
          )}
          <span className="text-sm text-nowrap">
            {comments.length} comment
            {comments.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div>
          <h2 className="py-4 font-semibold border-t border-gray-200">
            Conversation
          </h2>
        </div>
        {comments.length === 0 && currentUser.role === "customer" ? (
          <div className="px-3 py-2 text-sm border border-gray-200 rounded-md shadow-sm ">
            No comments yet. A support agent will respond to your ticket soon.
          </div>
        ) : loading ? (
          <Loader />
        ) : (
          comments.map((comment: CommentType) => (
            <Comment key={comment.id} comment={comment} />
          ))
        )}
        {currentUser.role === "agent" || ticket.canComment ? (
          <div className="mt-6 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Add a comment
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type your response here..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => handleAddComment(newComment)}
              disabled={!newComment.trim()}
              className={`inline-flex items-center px-2 py-1.5 text-sm text-white rounded-md transition-colors ${
                newComment.trim()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {commentLoading ? "Adding" : "Add"} Comment
            </button>
          </div>
        ) : (
          <div className="flex flex-col mt-4 gap-y-2">
            <div className="px-3 py-2 text-sm border border-gray-200 rounded-md shadow-sm">
              You can add comments once a support agent responds to your ticket
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
