import {Component} from '@angular/core';
import {SimpleHttp} from '../service/simpleHttp.service';
import {Subject} from 'rxjs/Subject';
import {EntryAnimation} from '../animations/some-animate.fn';
import 'rxjs/add/operator/debounceTime';

let colorArr=['red','maroon','royalblue','peru','skyblue','blue','gray','purple'];
@Component({
    selector:'verify-canvas',
    template:`
        <div *ngIf="showCanvas" [@entryAnimation] class="d-flex form-group row has-suceess">
            <div class="col-6 input-group">
                <input class="form-control"  [(ngModel)]="content" />
                <span class="input-group-addon" ><i class="fa " [class.fa-check-circle]="content.toLowerCase()==verifyStr"></i></span>
            </div>
            <label class="col-6">
                 <canvas (click)="getVerify()" class="btn btn-secondary" id="canvas" width="100px" height="50px" ></canvas>
                 <i [style.display]="canvasHadLoad?'none':'inline-block'" class="fa fa-spinner fa-spin fa-2x"> </i>
             </label>
        </div>
    `,
    styles:['.success{background:green}'],
    animations:[EntryAnimation()]
})
export class VerifyCanvasComponent{
    showCanvas:boolean=false;
    w:number=100;
    h:number=50;
    throttle:any;
    canvasHadLoad:boolean=true;
    subject:Subject<any>=new Subject();
    verifyStr:any=undefined;
    content:string='';
    constructor(
        private simpleHttp:SimpleHttp
    ){
        this.subject.debounceTime(1000).subscribe(v=>{
            this.simpleHttp.post('/router/journals.json/one/notes/verify').then(v => {
                let value = this.decrypt(v, 'ztwk'),
                    canvas: any = document.getElementById('canvas'),
                    ctx = canvas.getContext('2d'),
                    dots = 5,
                    grd;
                this.verifyStr=value.toLowerCase();
                ctx.clearRect(0,0,this.w,this.h);
                ctx.textBaseline = 'top';
                ctx.font = '1.5rem Verdana';
                this.draw(value, ctx, grd);
                while (dots--) {
                    this.addDot(ctx);
                    this.addDot2(ctx);
                    this.addImpurity(ctx);
                };
                this.canvasHadLoad=true;
            })
        })
    }
    clearVerify(){
        this.content='';
        this.verifyStr=undefined;
        let canvas:any=document.getElementById('canvas'),
            ctx=canvas.getContext('2d');
        ctx.clearRect(0,0,this.w,this.h);
    }
    getVerify(){
        this.verifyStr=null;
        this.canvasHadLoad=false;
        this.subject.next(true);
    }
    draw(str,ctx,grd){
        console.log(str);
        ctx.shadowBlur=10;
        ctx.shadowColor='gray';
        for(let i=0,len=str.length;i<len;i++){
            let rotate=(10-Math.floor(Math.random()*20))/10*Math.PI/15;
            ctx.fillStyle=this.rdmColor();
            ctx.rotate(rotate);
            ctx.fillText(str[i],(this.w/5)*i+this.w/10,Math.round(Math.random()*(this.h/5)));
            ctx.rotate(-rotate);
        }
    }
    rdmColor(){
        return colorArr[Math.floor(Math.random()*colorArr.length)];
    }

    addImpurity(ctx){
        let halfX=this.w/2,
            halfY=this.h/2,
            beginX=Math.random()*this.w/4,
            beginY=Math.random()*this.h,
            endX=halfX+Math.random()*halfX,
            temp=beginY+halfY,
            endY=temp>this.h?Math.random()*halfY:temp;
        ctx.beginPath();
        ctx.moveTo(beginX,beginY);
        ctx.lineTo(endX,endY);
        ctx.stroke();

    }
    addDot(ctx){
        ctx.strokeStyle=this.rdmColor();
        ctx.beginPath();
        ctx.arc(Math.random()*this.w,Math.random()*this.h,Math.ceil(Math.random()*4),0,2*Math.PI);
        ctx.stroke();
    };
    addDot2(ctx){
        ctx.strokeStyle=this.rdmColor();
        ctx.beginPath();
        ctx.arc(Math.random()*this.w,Math.random()*this.h,Math.ceil(Math.random()*3),0,2*Math.PI);
        ctx.stroke();
    }
    decrypt(str,key){
        let ring=(str.charCodeAt(4)-65).toString(2),
            len=4,
            i,
            i2,
            temp,
            str2='';
        while(len--){
            i=key.charCodeAt(3-len);
            i2=str.charCodeAt(len)-48;
            temp=ring[len+1]==='1'?i-i2:i+i2;
            str2+=String.fromCharCode(temp);
        }
        return str2;
    }
}