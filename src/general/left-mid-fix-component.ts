import {Component,Output,EventEmitter,Input} from '@angular/core';
declare var $:any;
import {SlideRow,ShowToggle} from '../animations/some-animate.fn';
@Component ({
    selector:'left-mid-fix',
    template:`
    <div class="main d-flex flex-row-reverse">       
        <button *ngIf="!show" class="btn btn-secondary btn-block " (click)="show=!show">
            <i class="fa fa-th-list"></i>
        </button>
        <div *ngIf="show"  class="align-self-center fa-2x" >
            <i class="tohidden fa fa-chevron-circle-left" (click)="show=!show;send()"> </i>
        </div>
        <div  [@slideRow]="show?'true':'false'" class="content">
            <ng-content></ng-content>
        </div>
    </div>  
    <div *ngIf="outShow" [@showToggle]="show?'true':'false'" class="outShow" (click)="show=!show;send()">
        
    </div>
    `,
    styles:[
        '.content{width:10rem;word-wrap:break-word;background:rgba(255,255,255,0.7);border:1px solid gainsboro;border-bottom-right-radius:1rem;border-top-right-radius:1rem}',
        '.main{z-index:3;position:fixed;left:0px;top:200px;border-bottom-right-radius:1rem;border-top-right-radius:1rem;}',
        '.tohidden{color:gray}',
        '.tohidden:hover{color:gainsboro}',
        '.outShow{position:fixed;left:0px;top:0px;width:100%;height:100%;background:rgba(255,255,255,0.7);z-index:2}',
        '.main::-webkit-scrollbar{width:1px;background:gainsboro}'
    ],
    animations:[
        SlideRow(),
        ShowToggle(),
    ]
})
export class LeftMidFixComponent{
    lgScreen:boolean;
    @Output()hidden =new EventEmitter();
    @Input('toggle') set fn(v){
        (v&&!this.lgScreen)?this.show=!this.show:0;
    }
    show:boolean=false;
    dWidth:number=1430;
    outShow:boolean=false;
    ngOnInit(){
        this.setContent();
        $(window).resize(()=>{
            this.setContent();
        });
        $('.main').scroll((e)=>{
            e.stopPropagation();
        })
    };
    send(){
        this.hidden.emit();
    }
    setContent(){
        let w=$('body').innerWidth();
        if(w>this.dWidth){
            this.show=true;
            this.outShow=false;
            this.lgScreen=true;
        }else{
            this.show=false;
            this.outShow=true;
            this.lgScreen=false;
        }
    }

}