import {Component,ViewChild} from '@angular/core';
import {FormBuilder,Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {SimpleHttp} from '../../service/simpleHttp.service';
import {PageBreakService} from '../../service/page-break.service';
import {FadeIn,SlideRow} from '../../animations/some-animate.fn';
import {MyIndexDBs} from '../../service/my-indexDBs.service';

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
    templateUrl:'messageBoard.html',
    animations:[FadeIn(300),SlideRow()],
    styles:[
        '.card{transition:height 1s}',
        '.replyName{color:blue;font-weight:bold}',
        '.content{width:100%;border:1px solid gainsboro;border-radius:0.3rem;font-size:0.9rem;padding:0.5rem}',
        '.index{position:absolute;left:0px;background:#333;color:white}'
    ]
})
export class MessageBoardComponent{
    notesExist:boolean=false;
    totalSize:number;
    nowPage:number=1;
    barArr:Array<number>;
    title:string;
    url:string='/router/journals.json/one/notes';
    messageArr:Array<any>;
    formGroup:any;
    breakPageTool:any;
    replyName:string;
    count:number;
    @ViewChild('form1')form;
    @ViewChild('modal')modal;
    @ViewChild('verify')verify;
    preventSubmit:boolean;
    FormErrors:any={
        name:'',
        content:''
    };
    FormErrorsMSN:any={
        minlength:'less than length',
        maxlength:'greater than length  ',
        limitError:'More than the max rows',
        required:'required text'
    }
    constructor(
        private route:ActivatedRoute,
        private simpleHttp:SimpleHttp,
        private _pbs:PageBreakService,
        private _fb:FormBuilder,
        private DB:MyIndexDBs
    ){}
    alert(){
        return this.modal.show('leave without edit?',(v)=>{
                return v;
        });
    }
    ngOnInit(){
        let data:any=this.route.snapshot.params,
            id=this.count=+data.id;
        this.title=decodeURIComponent(data.n);
        if(id===0){
            this.notesExist=false;
        }else{
            this.notesExist=true;
            this.initMessage(this.title,id);
        };
        this.formGroup=this._fb.group({
            'name':['',[Validators.required,Validators.minLength(3),Validators.maxLength(10)]],
            'content':['',[Validators.required,Validators.minLength(4),Validators.maxLength(50),LimitRowValidator(6)]]
        });
        this.formGroup.valueChanges.subscribe(v=>{
            for(const field in this.FormErrors){
                this.FormErrors[field]='';
                const control=this.formGroup.get(field);
                if(control&&!control.valid&&control.dirty){
                    for(const err in control.errors){
                        this.FormErrors[field]+=this.FormErrorsMSN[err]+';';
                    }
                }
            };
            if(this.formGroup.valid){
                this.verify.showCanvas=true;
                if(this.verify.verifyStr||this.verify.verifyStr===null)return;
                this.verify.getVerify();
            }
        })
    };
    initMessage(title,id){
        this.breakPageTool=this._pbs.breakPage_loader(
            {
                totalSize:id,
                pageSize:5,
                barSize:5,
                query:title,
                attr:'notes'
            })
        this.gotoNote(1);
    }
    gotoNote(nowPage){
        this.breakPageTool.getData(nowPage,this.url,this.simpleHttp).then(data=>{
            if(!data){
                this.notesExist=false;
                return;
            }
            this.messageArr=data;
            this.barArr=this.breakPageTool.getBarArr(nowPage);
        })
    }
    submit(){
        this.preventSubmit=true;
        let obj=this.formGroup.value,
        obj2={
            q:this.title,
            d:obj,
            v:this.verify.content
        };
        if(!!this.replyName) {
            obj.content = `<i class="fa fa-user mr-2"></i><b class="text-primary">${this.replyName}</b>:<i class="fa fa-reply"></i>;<br>`+obj.content;
        }
        this.simpleHttp.post('/router/journals.json/one/notes/append',obj2).then(v=>{
            if(v=='true') {
                this.formGroup.reset();
                this.initMessage(this.title, ++this.count);
                this.verify.clearVerify();
                this.verify.showCanvas=false;
                this.DB.journalColle.then(model=>{
                    model.update(this.title,{notesCount:this.count});
                })
            }else{
                this.verify.clearVerify();
                this.modal.show('false');
            }
            this.preventSubmit = false;
        })
    };


}