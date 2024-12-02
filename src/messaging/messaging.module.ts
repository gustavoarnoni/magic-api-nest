import { Module, forwardRef } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { DecksModule } from '../decks/decks.module';

@Module({
  imports: [
    forwardRef(() => DecksModule),
  ],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
