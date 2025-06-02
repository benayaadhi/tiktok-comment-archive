
import { User, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Comment {
  id: string;
  username: string;
  nickname: string;
  comment: string;
  timestamp: Date;
}

interface CommentCardProps {
  comment: Comment;
}

export const CommentCard = ({ comment }: CommentCardProps) => {
  return (
    <Card className="p-4 mb-3 bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-sm font-semibold text-white truncate">
              {comment.nickname}
            </p>
            <p className="text-xs text-slate-400">@{comment.username}</p>
            <span className="text-xs text-slate-500">
              {comment.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <MessageCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-200 break-words">{comment.comment}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
