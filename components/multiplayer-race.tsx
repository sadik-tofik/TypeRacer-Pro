'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Users, Share2, Trophy, Clock, Copy, CheckCircle } from 'lucide-react';
import { wsClient, RaceRoom, RaceParticipant } from '@/lib/websocket-client';

interface MultiplayerRaceProps {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  difficulty: string;
}

export function MultiplayerRace({ isOpen, onClose, currentText, difficulty }: MultiplayerRaceProps) {
  const [mode, setMode] = useState<'menu' | 'create' | 'join' | 'racing'>('menu');
  const [roomId, setRoomId] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState<RaceRoom | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      wsClient.connect();
      
      wsClient.on('room-created', handleRoomCreated);
      wsClient.on('room-joined', handleRoomJoined);
      wsClient.on('race-started', handleRaceStarted);
      wsClient.on('participant-update', handleParticipantUpdate);
      wsClient.on('race-finished', handleRaceFinished);
    }

    return () => {
      wsClient.off('room-created', handleRoomCreated);
      wsClient.off('room-joined', handleRoomJoined);
      wsClient.off('race-started', handleRaceStarted);
      wsClient.off('participant-update', handleParticipantUpdate);
      wsClient.off('race-finished', handleRaceFinished);
    };
  }, [isOpen]);

  const handleRoomCreated = (data: { roomId: string; shareUrl: string }) => {
    setRoomId(data.roomId);
    setShareUrl(data.shareUrl);
    setMode('create');
    toast({
      title: "Room Created! 🎉",
      description: `Room ID: ${data.roomId}`,
    });
  };

  const handleRoomJoined = (data: { room: RaceRoom }) => {
    setRoom(data.room);
    setMode('racing');
    toast({
      title: "Joined Race! 🏁",
      description: `Welcome to room ${data.room.id}`,
    });
  };

  const handleRaceStarted = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleParticipantUpdate = (data: { participantId: string; progress: number; wpm: number; accuracy: number }) => {
    setRoom(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        participants: prev.participants.map(p => 
          p.id === data.participantId 
            ? { ...p, progress: data.progress, wpm: data.wpm, accuracy: data.accuracy }
            : p
        )
      };
    });
  };

  const handleRaceFinished = (data: { winner: RaceParticipant }) => {
    toast({
      title: data.winner.username === 'You' ? "You Won! 🏆" : "Race Finished!",
      description: `${data.winner.username} finished first with ${data.winner.wpm} WPM`,
    });
  };

  const createRoom = () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to create a room",
        variant: "destructive"
      });
      return;
    }
    
    wsClient.send('create-room', {
      username: username.trim(),
      text: currentText,
      difficulty
    });
  };

  const joinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and room ID",
        variant: "destructive"
      });
      return;
    }

    wsClient.send('join-room', {
      roomId: roomId.trim().toUpperCase(),
      username: username.trim(),
      text: currentText
    });
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link Copied! 📋",
        description: "Share this link with your friend",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const renderMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Challenge a Friend! 🏁</h3>
        <p className="text-muted-foreground">Race against friends in real-time typing competitions</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Your Username</label>
          <Input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-center"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={createRoom}
            className="h-20 flex-col space-y-2"
            disabled={!username.trim()}
          >
            <Users className="h-6 w-6" />
            <span>Create Room</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setMode('join')}
            className="h-20 flex-col space-y-2"
            disabled={!username.trim()}
          >
            <Share2 className="h-6 w-6" />
            <span>Join Room</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderCreate = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Room Created! 🎉</h3>
        <p className="text-muted-foreground">Share this link with your friend to start racing</p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Room ID</label>
              <div className="flex items-center space-x-2">
                <Input value={roomId} readOnly className="text-center font-mono text-lg" />
                <Button size="sm" onClick={copyShareUrl}>
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Share URL</label>
              <div className="flex items-center space-x-2">
                <Input value={shareUrl} readOnly className="text-xs" />
                <Button size="sm" onClick={copyShareUrl}>
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">Waiting for your friend to join...</p>
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Users className="h-8 w-8 text-blue-500" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const renderJoin = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Join a Race! 🏁</h3>
        <p className="text-muted-foreground">Enter the room ID to join your friend's race</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Room ID</label>
          <Input
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            className="text-center font-mono text-lg"
          />
        </div>

        <Button onClick={joinRoom} className="w-full" disabled={!roomId.trim()}>
          Join Race
        </Button>

        <Button variant="outline" onClick={() => setMode('menu')} className="w-full">
          Back to Menu
        </Button>
      </div>
    </motion.div>
  );

  const renderRacing = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Race in Progress! 🏁</h3>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Room: {room?.id}
        </Badge>
      </div>

      <AnimatePresence>
        {countdown > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="text-center"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-6xl font-bold text-blue-500"
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {room?.participants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={participant.username === 'You' ? 'border-blue-500' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {participant.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{participant.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {participant.wpm} WPM • {participant.accuracy}% accuracy
                      </div>
                    </div>
                  </div>
                  {participant.finished && (
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <Progress value={participant.progress} className="h-3" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Multiplayer Race</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'menu' && renderMenu()}
            {mode === 'create' && renderCreate()}
            {mode === 'join' && renderJoin()}
            {mode === 'racing' && renderRacing()}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}