import { EventEmitter } from '@angular/core';
export declare class BreakBarComponent {
    fn: any;
    selected: EventEmitter<{}>;
    selectedNum: number;
    maxSize: number;
    barArr: Array<number>;
    ngOnInit(): void;
    selectedFn(v: any): void;
    pre(): void;
    next(): void;
    goPage(v: any): void;
}
