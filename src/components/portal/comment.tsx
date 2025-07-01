import { formatDate } from "../../utils/helpers";
import { Comment as CommentType } from "../../graphql/query";

export const Comment = ({ comment }: { comment: CommentType}) => {
  return (
    <div
      key={comment.id}
      className={`p-4 rounded-lg mt-4 ${
        comment.user.role === "agent"
          ? "bg-blue-50 border-l-4 border-blue-400"
          : "bg-gray-50 border-l-4 border-gray-400"
      }`}
    >
      <div className="flex items-center justify-between gap-x-2 mb-2">
        <div>
          <span className="font-medium text-sm">
            {comment.user.firstName} {comment.user.lastName}
          </span>
          {comment.user.role === "agent" && (
            <span className="text-xs rounded bg-white text-black py-.5 px-1.5">
              Support agent
            </span>
          )}
        </div>
        <span className="text-xs truncate">
          {formatDate(comment.createdAt)}
        </span>
      </div>

      <div className="text-sm">{comment.content}</div>
    </div>
  );
};
