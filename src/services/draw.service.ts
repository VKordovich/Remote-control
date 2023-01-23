import {
    down,
    left,
    mouse,
    Point,
    right,
    straightTo,
    up
} from '@nut-tree/nut-js';

export class DrawService {
    async handle(request: string): Promise<void> {
        console.log(request);
        switch (true) {
            case request.startsWith('draw_circle'):
                await this.getCircle(this.getRequestData(request));
                break;
            case request.startsWith('draw_rectangle'):
                await this.getRectangle(this.getRequestData(request));
                break;
            case request.startsWith('draw_square'):
                await this.getSquare(this.getRequestData(request));
                break;
        }
    }

    private getRequestData(req: string): number[] {
        const [, ...reqData] = req.split(' ');
        return reqData.map(item => Number(item));
    }

    private async getCircle(requestData: number[]) {
        const [radius] = requestData;
        const {x, y} = await mouse.getPosition();
        const x0 = x - radius;

        for (let i=0; i < 21; i++) {
            const point = new Point(x0 + radius*Math.cos(i/Math.PI), y + radius*Math.sin(i/Math.PI));
            await mouse.move(straightTo(point))
        }
    }

    private async getRectangle(requestData: number[]) {
        const [width, length] = requestData;
        await mouse.move(right(width));
        await mouse.move(down(length));
        await mouse.move(left(width));
        await mouse.move(up(length));
    }

    private async getSquare(requestData: number[]) {
        const [width] = requestData;
        await mouse.move(right(width));
        await mouse.move(down(width));
        await mouse.move(left(width));
        await mouse.move(up(width));
    }
}