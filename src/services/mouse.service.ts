import {
    down,
    left,
    mouse,
    right,
    up
} from '@nut-tree/nut-js';
import { Duplex } from 'stream';

export class MouseService {
    async handle(request: string, ws: Duplex): Promise<void> {
        console.log(request);
        switch (true) {
            case request.startsWith('mouse_up'):
                await this.mouseMove(this.getRequestData(request), up);
                break;
            case request.startsWith('mouse_down'):
                await this.mouseMove(this.getRequestData(request), down);
                break;
            case request.startsWith('mouse_left'):
                await this.mouseMove(this.getRequestData(request), left);
                break;
            case request.startsWith('mouse_right'):
                await this.mouseMove(this.getRequestData(request), right);
                break;
            case request.startsWith('mouse_position'):
                await this.mousePosition(ws)
                break;
        }
    }

    private getRequestData(req: string): number[] {
        const [, ...reqData] = req.split(' ');
        return reqData.map(item => Number(item));
    }

    private async mouseMove(requestData: number[], moveFn: (px: number) => Promise<any>) {
        const [coords] = requestData;
        await mouse.move(moveFn(coords));
    }

    private async mousePosition(ws: Duplex) {
        const {x,y} = await mouse.getPosition();
        ws.write(`mouse_position ${x},${y}`)
    }
}