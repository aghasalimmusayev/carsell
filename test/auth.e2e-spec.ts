import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup-app';

describe('Authentication System', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        setupApp(app)
        await app.init();
    });

    it('handles a signup request', () => {
        const email = 'abs@test.com'
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: '123456' })
            .expect(201)
            .then((response) => {
                const { id, email } = response.body
                expect(id).toBeDefined()
                expect(email).toEqual(email)
            })
    });

    it('signup as a new user then get the currently logged in user', async () => {
        const email = 'test@test.com'
        const password = '123456'
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password })
            .expect(201)

        const cookie = res.get('Set-Cookie')
        const { body } = await request(app.getHttpServer())
            .get('/auth/me')
            .set('Cookie', cookie ?? [])
            .expect(200)
        expect(body.email).toEqual(email)
    })
    afterEach(async () => {
        await app.close();
    });

});
