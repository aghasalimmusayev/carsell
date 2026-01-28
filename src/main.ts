import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes( // Validation
    new ValidationPipe({
      whitelist: true
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Llinkedin class example')
    .setDescription('The Linkedin API description')
    .setVersion('1.0')
    .addTag('Linkedin')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
