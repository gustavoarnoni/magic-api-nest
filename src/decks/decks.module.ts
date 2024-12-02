import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DeckSchema } from './deck.schema';
import { DecksController } from './decks.controller';
import { DecksService } from './decks.service';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
    forwardRef(() => MessagingModule),
  ],
  controllers: [DecksController],
  providers: [DecksService],
  exports: [DecksService],
})
export class DecksModule {}
