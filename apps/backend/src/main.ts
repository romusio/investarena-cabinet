import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });

  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("Strike Arena Client Cabinet API")
    .setDescription("API геймифицированного личного кабинета клиента Strike Arena")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3001);

  console.log("Backend running on http://localhost:3001");
  console.log("Swagger docs: http://localhost:3001/api/docs");
}

bootstrap();