import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { connectSqlite3 } from './drivers/expressSessionSqlite3.js';
import { config } from './configs/config';
import * as path from 'path';
const SQLiteStore = connectSqlite3(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
      store: new SQLiteStore({
        dir: path.dirname(config.session.dbPath),
        db: path.basename(config.session.dbPath),
      }),
    }),
  );

  await app.listen(3000);
}
bootstrap();
