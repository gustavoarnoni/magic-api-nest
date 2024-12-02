import { Test, TestingModule } from '@nestjs/testing';
import { DecksService } from './decks.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateDeckDto } from './dto/create-deck.dto';

const MockDeckModel = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue([{ commander: 'Gisa', cards: [] }]),
  })),
};

describe('DecksService', () => {
  let service: DecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecksService,
        { provide: getModelToken('Deck'), useValue: MockDeckModel },
      ],
    }).compile();

    service = module.get<DecksService>(DecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new deck', async () => {
    const newDeck: CreateDeckDto = {
      commander: 'Gisa',
      cards: ['Swamp', 'Demonic Tutor'],
      userId: 'user123',
    };

    MockDeckModel.create.mockReturnValue({
      ...newDeck,
      save: jest.fn().mockResolvedValue(newDeck),
    });

    const result = await service.create(newDeck);

    expect(MockDeckModel.create).toHaveBeenCalledWith(newDeck);
    expect(result).toEqual(newDeck);
  });

  it('should find all decks', async () => {
    const result = await service.findAll();

    expect(result).toEqual([{ commander: 'Gisa', cards: [] }]);
    expect(MockDeckModel.find).toHaveBeenCalled();
  });
});
