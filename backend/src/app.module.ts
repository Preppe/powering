import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderResolver } from 'nestjs-i18n';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import appleConfig from './config/apple.config';
import authConfig from './config/auth.config';
import { AllConfigType } from './config/config.type';
import databaseConfig from './config/database.config';
import facebookConfig from './config/facebook.config';
import fileConfig from './config/file.config';
import googleConfig from './config/google.config';
import mailConfig from './config/mail.config';
import twitterConfig from './config/twitter.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { ForgotModule } from './forgot/forgot.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from './mailer/mailer.module';
import { SessionModule } from './session/session.module';
import { UsersModule } from './users/users.module';
import { BranchesModule } from './branches/branches.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
        twitterConfig,
        appleConfig,
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options?: DataSourceOptions) => {
        return new DataSource(options!).initialize();
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    BranchesModule,
    VehiclesModule,
    AuthModule,
    AuthGoogleModule,
    ForgotModule,
    SessionModule,
    MailModule,
    MailerModule,
  ],
})
export class AppModule {}
