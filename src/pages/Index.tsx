
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

interface Comment {
  id: string;
  username: string;
  nickname: string;
  comment: string;
  timestamp: Date;
}

const sampleComments = [
  "Amazing live stream! 🔥",
  "Hello from Indonesia! 🇮🇩",
  "Great content as always",
  "Can you see my comment?",
  "Love this! Keep it up! ❤️",
  "Watching from Jakarta",
  "This is so cool!",
  "First time here, loving it!",
  "Can't wait for the next stream",
  "You're the best! 🌟"
];

const sampleUsernames = [
  "tiktoker123", "indolover", "jakartaboy", "streamfan", "coolvibes",
  "musiclover88", "trendsetter", "viralqueen", "contentking", "livewatcher"
];

const sampleNicknames = [
  "Stream Lover", "Jakarta Vibes", "Music Fan", "Trend Setter", "Viral Queen",
  "Content King", "Live Watcher", "Indonesia Pride", "Cool Vibes", "Stream Master"
];

const Index = () => {
  const [targetUsername, setTargetUsername] = useState("cnnindonesia");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState("00:00:00");
  const { toast } = useToast();

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

  const generateRandomComment = (): Comment => {
    const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
    const randomUsername = sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)];
    const randomNickname = sampleNicknames[Math.floor(Math.random() * sampleNicknames.length)];
    
    return {
      id: Date.now().toString() + Math.random(),
      username: randomUsername,
      nickname: randomNickname,
      comment: randomComment,
      timestamp: new Date()
    };
  };

  const startSimulation = () => {
    if (!targetUsername.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a TikTok username to connect to.",
        variant: "destructive",
      });
      return;
    }

    setIsConnected(true);
    setIsSimulating(true);
    setStartTime(new Date());
    setComments([]);
    
    toast({
      title: "Connected!",
      description: `✅ Connected to @${targetUsername}`,
    });

    // Simulate comments coming in at random intervals
    const simulateComment = () => {
      if (isSimulating) {
        const newComment = generateRandomComment();
        setComments(prev => [newComment, ...prev].slice(0, 100)); // Keep last 100 comments
        
        // Schedule next comment (1-5 seconds)
        const nextDelay = Math.random() * 4000 + 1000;
        setTimeout(simulateComment, nextDelay);
      }
    };

    // Start the first comment after 2 seconds
    setTimeout(simulateComment, 2000);
  };

  const stopSimulation = () => {
    setIsConnected(false);
    setIsSimulating(false);
    setStartTime(null);
    setDuration("00:00:00");
    
    toast({
      title: "Disconnected",
      description: "📴 Stopped listening for comments.",
    });
  };

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
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
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
            <div className="flex items-center space-x-3">
              <Badge 
                variant={isConnected ? "default" : "secondary"}
                className={isConnected ? "bg-green-600" : "bg-slate-600"}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
              {!isConnected ? (
                <Button
                  onClick={startSimulation}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Connect & Start
                </Button>
              ) : (
                <Button
                  onClick={stopSimulation}
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
