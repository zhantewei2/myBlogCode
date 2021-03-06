import {Injectable} from '@angular/core';
import {SimpleHttp} from './simpleHttp.service';
@Injectable()
export class LoginService{
	logined:boolean=false;
	constructor(private simpleHttp:SimpleHttp){}
	login(obj):Promise<any>{
		return new Promise((resolve)=>{
			this.simpleHttp.post('/login',obj).then((v:any)=>{
				this.logined=+v?true:false;
			})
		})
	}
	logout():Promise<any>{
		return new Promise((resolve)=>{
			this.simpleHttp.post('/logout').then(v=>{
				this.logined=false;
				resolve(+v);
			})
		})
	}
}