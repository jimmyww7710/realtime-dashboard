import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { NgZone } from '@angular/core';

type ContentInfo = {
  activeMachines: number;
  productionPerMinute: number;
  defectRate: number;
  timestamp: number;
}

export interface DashboardData {
  payload: ContentInfo;
  timestamp: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  dashboardData = signal<DashboardData | undefined>(undefined);

  constructor(private ngZone: NgZone) {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('dashboard:update', (data: DashboardData) => {
      this.dashboardData.set(data);
    });
  }
}
