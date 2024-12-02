import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway()
  export class NotificationsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer()
    server: Server;
  
    afterInit() {
      console.log('WebSocketGateway inicializado!');
    }
  
    handleConnection(client: any) {
      console.log(`Cliente conectado: ${client.id}`);
    }
  
    handleDisconnect(client: any) {
      console.log(`Cliente desconectado: ${client.id}`);
    }
  
    sendNotification(event: string, message: any) {
      this.server.emit(event, message);
      console.log(`Notificação enviada: ${event}`, message);
    }
  }
  