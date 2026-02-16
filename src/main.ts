import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupApp } from './setup-app';
const cookiesSession = require('cookie-session')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cookiesSession({
  //   keys: ['asdfghj']
  // }))
  // app.useGlobalPipes( // Validation
  //   new ValidationPipe({
  //     whitelist: true
  //   })
  // )

  // setupApp(app)

  const config = new DocumentBuilder()
    .setTitle('Carcell class example')
    .setDescription('The Carcell API description')
    .setVersion('1.0')
    .addTag('Carcell')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
