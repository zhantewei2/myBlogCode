import { Subject } from 'rxjs/Subject';
export declare class ModalComponent {
    content: string;
    subject: Subject<any>;
    constructor();
    ngOnInit(): void;
    show(value: any, fn: any): Promise<{}>;
    hide(fn: any): void;
    confirm(): void;
    cancel(): void;
}
