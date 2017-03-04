import {Component,Output,EventEmitter } from '@angular/core';
import {ShowModal} from '../animations/some-animate.fn';
declare var $:any;
@Component({
    selector:'pop-view',
    template:`
        <div  class="popMain bg justify-content-center" [hidden]='hiddenPop' [class.d-flex]="!hiddenPop">                    
            <div  class="col-xl-6 col-md-8 col-10 " style="height:101%">
                <div class="bg2" id="div1" [@showModal]="contentPop" (@showModal.done)="hiddenAll()">
                    <span><i class="fa-bookmark-o fa fa-2x text-success"></i></span>
                    <span class="close text-right mb-2" (click)='hidden()'><i class="text-muted fa fa-window-close-o"></i> </span>
                    <div class="card-block">
                        <ng-content></ng-content>
                    </div>
                 </div>
           </div>
        </div>
    `,
    styles:[
        '.popMain{width:100%;height:100%;position:fixed;top:0px;left:0px;z-index:1;overflow:auto;z-index:20}',
        '.bg{background:rgba(255,255,255,0.5)}',
        '.bg2{background:rgba(255,255,255,0.9);position:absolute;width:100%;border:1px solid gainsboro;border-radius:0.5rem;}'
    ],
    animations:[ShowModal()]

})
export class PopViewComponent{
    hiddenPop:boolean=true;
    contentPop:string='hidden';
    @Output('hidden')hiddenEvent=new EventEmitter();
    ngAfterContentInit(){
        $('#div1').click((e)=>{
            e.stopPropagation();
        });
        $('.popMain').click((e)=>{
            this.hidden();
        })
    }
    show(){
        this.hiddenPop=false;
        this.contentPop='show';
        document.querySelector('body').style.overflow='hidden';
    }
    hidden(){
        this.contentPop='hidden';
    }
    hiddenAll(){
        if(this.contentPop=='show')return;
        this.hiddenPop=true;
        document.querySelector('body').style.overflow='auto';
        this.hiddenEvent.emit(true);
    }
    toggle(){
        this.hiddenPop=!this.hiddenPop;
    }
}