import { Server, createServer } from 'http';
import path from 'path';
import fs from 'fs';
import { ConfigInterface } from '../intefaces/config.interface';
// @ts-ignore
import { createWebSocketStream, WebSocketServer } from 'ws';
import { MouseService } from '../services/mouse.service';
import { DrawService } from '../services/draw.service';
import { ScreenService } from '../services/screen.service';

export class App {
	private readonly server: Server<any, any>;
	private readonly port: number;
	private readonly wss: any;
	private readonly dirname = path.resolve(path.dirname(''));
	private file_path: string | undefined;

	constructor(
		private configService: ConfigInterface,
		private mouseService: MouseService,
		private drawService: DrawService,
		private screenService: ScreenService
	) {
		this.port = configService.get<number>('HTTP_PORT');
		this.server = this.createServerM();
		this.wss = this.createWS();
	}

	init(): void {
		this.listenServer();
		this.subscribeWS();
	}

	private createServerM(): Server {
		return createServer((req, res) => {
			this.file_path = this.dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
			fs.readFile(this.file_path, (err, data) => {
				if (err) {
					res.writeHead(404);
					res.end(JSON.stringify(err));
					return;
				}
				res.writeHead(200);
				res.end(data);
			});
		});
	}

	private createWS():any {
		return new WebSocketServer({server: this.server});
	}

	private listenServer() {
		this.server.listen(this.port);
	}

	private subscribeWS() {
		this.wss.on('connection', (ws: any) => {
			console.log(`WS server on the ${this.port} port!`)
			const wsStream = createWebSocketStream(ws, {
				decodeStrings: false,
				encoding: 'utf8',
			});
			wsStream.on('data', async (data: Buffer) => {
				const request = data.toString();
				switch (true) {
					case request.startsWith('mouse'):
						await this.mouseService.handle(request, wsStream);
						break;
					case request.startsWith('draw'):
						await this.drawService.handle(request);
						break;
					case request.startsWith('prnt_scrn'):
						await this.screenService.handle(request, wsStream);
						break;
				}

			});
		});
	}
}
