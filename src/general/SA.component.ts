import {Component,Input,Output,EventEmitter} from '@angular/core';
import {EntryAnimation} from '../animations/some-animate.fn';
@Component ({
    selector:'my-asyncAnim',
    template:`
        <div  class='list-group' *ngIf="dataArr2[0]">
            <div [class.selected]="selectedName==tg.name"  (click)="click(tg.name,$event)"  [@entryAnimation] pointer [model]="1" (@entryAnimation.done)="begin()"  *ngFor="let tg of dataArr2"  class=" list-group-item my-pile justify-content-between">
                {{tg.name | limitStr}}
                <span class="badge badge-info badge-pill">{{tg.count}} </span>
             </div>
        </div>
          
    `,
    styles:[
        '.my-pile{ border:1px solid gainsboro;margin-bottom:-20px;height:3rem;font-size:0.9rem;}',
        '.selected{box-shadow: 3px 0px 3px skyblue;font-size:1rem;font-weight:bold}'
    ],
    animations:[
        EntryAnimation(200)
    ]
})
export class SAComponent{
    dataArr:Array<any>;
    dataArr2:Array<any>=[];
    selectedName:string;
    n:number=0;
    len:number=0;
    @Output('clickSelected')selected=new EventEmitter();
    @Input('outClick')set outclickFn(data){
        if(!data)return;
        this.selectedName='';
    }
    @Input('data') set fn(data){
        if(!data) return;
        this.dataArr=data;
        this.len=this.dataArr.length;
        this.begin();
    };
    begin(){
        this.n<this.len?this.dataArr2.push(this.dataArr[this.n]):0;
        this.n++;
    }
    click(name,e){
        let node=e.target;
        node.style.transform='translateX(10px)';
        node.style.background='transparent';
        this.selectedName=name;
        this.selected.emit(name);
    }
}