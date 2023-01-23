import { ConfigService } from './src/services/config.service';
import { App } from './src/http_server/app';
import { MouseService } from './src/services/mouse.service';
import { DrawService } from './src/services/draw.service';
import { ScreenService } from './src/services/screen.service';

function bootstrap(): void {
	const app = new App(
		new ConfigService(),
		new MouseService(),
		new DrawService(),
		new ScreenService()
	);
	app.init();
}

bootstrap();
