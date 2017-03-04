import { EventEmitter } from '@angular/core';
export declare class SAComponent {
    dataArr: Array<any>;
    dataArr2: Array<any>;
    selectedName: string;
    n: number;
    len: number;
    selected: EventEmitter<{}>;
    outclickFn: any;
    fn: any;
    begin(): void;
    click(name: any, e: any): void;
}
