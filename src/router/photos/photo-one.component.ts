import {Component,Input,ViewChild,Output,EventEmitter} from '@angular/core';
import {FormBuilder,Validators} from '@angular/forms';
import {ShareService} from './share.service';
import {LoginService} from '../../service/login.service';

export function LimitRowValidator(n){
    return (control)=>{
        let value=control.value;
        if(!value)return null;
        let arr=value.match(/\n/g);
        if(!arr)return null;
        let len=arr.length;
        if(len<n)return null;
        return {'limitError':{value}};
    }
}
@Component({
    selector:'photo-one',
    template:`
        <div #main >
        <form *ngIf="img" [formGroup]="formGroup">
         <div class="main d-flex justify-content-center flex-column">
            
            <h4 class="d-flex justify-content-between"> 
                <span class="form-group row"><i class="fa-file-photo-o fa input-group-addon"> </i> 
                    <button [hidden]="msn.edit" class="col btn btn-secondary">{{img.name}}</button>
                     <input [formControlName]="'name'" class="form-control col-8" [hidden]="!msn.edit" />
                 </span>
                <button class="btn btn-success" [hidden]="!_lg.logined" (click)="msn.edit=!msn.edit"> EDIT</button>
            </h4>
            <div class="align-self-center">
                <img  [src]="_ss.method.imgUrl(img._id)">
            </div>
            <div class="align-self-end">
                <span class="text-muted">
                    <i class="fa-calendar-check-o fa"> </i>
                {{img.date |date}}</span>
             </div>
            <div  class="card-block">
                <div [hidden]="msn.edit" >
                    {{img.introduction}}
                </div>
                <textarea [formControlName]="'introduction'" class="form-control" [hidden]="!msn.edit"></textarea>
            </div>
            <div class="btn-group " [hidden]="!msn.edit">                            
                <button class="btn btn-secondary" (click)="setToCover()">Set To Cover </button>
                <button class="btn btn-secondary" [disabled]="!formGroup.valid||formGroup.pristine" (click)="submit()">Submit Modify</button>

            </div>
         </div>
        </form>
        
        </div>
        `,
    styles:[
        'img{border-radius:0.5rem;max-height:600px;max-width:100%;overflow-x:scroll}',
        'main:{height:100%;width:100%;overflow:hidden}'
    ]
})
export class PhotoOneComponent{
    @ViewChild('main')main;
    @Output('changed')changed= new EventEmitter();
    @Input('album')album;
    @Input('img')set fn(v){
        if(!v)return;
        this.img=v;
        this.main.nativeElement.addEventListener('click',(e)=>{
            e.stopPropagation();
        });
        this.formGroup=this._fb.group({
            name:[this.img.name,[Validators.required,Validators.maxLength(12)]],
            introduction:[this.img.introduction,[LimitRowValidator(5),Validators.maxLength(50)]]
        });
    };
    formGroup:any;
    img:any=undefined;
    constructor(
        public _ss:ShareService,
        public _lg:LoginService,
        private _fb:FormBuilder
    ){};
    ngOnInit(){

    }
    msn={
        edit:false
    };
    submit(){
        let condi=this.formGroup.value.introduction===this.img.introduction;
        if(this.formGroup.value.name===this.img.value&&condi)return;
        if(confirm('submit modify?')){
            let gv=this.formGroup.value;
            let obj:any=condi?{name:gv.name}:{name:gv.name,itd:gv.introduction};
            this._ss.method.updatePhoto(this.img._id,obj).then(v=>{
                if(!v)return;
                this.img.name=gv.name;
                this.img.introduction=gv.introduction;
                this.changed.emit('changed');
            })
        }
    };
    setToCover(){
        if(confirm('set to cover?')){
            this._ss.method.setToCover(this.img._id,this.album).then(v=>{
                if(!v)return;
                let relItem=this._ss.method.findItem(this.album);
                relItem.main=this.img._id;
                this.changed.emit('cover');
            })
        }
    }
}