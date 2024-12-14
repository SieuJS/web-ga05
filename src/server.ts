import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApplicationModule } from './modules/app.module';
import { CommonModule, LogInterceptor } from './modules/common';
import * as hbs from 'express-handlebars';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as session from 'express-session';
import * as passport from 'passport';
import { productRender } from './modules/view/hbs/productRender';
/**
 * These are API defaults that can be changed using environment variables,
 * it is not required to change them (see the `.env.example` file)
 */
const API_DEFAULT_PORT = 3000;
const API_DEFAULT_PREFIX = '/api/v1/';

/**
 * The defaults below are dedicated to Swagger configuration, change them
 * following your needs (change at least the title & description).
 *
 * @todo Change the constants below following your API requirements
 */
const SWAGGER_TITLE = 'Passenger API';
const SWAGGER_DESCRIPTION = 'API used for passenger management';
const SWAGGER_PREFIX = '/docs';

/**
 * Register a Swagger module in the NestJS application.
 * This method mutates the given `app` to register a new module dedicated to
 * Swagger API documentation. Any request performed on `SWAGGER_PREFIX` will
 * receive a documentation page as response.
 *
 * @todo See the `nestjs/swagger` NPM package documentation to customize the
 *       code below with API keys, security requirements, tags and more.
 */
function createSwagger(app: INestApplication) {

    const options = new DocumentBuilder()
        .setTitle(SWAGGER_TITLE)
        .setDescription(SWAGGER_DESCRIPTION)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(SWAGGER_PREFIX, app, document);
}

/**
 * Build & bootstrap the NestJS API.
 * This method is the starting point of the API; it registers the application
 * module and registers essential components such as the logger and request
 * parsing middleware.
 */
async function bootstrap(): Promise<void> {

    const app = await NestFactory.create<NestExpressApplication>(
        ApplicationModule
    );
    app.useStaticAssets(join(__dirname, '..', 'client'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));

    app.engine(
        'hbs',
        hbs.create({
          extname: 'hbs',
          defaultLayout: 'layout_main',
          layoutsDir: join(__dirname, '..', 'views', 'layouts'),
          partialsDir: join(__dirname, '..', 'views', 'partials'),
          helpers : {productRender}
        }).engine,
      );
    app.setViewEngine('hbs');
    // @todo Enable Helmet for better API security headers

    app.setGlobalPrefix(process.env.API_PREFIX || API_DEFAULT_PREFIX , { exclude: ['view/(.*)'] });

    app.use(
        session({
          secret: 'my-secret',
          resave: false,
          cookie : { maxAge : 60*60*1000}, // 1 hour
          saveUninitialized: false,
        }),
      );


    app.use(passport.initialize())
    app.use(passport.session())

    if (!process.env.SWAGGER_ENABLE || process.env.SWAGGER_ENABLE === '1') {
        createSwagger(app);
    }

    const logInterceptor = app.select(CommonModule).get(LogInterceptor);
    app.useGlobalInterceptors(logInterceptor);

    await app.listen(process.env.API_PORT || API_DEFAULT_PORT);
}

/**
 * It is now time to turn the lights on!
 * Any major error that can not be handled by NestJS will be caught in the code
 * below. The default behavior is to display the error on stdout and quit.
 *
 * @todo It is often advised to enhance the code below with an exception-catching
 *       service for better error handling in production environments.
 */
bootstrap().catch(err => {

    // eslint-disable-next-line no-console
    console.error(err);

    const defaultExitCode = 1;
    process.exit(defaultExitCode);
});
