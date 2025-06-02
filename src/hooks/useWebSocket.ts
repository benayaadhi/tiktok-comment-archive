
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
  connect: (url: string) => void;
  disconnect: () => void;
  clearComments: () => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = (url: string) => {
    try {
      wsRef.current = new WebSocket(url);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const newComment: Comment = {
            id: Date.now().toString() + Math.random(),
            username: data.username || 'unknown',
            nickname: data.nickname || 'Anonymous',
            comment: data.comment || '',
            timestamp: new Date()
          };
          
          setComments(prev => [newComment, ...prev].slice(0, 100)); // Keep last 100 comments
          console.log('New comment:', newComment);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
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
    connect,
    disconnect,
    clearComments
  };
};
