import { ConfigService } from './src/services/config.service';
import { App } from './src/http_server/app';

function bootstrap(): void {
	const app = new App(new ConfigService());
	app.init();
}

bootstrap();
