import { Controller, Post, Body, Get } from '@nestjs/common';
import { MessagingService } from './messaging.service';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('send')
  async sendMessage(@Body() body: { queue: string; message: any }) {
    await this.messagingService.sendToQueue(body.queue, body.message);
    return { message: 'Mensagem enviada para a fila!' };
  }

  @Get('consume')
  async consumeMessage() {
    await this.messagingService.consume('deck_import_queue', (msg) => {
      console.log('Mensagem consumida:', msg);
    });
    return { message: 'Consumo iniciado para deck_import_queue' };
  }
}
