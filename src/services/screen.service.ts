import {
    mouse,
    Region,
    screen
} from '@nut-tree/nut-js';
import { Duplex } from 'stream';
import Jimp, { MIME_PNG } from 'jimp';

export class ScreenService {
    readonly screenWidth = 200;
    readonly screenHeight = 200;

    async handle(request: string, ws: Duplex): Promise<void> {
        console.log(request);
        await this.getCapture(ws);
    }

    private async getCapture(ws: Duplex): Promise<void> {
        const {x,y} = await mouse.getPosition();
        const capture = await screen.grabRegion(
            new Region(
                x - this.screenWidth / 2,
                y - this.screenHeight / 2,
                this.screenWidth,
                this.screenHeight
            )
        );
        const jimpImage: Jimp = new Jimp(this.screenWidth, this.screenHeight);
        jimpImage.bitmap.data = capture.data;
        const base64buffer = await jimpImage.getBase64Async(MIME_PNG);
        ws.write(`prnt_scrn ${base64buffer.split(',')[1]}`)
    }
}