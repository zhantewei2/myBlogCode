import {Component,ViewChild} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {FormBuilder,Validators} from '@angular/forms';
import {LoginService} from '../../service/login.service';
import {SimpleHttp} from '../../service/simpleHttp.service';
import {ShareService} from './share.service';
import {FadeIn} from '../../animations/some-animate.fn';
import {DataPersistance} from '../../service/data-persistance.service';
class Album{
    name:string;
    count:number;
    main?:string;
}
@Component({
    templateUrl:'./root.html',
    styleUrls:['./img.css'],
    animations:[FadeIn()]
})
export class RootComponent{
    albumsMax:number=50;
    edit:boolean=false;
    @ViewChild('popView')modal;
    @ViewChild('appendAlbum')appendAlbum;
    constructor(
        private route:ActivatedRoute,
        public _ls:LoginService,
        private _fb:FormBuilder,
        private simpleHttp:SimpleHttp,
        public _ss:ShareService,
        private router:Router,
        public _dp:DataPersistance
    ){}
    ngOnInit(){
        this._ss.method.getRootData();
    }
    admin:any={
        formGroup:undefined,
        appendNameControl:undefined,
        appendNameError:undefined,
        DAcount:undefined,
        DAname:undefined
    };
    method:any={
        appendAlbum:(input)=>{
            if(!this._dp.photoData) return;
            let value=this.admin.appendNameControl.value;
            if(!this.method.checkValue(value)){
                this.admin.appendNameError='repeat name';
                return;
            }
            value=value.replace(/(\r|\n|\s)/g,'');
            this.simpleHttp.post('/router/photos/admin/appendAlbum',{n:value}).then(v=>{
                let obj={name:value,count:0};
               this._dp.photoData.push(obj);
            });
            this.appendAlbum.hidden();
            input.value='';
        },
        showAppend:()=>{
            this.method.buildAppendForm();
            this.appendAlbum.show();
        },
        buildAppendForm:()=>{
            this.admin.formGroup=this._fb.group({
                'name':['',[Validators.required,Validators.maxLength(10)]],
            });
            this.admin.appendNameError=undefined;
            this.admin.appendNameControl=this.admin.formGroup.get('name');
        },
        checkValue:(value)=>{
           for(let i of this._dp.photoData){
               if(i.name==value)return false;
           }
           return true;
        },
        entryAlbum:(value)=>{
            value=encodeURIComponent(value);
            this.router.navigate(['photo',{n:value}],{relativeTo:this.route})
        },
        delAlbum:(album)=>{
            this.admin.DAname=album.name;
            this.admin.DAcount=album.count;
            this.modal.show()
        },
        delAlbum2:()=>{
            this._ss.method.delAlbum(this.admin.DAname).then(v=>{
                if(!v)return;
                this.modal.hidden();
                let relItem=this._ss.method.findItem(this.admin.DAname);
                this._dp.photoData.splice(this._dp.photoData.indexOf(relItem),1);
            })
        }
    }

}