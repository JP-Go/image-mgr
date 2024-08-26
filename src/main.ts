import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const documentConfig = new DocumentBuilder()
    .setTitle('Image Manager')
    .setDescription('An API for users to upload images')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description:
        'Enter your access token. Obtain it by using the login route',
      name: 'Authorization',
    })
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(3000);
}
bootstrap();
