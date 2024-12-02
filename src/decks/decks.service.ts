import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { Deck } from './deck.schema';
import { CreateDeckDto } from './dto/create-deck.dto';
import { MessagingService } from '../messaging/messaging.service';

@Injectable()
export class DecksService {
  private readonly scryfallBaseUrl = 'https://api.scryfall.com';

  constructor(
    @InjectModel(Deck.name) private readonly deckModel: Model<Deck>,
    private readonly messagingService: MessagingService,
  ) {}

  async create(createDeckDto: CreateDeckDto): Promise<Deck> {
    const createdDeck = new this.deckModel(createDeckDto);
    return createdDeck.save();
  }

  async findAll(): Promise<Deck[]> {
    return this.deckModel.find().exec();
  }

  async findOne(id: string): Promise<Deck> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }

    const deck = await this.deckModel.findById(id).exec();
    if (!deck) {
      throw new NotFoundException(`Deck with ID ${id} not found`);
    }
    return deck;
  }

  async fetchCommander(query: string): Promise<any> {
    const url = `${this.scryfallBaseUrl}/cards/search?q=${query}`;
    const response = await axios.get(url);
    const cards = response.data.data;

    const legendaryCreatures = cards.filter((card: any) =>
      card.type_line.includes('Legendary Creature'),
    );

    if (legendaryCreatures.length === 0) {
      throw new Error('No legendary creatures found for the query.');
    }

    return legendaryCreatures[0];
  }

  async fetchDeckCards(colors: string): Promise<any[]> {
    const url = `${this.scryfallBaseUrl}/cards/search?q=c:${colors}`;
    const response = await axios.get(url);
    const cards = response.data.data;

    return cards.slice(0, 99);
  }

  async createFullDeck(commanderQuery: string): Promise<Deck> {
    const commander = await this.fetchCommander(commanderQuery);

    const colors = commander.color_identity.join('');

    const cards = await this.fetchDeckCards(colors);

    const fullDeck = {
      commander: commander.name,
      cards: cards.map((card) => card.name),
      userId: 'dummy-user',
    };

    const createdDeck = new this.deckModel(fullDeck);
    return createdDeck.save();
  }

  async importDeck(createDeckDto: CreateDeckDto) {
    const createdDeck = await this.create(createDeckDto);

    await this.messagingService.sendToQueue('deck_import_queue', {
      deckId: createdDeck._id,
      commander: createdDeck.commander,
      userId: createDeckDto.userId,
      priority: createDeckDto.userRole === 'admin' ? 10 : 1, // Adicionando prioridade
    });

    return {
      message: 'Importação iniciada. Verifique o status na fila.',
      deckId: createdDeck._id,
    };
  }

  async processDeckImport(deckImportData: any) {
    console.log('Processando importação do baralho:', deckImportData);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('Importação concluída para o baralho:', deckImportData.deckId);

    await this.messagingService.sendToQueue('deck_updates_queue', {
      deckId: deckImportData.deckId,
      status: 'Importação concluída',
    });
  }
}
