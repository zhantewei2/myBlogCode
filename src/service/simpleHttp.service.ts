import {Injectable} from '@angular/core';
import {Http,RequestOptions,Headers} from '@angular/http';
const path=require('path');
import 'rxjs/add/operator/delay';

export class Parent{
	getOption:any;
	heroes:any;
	url:any;
	shareOpt:any;
	dataBase:any;
	emptyContent:boolean;
}


@Injectable()
export class SimpleHttp{
	constructor(private http:Http){};
	options=new RequestOptions({
		headers:new Headers({'Content-Type':'application/json'}),
		withCredentials:true
	});

	realPath(url){
		return url
	}
	parseObj(obj){
		let str='?';
		for (var v in obj){
			str.length>1?str+='&':0;
			str+=v+'='+obj[v];
		}
		return str;
	}
	get=(url,obj?):Promise<any>=>{
		obj?url+=this.parseObj(obj):0;
		return new Promise((resolve)=>{
			this.http.get(this.realPath(url),this.options).subscribe(data=>{
				data=JSON.parse(data['_body']);
				resolve(data);
			})
		});
	}
	post=(url,obj?):Promise<any>=>{
		return new Promise((resolve)=>{
			this.http.post(this.realPath(url),obj?obj:{},this.options).subscribe(data=>{
				resolve(data['_body']);
			})
		})
	}
	del=(url,str):Promise<any>=>{
		return new Promise((resolve)=>{
			this.http.put(this.realPath(url),{m:'delete',q:str},this.options).subscribe(data=>{
				resolve(data);
			})
		})
	}
	update=(url,str):Promise<any>=>{
		return new Promise((resolve)=>{
			this.http.put(this.realPath(url),{m:'append',q:str},this.options).subscribe(data=>{
				resolve(data);
			})
		})
	}
}