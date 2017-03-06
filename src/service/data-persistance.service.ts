import {Injectable} from '@angular/core';
@Injectable()
export class DataPersistance{
	db:any={};
	photoData:Array<any>;
	initCollection(size=5){
		size--;
		let colle:any={};
		let m=new Map();
		colle.num=0;
		colle.set=(key,value)=>{
			if(m.size>size){
				m.delete(m.keys().next().value);
				colle.num--;
			}
			m.set(key,value);
			colle.num++;
		};
		colle.get=(key)=>{
			return m.get(key);
		};
		colle.getMap=()=>{
			return m;
		}
		return colle;
	}
}