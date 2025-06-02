
import { Card } from "@/components/ui/card";
import { Users, MessageSquare, Clock, TrendingUp } from "lucide-react";

interface LiveStatsProps {
  totalComments: number;
  isConnected: boolean;
  duration: string;
  commentsPerMinute: number;
}

export const LiveStats = ({ totalComments, isConnected, duration, commentsPerMinute }: LiveStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-xs text-green-300 uppercase tracking-wide">Status</p>
            <p className="text-sm font-semibold text-white">
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-blue-300 uppercase tracking-wide">Total Comments</p>
            <p className="text-lg font-bold text-white">{totalComments.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wide">Duration</p>
            <p className="text-sm font-semibold text-white">{duration}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-orange-900/30 to-orange-800/30 border-orange-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-orange-300 uppercase tracking-wide">Per Minute</p>
            <p className="text-lg font-bold text-white">{commentsPerMinute}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
