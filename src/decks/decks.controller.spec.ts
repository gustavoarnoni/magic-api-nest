import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { JwtService } from '@nestjs/jwt';

describe('DecksController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);

    token = jwtService.sign({ username: 'admin', sub: 1, role: 'admin' });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/decks (GET)', () => {
    return request(app.getHttpServer())
      .get('/decks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
      });
  });
});
