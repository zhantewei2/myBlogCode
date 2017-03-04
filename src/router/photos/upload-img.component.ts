import {Component,ViewChild,Input,Output,EventEmitter} from '@angular/core';
import {Http,RequestOptions,Headers} from '@angular/http';
import {FormBuilder,Validators} from '@angular/forms';
import {EntryAnimation} from '../../animations/some-animate.fn';
import {limitStr,arrAsyncForEach} from '../../module/until/until';
arrAsyncForEach();
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
    selector:'upload-img',
    templateUrl:'./upload-img.html',
    styleUrls:['./upload-img.css'],
    animations:[EntryAnimation()]
})
export class UploadImgComponent{
    file:any;
    @ViewChild('popView')popView;
    @Input('album')album;
    @Output('uploaded')uploaded =new EventEmitter();
    oneFile:any={
        name:'',
        extend:undefined,
        itd:'',
        input:'',
        blob:undefined
    };
    errors:any={
        image:undefined,
        itd:'',
        maxSize:true
    };
    bufferArr:Array<any>=[];
    imgArr:Array<any>=[];
    formGroup:any;
    httpOptions=new RequestOptions({
        headers:new Headers({'Content-Type':'text/event-stream'}),
        withCredentials:true
    });
    constructor(
        private http:Http,
        private _fb:FormBuilder
    ){};


    ngOnInit(){
        let errorsMSN:any={
            maxlength:'greater than length',
            limitError:'More than the max rows',
        };
        this.formGroup=this._fb.group({
            'itd':['',[Validators.maxLength(50),LimitRowValidator(5)]]
        });
        this.formGroup.valueChanges.subscribe(()=>{
            const control= this.formGroup.get('itd');
            this.errors.itd='';
            if(control&&!control.valid&&control.dirty){
                for(const err in control.errors){
                    this.errors.itd+=errorsMSN[err]+';';
                }
            }
        });

    }
    upload(){
        let i=0;
        let sendOneFile=(imgOne,callBack)=>{
            this.http.post(
                '/router/photos/admin/upload?name='+imgOne.name+'&extend='+imgOne.extend+'&itd='+imgOne.itd+'&category='+this.album,
                this.bufferArr[i++],
                this.httpOptions).subscribe(data=>{
                    if(!data){this.uploaded.emit(false);return;}
                    callBack()
            })
        };


        if(!confirm('append picture?'))return;
        (this.imgArr as any).AsyncForEach(
            (v,next)=>{
                this.setLoadBar.set(this.imgArr.length);
                sendOneFile(v,next);
            },
            ()=>{
                this.uploaded.emit(this.bufferArr.length);
                this.imgMethod.allClean();
            }
        )

    }
    change(e){
        if(this.setLoadBar.size)this.setLoadBar.clean();
        this.file=(e as any).target.files[0];
        if(this.file.size/1024>500){
            this.errors.maxSize=false;
            return;
        }
        this.errors.maxSize=true;
        if(!this.file)return;
        let fileName=this.file.name.toLowerCase(),
            matchExtend=fileName.match(/(.jpg|.png|.bmp|.gif|.jpeg)$/);
        //extend:
        if(!matchExtend){
            this.oneFile.extend='false';
            return;
        };
        //size:
        this.oneFile.input=fileName;
        this.oneFile.extend=matchExtend[0].toString();
        this.oneFile.name=fileName.slice(0,fileName.indexOf(this.oneFile.extend));
    }

    cleanTool(){
        this.oneFile.input='';
        (document.querySelector('[type=file]') as any).value='';
    }
    imgMethod:any={
        append:()=>{
            if(this.imgArr.length>5)return;

            for (let img of this.imgArr) {
                if (this.oneFile.name && img.name == this.oneFile.name) {
                    return;
                }
            }
            let reader: any = new FileReader();
            let readerBuffer:any=new FileReader();
            reader.onload = (event: any) => {
                this.cleanTool();
                this.oneFile.blob = event.target.result;
                let storeImg=JSON.parse(JSON.stringify(this.oneFile));
                storeImg.uploaded=false;
                this.imgArr.push(storeImg);
            };
            readerBuffer.onload=(e:any)=>{
                this.bufferArr.push(e.target.result);
                console.log(this.bufferArr);
            };
            reader.readAsDataURL(this.file);
            readerBuffer.readAsArrayBuffer(this.file);
        },
        removeImg:(v)=>{
            for (let i = 0, len = this.imgArr.length; i < len; i++) {
                if (this.imgArr[i].name == v) {
                    this.imgArr.splice(i, 1);
                    this.bufferArr.splice(i,1);
                    break;
                }
            }
        },
        rename:(e)=>{
            let node=e.currentTarget;
            node.contentEditable=true;
        },
        renameBlur(e,img){
            let str=limitStr(e.target.innerText);
            img.name=str;
            e.target.innerText=str;
        },
        allClean:()=>{
            this.cleanTool();
            this.imgArr=[];
            this.bufferArr=[];
        }
    };
    setLoadBar={
        count:0,
        size:0,
        set:function(len){
            this.count++;
            this.size=Math.ceil((this.count/len)*100)+'%';
        },
        clean:function(){
            this.size=0;
            this.count=0;
        }
    }
}