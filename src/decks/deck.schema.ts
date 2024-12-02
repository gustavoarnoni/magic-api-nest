import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Deck extends Document {
  @Prop({ required: true })
  commander: string;

  @Prop({ type: [String], required: true })
  cards: string[];

  @Prop({ required: true })
  userId: string;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
