import {Component,Input,Output,EventEmitter }from '@angular/core';

@Component({
    selector: 'my-breakBar',
    template: `
        <div >
            <button [disabled]="selectedNum<=1" class="btn dotBtn" (click)="pre()">&lt; </button>
            <button class="btn dotBtn noneBtn" [class.active2]="v==selectedNum"  *ngFor="let v of barArr" (click)="selectedFn(v)">{{v}} </button>
            <button [disabled]="selectedNum>=maxSize" class="btn dotBtn" (click)="next()">&gt; </button>
        </div>
    `,
    styles:[
        '.dotBtn{border-radius:0.5rem;background:white;border:1px solid gainsboro}',
        '.active2{font-weight:bold;color:white;background:gray}'
    ]
})
export class BreakBarComponent{
    @Input('barArr') set fn(barArr){
        if(!barArr)return;
        this.maxSize=barArr.length;
        this.barArr=barArr;
    };
    @Output('selected') selected=new EventEmitter();
    selectedNum:number=1;
    maxSize:number;
    barArr:Array<number>;
    ngOnInit(){
    }
    selectedFn(v){
        this.goPage(v);
    }
    pre(){
        this.goPage(this.selectedNum-1);
    }
    next(){
        this.goPage(this.selectedNum+1);
    };
    goPage(v){
        if(v>=1&&v<=this.maxSize) {
            this.selectedNum=v;
            this.selected.emit(v);
        }
    }
}