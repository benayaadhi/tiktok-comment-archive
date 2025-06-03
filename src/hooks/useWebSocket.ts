
import { useState, useEffect, useRef } from 'react';

interface Comment {
  id: string;
  username: string;
  nickname: string;
  comment: string;
  timestamp: Date;
}

interface UseWebSocketReturn {
  comments: Comment[];
  isConnected: boolean;
  isConnecting: boolean;
  connect: (url: string) => void;
  disconnect: () => void;
  clearComments: () => void;
  connectToTikTok: (username: string) => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = (url: string) => {
    try {
      wsRef.current = new WebSocket(url);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'comment') {
            const newComment: Comment = {
              id: Date.now().toString() + Math.random(),
              username: data.username || 'unknown',
              nickname: data.nickname || 'Anonymous',
              comment: data.comment || '',
              timestamp: new Date()
            };
            
            setComments(prev => [newComment, ...prev].slice(0, 100)); // Keep last 100 comments
            console.log('New comment:', newComment);
          } else if (data.type === 'status') {
            console.log('Status update:', data.message);
            if (data.connected !== undefined) {
              setIsConnecting(false);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setIsConnecting(false);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      // Send disconnect message to Python server
      wsRef.current.send(JSON.stringify({ action: 'disconnect' }));
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  };

  const connectToTikTok = (username: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setIsConnecting(true);
      wsRef.current.send(JSON.stringify({
        action: 'connect',
        username: username
      }));
      console.log(`Requesting connection to @${username}`);
    } else {
      console.error('WebSocket is not connected');
    }
  };

  const clearComments = () => {
    setComments([]);
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    comments,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    clearComments,
    connectToTikTok
  };
};
