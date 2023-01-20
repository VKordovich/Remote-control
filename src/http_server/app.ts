import * as http from 'http';
import { Server } from 'http';
import path from 'path';
import fs from 'fs';
import { ConfigInterface } from '../intefaces/config.interface';

export class App {
	private readonly port: number;
	private readonly server: Server<any, any>;

	constructor(private configService: ConfigInterface) {
		this.port = configService.get<number>('HTTP_PORT');
		this.server = http.createServer((req, res) => {
			const __dirname = path.resolve(path.dirname(''));
			const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
			fs.readFile(file_path, function (err, data) {
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

	init(): void {
		this.server.listen(this.port, () => {
			console.log(`Start static http server on the ${this.port} port!`)
		});
	}
}
