import {Component} from '@angular/core';
import {Router}from '@angular/router';
import {SimpleHttp} from '../service/simpleHttp.service';
import {ClassifyService} from '../service/classify.service';
import {CategorysService} from '../service/categorys.service';
declare var $:any;
@Component({
    selector:'journals-nav',
    template:`
        <left-mid-fix (hidden)="hidden()" [toggle]="showToggle">
            <div style="margin:0.5rem">Categorys:</div>
            <div style="font-size:0.9rem;" class="list-group">
                <div [class.selected]="selectedName==cg.name" class="list-group-item" style="padding:0px" *ngFor="let cg of _cs.showCgArr">
                <a  style="background:transparent;width:100%;height:100%;display:flex;justify-content:space-between;padding:0.6rem;" (click)="getCategory(cg)"  pointer>
                    <span>
                    <i class="fa fa-home" *ngIf="cg.name=='all'"> </i>
                    {{cg.name | limitStr}}
                    </span>
                    <span class="badge badge-default badge-pill">{{cg.count}}</span>
                 </a>
                 </div>
            </div>
            <div id="parent">
                <div style="margin:0.5rem">
                    <a (click)="_cs.getTags()" class="btn btn-block" data-parent="#parent" data-toggle="collapse" href="#tagsCollapse">Tags:</a>
                </div>
                <div id="tagsCollapse" class="collapse ">                 
                     <a class="list-group-item" *ngIf="!_cs.tgArr">
                         <i class="fa fa-spinner fa-pulse"></i>
                     </a>
                    
                     <my-asyncAnim [outClick]="clickCg" (clickSelected)="getTag($event)" [data]="_cs.tgArr"></my-asyncAnim>
                    
                </div>
             </div>
        </left-mid-fix>
    `,
    styles:[
        '.shade{position:absolute;height:100%;rigth:0px;background:red;width:20px;}',
        '-webkit-scrollbar{width:10px;background:red}',
        '.selected{background:skyblue}'
    ]
})
export class JournalsNavComponent{
    tgArr:any;
    selectedName:string;
    clickCg:number=0;
    showToggle:number=0;
    constructor(
        private simpleHttp:SimpleHttp,
        private router:Router,
        public mySelect:ClassifyService,
        public _cs:CategorysService
    ){};
    ngOnInit(){
        let main:any;
        main=document.querySelector('.main');
        $('.collapse').on('shown.bs.collapse',()=>{
            let bodyHeight=document.querySelector('body').offsetHeight;
            let rect=main.getBoundingClientRect();
            let mainHeight=rect.height+rect.top;
            if(mainHeight>bodyHeight){
                main.style.height=bodyHeight-rect.top-50+'px';
                main.style.overflowY='scroll';
                main.style.overflowX='hidden';
            }
        });
        $('.collapse').on('hide.bs.collapse',()=>{
            main.style.height='auto';
            main.style.overflowY='hidden';
        })
    }
    hidden(){
        $('.collapse').collapse('hide');
    };
    getTag(e){
        this.selectedName='';
        setTimeout(()=>{this.showToggle++},150);
        this.send(e,'tag');
    }
    getCategory(cg){
        this.clickCg++;
        if(cg.count<1)return;
        let selected=this.mySelect.selected;
        this.selectedName=cg.name;
        if(selected[0]=='category'&&selected[1]==cg.name)return;
        setTimeout(()=>{this.showToggle++},150);
        this.send(cg.name,'category');
    }
    send(e,classify){
        this.mySelect['selected']=[classify,e];
        this.router.navigate(['/journal']);
    }
}