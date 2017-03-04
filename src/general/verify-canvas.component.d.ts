import { SimpleHttp } from '../service/simpleHttp.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
export declare class VerifyCanvasComponent {
    private simpleHttp;
    showCanvas: boolean;
    w: number;
    h: number;
    throttle: any;
    canvasHadLoad: boolean;
    subject: Subject<any>;
    verifyStr: any;
    content: string;
    constructor(simpleHttp: SimpleHttp);
    clearVerify(): void;
    getVerify(): void;
    draw(str: any, ctx: any, grd: any): void;
    rdmColor(): string;
    addImpurity(ctx: any): void;
    addDot(ctx: any): void;
    addDot2(ctx: any): void;
    decrypt(str: any, key: any): string;
}
