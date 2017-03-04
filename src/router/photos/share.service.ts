import {Injectable} from '@angular/core';
import {SimpleHttp} from '../../service/simpleHttp.service';
import {PageBreakService} from '../../service/page-break.service';
export class Data{
    photosArr:any;
    barArr:Array<number>;
};
export class PushPhoto{
    name:string;
    itd?:string;
};
@Injectable()
export class ShareService{
    rootData:Array<any>;
    pageData:any={};
    pageConfig:any={
        pageSize:6,
        barSize:5,
        url:'/router/photos/one/find',
        delPhotoUrl:'/router/photos/admin/delPhoto',
        pushPhotoUrl:'/router/photos/admin/updatePhoto',
        setCoverUrl:'/router/photos/admin/setCover',
        delAlbumUrl:'/router/photos/admin/delAlbum'
    };
    constructor(
        private simpleHttp:SimpleHttp,
        private _ps:PageBreakService
    ){}

    method={
        imgUrl:(name)=>{
            return '/public/photos/'+name;
        },
        getRootData:()=> {
            if (this.rootData) return this.rootData;
            return this.simpleHttp.post('/router/photos/rootLoad').then((v: any) => {
                this.rootData=JSON.parse(v).photoCategory;
                return Promise.resolve(this.rootData);
            })
        },
        getPageData:(breakPageTool,album,nowPage)=>{
            return new Promise(resolve=>{
                breakPageTool.getData(nowPage,this.pageConfig.url,this.simpleHttp).then(data=>{
                    if(!data){
                        resolve('');
                        return;
                    }
                    resolve({
                        photosArr: data,
                        barArr:breakPageTool.getBarArr(nowPage)
                    });
                })
            })
        },
        removePhoto:(album,_id)=>{
            return new Promise(resolve=> {
                this.simpleHttp.post(this.pageConfig.delPhotoUrl,{c:album,id:_id}).then(v=>{
                    !v?resolve(false):resolve(true);
                })
            })
        },
        findItem:(name)=>{
            for(let item of this.rootData){
                if(name===item.name)return item;
            }
            return null;
        },
        rePage:(album:string,data:Data)=>{
            this.pageData[album]=data;
        },
        breakTool:(query,totalSize)=>{
            return this._ps.breakPage_loader({
                totalSize:totalSize,
                pageSize:this.pageConfig.pageSize,
                barSize:this.pageConfig.barSize,
                query:query
            })
        },
        updatePhoto:(id,obj:PushPhoto)=>{
            return this.simpleHttp.post(this.pageConfig.pushPhotoUrl,{q:id,b:obj}).then(v=>v);
        },
        setToCover:(id,album)=>{
            return this.simpleHttp.post(this.pageConfig.setCoverUrl,{q:album,d:id}).then(v=>v)
        },
        delAlbum:(name)=>{
            return this.simpleHttp.post(this.pageConfig.delAlbumUrl,{q:name}).then(v=>v)
        }
    }
}