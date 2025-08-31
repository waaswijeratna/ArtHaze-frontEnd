"use client";
import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

export function usePostLikes(onLikeUpdate: (postId: string, likes: string[]) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000', {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }

    const socket = socketRef.current;

    // Handle like updates
    socket.on('postLikeUpdate', ({ postId, likes }: { postId: string; likes: string[] }) => {
      onLikeUpdate(postId, likes);
    });

    // Handle reconnection
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Cleanup
    return () => {
      socket.off('postLikeUpdate');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [onLikeUpdate]);
}
