import { EventEmitter } from '@angular/core';
export declare class PopViewComponent {
    hiddenPop: boolean;
    contentPop: string;
    hiddenEvent: EventEmitter<{}>;
    ngAfterContentInit(): void;
    show(): void;
    hidden(): void;
    hiddenAll(): void;
    toggle(): void;
}
