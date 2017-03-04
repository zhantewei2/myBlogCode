import {Directive,HostListener,ElementRef,Input} from '@angular/core';
@Directive({
    selector:'[pointer]'
})
export class PointerDirective{
    @Input('model')model;
    @Input('pointer')endColor;
    @HostListener('mouseenter') mouseEnter(){
        this.el.nativeElement.style.cursor='pointer';
        this.el.nativeElement.style.backgroundColor='skyblue';
        this.append(this.model);
    }
    @HostListener('mouseleave') mouseLeave(){
        this.el.nativeElement.style.backgroundColor=this.endColor;
        this.remove(this.model);
    }
    constructor(
        private el:ElementRef
    ){
        this.el.nativeElement.style.transition='background 1s, transform 1s';
        this.endColor=this.endColor||'transparent';
    }
    append(model){
            if(!model)return;
            if(model==1){
                return this.el.nativeElement.style.transform='translateY(-0.8rem)';
            }else{
                return;
            }
    }
    remove(model){
        if(!model)return;
        if(model==1){
            this.el.nativeElement.style.backgroundColor='white';
            this.el.nativeElement.style.transform='translateY(0rem)';
        }else{
            return;
        }
    }

}