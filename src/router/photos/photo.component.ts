import {Component,ViewChild} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {FadeIn} from '../../animations/some-animate.fn';
import {LoginService} from '../../service/login.service';
import {ShareService,Data} from './share.service';
import {Ficker} from '../../animations/some-animate.fn';
import {DataPersistance} from '../../service/data-persistance.service';
@Component({
    templateUrl:'photo.html',
    styleUrls:['./img.css'],
    animations:[FadeIn(),Ficker(2000,'green')]
})
export class PhotoComponent{
    @ViewChild('popView')popView;
    @ViewChild('popView2')popView2;
    @ViewChild('showImg')showImg;
    constructor(
        private route:ActivatedRoute,
        private router:Router,
        public _ls:LoginService,
        public _ss:ShareService,
        public _dp:DataPersistance
    ){}
    ngOnInit(){
        let params:any=this.route.snapshot.params;
        let init=()=>{
            this.msn.relItem=this._ss.method.findItem(this.msn.parent);
            if(this.msn.relItem.count<1)return;
            this.msn.breakPageTool=this._ss.method.breakTool(this.msn.parent,this.msn.relItem.count);

            if(this._ss.pageData[this.msn.parent]){
                this.method.setData(this._ss.pageData[this.msn.parent]);
            }else {
                this._ss.method.getPageData(this.msn.breakPageTool,this.msn.parent, 1).then((d: Data) => {
                    this._ss.pageData[this.msn.parent] = d;
                    this.method.setData(d);
                });
            }
        };
        this.msn.parent=params.n;
        if(!this._dp.photoData){
            (this._ss.method.getRootData() as any).then(d=>{
                init();
            })
        }else{
            init();
        }
    }
    data:Data;
    msn:any={
        breakPageTool:undefined,
        parent:undefined,
        edit:false,
        relItem:undefined,
        showImg:undefined,
        chengedItemName:undefined
    };
    method:any={
        edit:()=>{
            this.msn.edit=!this.msn.edit;
        },
        del:(e,id)=>{
            e.stopPropagation();
            this._ss.method.removePhoto(this.msn.parent,id).then(v=>{
                if(!v)return;
                this.msn.relItem.count--;
                this.method.refresh();
            })
        },
        refresh:()=>{
            this.msn.breakPageTool=this._ss.method.breakTool(this.msn.parent,this.msn.relItem.count);
            this._ss.method.getPageData(this.msn.breakPageTool,this.msn.parent,1).then((d:Data)=>{
                if(!d)return;
                this._ss.pageData[this.msn.parent]=d;
                this.method.setData(d);
            });
        },
        setData:(d)=>{
            let obj:any={};
            obj.photosArr=d.photosArr;
            obj.barArr=d.barArr;
            this.data=obj;
        },
        gotoPage:(n)=>{
            this._ss.method.getPageData(this.msn.breakPageTool,this.msn.parent,n).then((d:Data)=>{
                this.method.setData(d);
            })
        },
        whenUploaded:(n)=>{
            if(!n)return;
            this.msn.relItem.count+=+n;
            this.popView.hidden();
            this.method.refresh();
        },
        selectedPhoto:(img)=>{
            this.msn.showImg=img;
            this.popView2.show();
        },
        photoHidden:()=>{
            this.showImg.msn.edit=false;
        },
        whenChanged:(v)=>{
            this.popView2.hidden();
            if(v==='changed') {
                this.msn.changedItemName = this.msn.showImg.name;
            }else if(v==='cover'){

            }
        }
    };
    goBack(){
        this.router.navigate(['../'],{relativeTo:this.route});
    }
}