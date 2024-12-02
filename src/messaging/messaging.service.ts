import { Injectable, OnModuleInit, Inject, forwardRef, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { DecksService } from '../decks/decks.service';

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(
    @Inject(forwardRef(() => DecksService))
    private readonly decksService: DecksService,
  ) {}

  async onModuleInit() {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue('deck_import_queue', {
        durable: true,
        maxPriority: 10, // Configurando suporte a prioridades
      });
      await this.channel.assertQueue('deck_updates_queue', { durable: true });

      console.log('RabbitMQ conectado e filas configuradas com suporte a prioridades!');

      this.consume('deck_import_queue', async (message) => {
        console.log(`Mensagem recebida da fila deck_import_queue:`, message);
        try {
          await this.decksService.processDeckImport(message);
        } catch (error) {
          console.error('Erro ao processar a mensagem:', error.message);
        }
      });
    } catch (error) {
      console.error('Erro ao conectar ao RabbitMQ:', error.message);
    }
  }

  async sendToQueue(queue: string, message: any, priority = 0) {
    try {
      if (!this.channel) {
        throw new Error('Canal AMQP não inicializado');
      }
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
        priority, // Enviar mensagem com prioridade
      });
      console.log(`Mensagem enviada para a fila ${queue} com prioridade ${priority}:`, message);
    } catch (error) {
      console.error(`Erro ao enviar mensagem para a fila ${queue}:`, error.message);
    }
  }

  async consume(queue: string, onMessage: (msg: any) => void) {
    try {
      if (!this.channel) {
        throw new Error('Canal AMQP não inicializado');
      }
      this.channel.consume(
        queue,
        (msg) => {
          if (msg) {
            const content = JSON.parse(msg.content.toString());
            console.log(`Mensagem recebida da fila ${queue}:`, content);
            try {
              onMessage(content);
              this.channel.ack(msg);
            } catch (error) {
              console.error('Erro ao processar mensagem consumida:', error.message);
            }
          }
        },
        { noAck: false },
      );
    } catch (error) {
      console.error(`Erro ao consumir mensagens da fila ${queue}:`, error.message);
    }
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
        console.log('Canal AMQP fechado.');
      }
      if (this.connection) {
        await this.connection.close();
        console.log('Conexão AMQP encerrada.');
      }
    } catch (error) {
      console.error('Erro ao fechar conexão/canal AMQP:', error.message);
    }
  }
}
