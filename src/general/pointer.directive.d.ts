import { ElementRef } from '@angular/core';
export declare class PointerDirective {
    private el;
    model: any;
    endColor: any;
    mouseEnter(): void;
    mouseLeave(): void;
    constructor(el: ElementRef);
    append(model: any): string;
    remove(model: any): void;
}
