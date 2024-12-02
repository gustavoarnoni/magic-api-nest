import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { MessagingService } from '../messaging/messaging.service';

@Controller('decks')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DecksController {
  constructor(
    private readonly decksService: DecksService,
    private readonly messagingService: MessagingService,
  ) {}

  @Get()
  @Roles('admin', 'user')
  async findAll() {
    console.log('Rota GET /decks acessada');
    return this.decksService.findAll();
  }

  @Get('commander')
  @Roles('admin', 'user')
  async getCommander(@Query('query') query: string) {
    console.log('Rota GET /decks/commander acessada');
    return this.decksService.fetchCommander(query);
  }

  @Get('cards')
  @Roles('admin', 'user')
  async getDeckCards(@Query('colors') colors: string) {
    console.log('Rota GET /decks/cards acessada');
    return this.decksService.fetchDeckCards(colors);
  }

  @Post('full')
  @Roles('admin')
  async createFullDeck(@Query('commanderQuery') commanderQuery: string) {
    console.log('Rota POST /decks/full acessada');
    if (!commanderQuery) {
      return { message: 'Parameter "commanderQuery" is required' };
    }
    return this.decksService.createFullDeck(commanderQuery);
  }

  @Post()
  @Roles('admin')
  async create(@Body() createDeckDto: CreateDeckDto) {
    console.log('Rota POST /decks acessada');
    return this.decksService.create(createDeckDto);
  }

  @Post('import')
  @Roles('admin', 'user')
  async importDeck(@Body() createDeckDto: CreateDeckDto) {
    console.log('Rota POST /decks/import acessada');
    return this.decksService.importDeck(createDeckDto);
  }

  @Post('test-messaging')
  @Roles('admin', 'user')
  async testMessaging(@Body() message: any) {
    console.log('Rota POST /decks/test-messaging acessada');
    try {
      await this.messagingService.sendToQueue('deck_import_queue', message);
      return { status: 'Message sent to deck_import_queue', message };
    } catch (error) {
      console.error('Erro ao enviar mensagem para fila deck_import_queue:', error);
      return { status: 'Failed to send message', error: error.message };
    }
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id') id: string) {
    console.log(`Rota GET /decks/${id} acessada`);
    return this.decksService.findOne(id);
  }
}
