
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CommentCard } from "@/components/CommentCard";
import { LiveStats } from "@/components/LiveStats";
import { CSVExport } from "@/components/CSVExport";
import { Play, Square, Settings, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";

const Index = () => {
  const [targetUsername, setTargetUsername] = useState("cnnindonesia");
  const [websocketUrl, setWebsocketUrl] = useState("ws://localhost:8765");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState("00:00:00");
  const { toast } = useToast();
  
  const { 
    comments, 
    isConnected, 
    connect, 
    disconnect, 
    clearComments 
  } = useWebSocket();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - startTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setDuration(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  const startConnection = () => {
    if (!targetUsername.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a TikTok username to connect to.",
        variant: "destructive",
      });
      return;
    }

    if (!websocketUrl.trim()) {
      toast({
        title: "WebSocket URL Required",
        description: "Please enter a valid WebSocket server URL.",
        variant: "destructive",
      });
      return;
    }

    setStartTime(new Date());
    clearComments();
    connect(websocketUrl);
    
    toast({
      title: "Connecting...",
      description: `🔄 Attempting to connect to WebSocket server for @${targetUsername}`,
    });
  };

  const stopConnection = () => {
    disconnect();
    setStartTime(null);
    setDuration("00:00:00");
    
    toast({
      title: "Disconnected",
      description: "📴 Stopped listening for comments.",
    });
  };

  // Show success toast when connected
  useEffect(() => {
    if (isConnected && startTime) {
      toast({
        title: "Connected!",
        description: `✅ Connected to WebSocket server for @${targetUsername}`,
      });
    }
  }, [isConnected, startTime, targetUsername, toast]);

  const commentsPerMinute = startTime 
    ? Math.round((comments.length / ((new Date().getTime() - startTime.getTime()) / 60000)) || 0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              TikTok Live Tracker
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            Monitor and export TikTok live stream comments in real-time
          </p>
        </div>

        {/* Connection Controls */}
        <Card className="p-6 mb-6 bg-slate-800/50 border-slate-700">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  TikTok Username (without @)
                </label>
                <Input
                  value={targetUsername}
                  onChange={(e) => setTargetUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  disabled={isConnected}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  WebSocket Server URL
                </label>
                <Input
                  value={websocketUrl}
                  onChange={(e) => setWebsocketUrl(e.target.value)}
                  placeholder="ws://localhost:8765"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  disabled={isConnected}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge 
                variant={isConnected ? "default" : "secondary"}
                className={isConnected ? "bg-green-600" : "bg-slate-600"}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
              {!isConnected ? (
                <Button
                  onClick={startConnection}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Connect & Start
                </Button>
              ) : (
                <Button
                  onClick={stopConnection}
                  variant="destructive"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <LiveStats 
          totalComments={comments.length}
          isConnected={isConnected}
          duration={duration}
          commentsPerMinute={commentsPerMinute}
        />

        {/* CSV Export */}
        <div className="mb-6">
          <CSVExport comments={comments} targetUsername={targetUsername} />
        </div>

        {/* Comments Feed */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-semibold text-white">Live Comments</h2>
            {isConnected && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">Live</span>
              </div>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">
                  {isConnected 
                    ? "🔁 Listening for comments..." 
                    : "Connect to start monitoring comments"
                  }
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
