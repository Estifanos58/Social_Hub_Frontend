export const Comment = ({ comment }: { comment: any }) => {
  return (
    <div className="flex space-x-3">
      <img
        src={comment.user.avatar}
        alt="avatar"
        className="w-8 h-8 rounded-full"
      />
      <div>
        <p className="text-sm">
          <span className="font-semibold">{comment.user.name}</span>{" "}
          <span className="text-gray-400">@{comment.user.username}</span>
        </p>
        <p className="mt-1 text-gray-200">{comment.content}</p>

        {/* Replies */}
        {comment.replies && (
          <div className="ml-10 mt-2 space-y-2 border-l border-gray-600 pl-3">
            {comment.replies.map((reply: any) => (
              <div key={reply.id} className="flex space-x-3">
                <img
                  src={reply.user.avatar}
                  alt="avatar"
                  className="w-7 h-7 rounded-full"
                />
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">{reply.user.name}</span>{" "}
                    <span className="text-gray-400">
                      @{reply.user.username}
                    </span>
                  </p>
                  <p className="mt-1 text-gray-200">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
