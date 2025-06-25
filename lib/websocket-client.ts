'use client';

export interface RaceParticipant {
  id: string;
  username: string;
  progress: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
}

export interface RaceRoom {
  id: string;
  text: string;
  difficulty: string;
  participants: RaceParticipant[];
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  countdown?: number;
  createdAt: Date;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: { [event: string]: Function[] } = {};

  connect() {
    if (typeof window === 'undefined') return;

    try {
      // In a real implementation, this would connect to your WebSocket server
      // For demo purposes, we'll simulate WebSocket behavior
      this.simulateWebSocket();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  private simulateWebSocket() {
    // Simulate WebSocket connection for demo
    setTimeout(() => {
      this.emit('connected');
    }, 100);
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  send(event: string, data: any) {
    // Simulate sending data
    console.log('Sending:', event, data);
    
    // Simulate responses for demo
    this.simulateResponse(event, data);
  }

  private simulateResponse(event: string, data: any) {
    switch (event) {
      case 'create-room':
        setTimeout(() => {
          const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
          this.emit('room-created', { roomId, shareUrl: `${window.location.origin}?room=${roomId}` });
        }, 500);
        break;
      
      case 'join-room':
        setTimeout(() => {
          this.emit('room-joined', {
            room: {
              id: data.roomId,
              text: data.text || 'Sample race text for multiplayer competition.',
              difficulty: 'medium',
              participants: [
                { id: '1', username: 'You', progress: 0, wpm: 0, accuracy: 100, finished: false },
                { id: '2', username: 'Opponent', progress: 0, wpm: 0, accuracy: 100, finished: false }
              ],
              status: 'waiting'
            }
          });
        }, 500);
        break;
      
      case 'update-progress':
        // Simulate opponent progress
        setTimeout(() => {
          const opponentProgress = Math.min(data.progress + Math.random() * 10, 100);
          this.emit('participant-update', {
            participantId: '2',
            progress: opponentProgress,
            wpm: Math.floor(40 + Math.random() * 30),
            accuracy: Math.floor(90 + Math.random() * 10)
          });
        }, 100);
        break;
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsClient = new WebSocketClient();