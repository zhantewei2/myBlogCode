import {Injectable} from '@angular/core';
import {LoginService} from '../service/login.service';
import {SimpleHttp} from './simpleHttp.service';
@Injectable()
export class CategorysService{
    cgArr:Array<any>=[];
    showCgArr:Array<any>=[];
    tgArr:Array<any>=undefined;
    constructor(
        public simpleHttp:SimpleHttp,
        loginService:LoginService
    ){
        simpleHttp.get('router/categorys.json').then((data:any)=>{
            if(!data)return;
            let totalSize=0;
            if(data.l===true){
                loginService.logined=true;
            }
            for (var i in data.d){
                this.cgArr.push({name:i,count:data.d[i]});
                totalSize+=data.d[i];
            };
            this.showCgArr=[{name:'all',count:totalSize}].concat(this.cgArr);
        });
    };
    getTags():any{
        if(this.tgArr)return Promise.resolve(this.tgArr);
        return this.simpleHttp.post('router/tags.json').then((v:any)=>{
            if(!v)return false;
            this.tgArr=JSON.parse(v).tags||[];
            return true;
        });
    };
    findI(arr,name):any{
        for(let i=0,len=arr.length;i<len;i++){
            if(arr[i]['name']===name){
                return i;
            }
        }
        return null;
    }
    reSetShowCg(){
        let size=0;
        this.cgArr.forEach(item=>{
            size+=item.count;
        });
        this.showCgArr=[{name:'all',count:size}].concat(this.cgArr);
    }
}