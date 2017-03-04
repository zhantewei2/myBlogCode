import {Injectable} from '@angular/core';
import {LoginService} from '../service/login.service';
import {SimpleHttp} from './simpleHttp.service';
@Injectable()
export class CategorysService{
    cgArr:Array<any>=[];
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
            this.cgArr.unshift({name:'all',count:totalSize});
        });
    };
    getTags():any{
        if(this.tgArr)return this.tgArr;
        return this.simpleHttp.post('router/tags.json').then((v:any)=>{
            if(!v)return false;
            this.tgArr=JSON.parse(v).tags;
            return true;
        });
    }

}