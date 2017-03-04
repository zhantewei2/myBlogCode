import {Injectable} from '@angular/core';
@Injectable()
export class PageBreakService{
	totalSize:any={};
	//cache breakPage
	breakPage_loader=(obj,mul=2)=>{
		let bp=new this.breakPage(obj.totalSize,obj.pageSize*mul,obj.barSize,obj.query,obj.attr),
		    bp2:any={},
			storeRange:number,
			storeDataArr:Array<any>;
		bp2.__proto__=bp;
		bp2.getData=function(nowPage,url,ajax){
			return new Promise(resolve=> {
				if (Math.ceil(nowPage / mul) !== storeRange) {
					storeRange = Math.ceil(nowPage / mul);
					bp.getData(storeRange, url, ajax).then(data => {
						storeDataArr=data;
						resolve(this.getRangeArr(storeDataArr,this.getIndex(nowPage)));
					});
				}else{
					resolve(this.getRangeArr(storeDataArr,this.getIndex(nowPage)));
				}
			})
		};
		bp2.getIndex=(nowPage)=>{
			let n=nowPage%mul;
			n==0?n=mul:0;
			return n;
		};
		bp2.getRangeArr=(arr,index)=>{
			let start=obj.pageSize*(index-1),
				end=obj.pageSize*index,
				theEnd=arr.length;
				end>theEnd?end=theEnd:0;
			return arr.slice(start,end);
		};
		bp2.getBarArr=(nowPage)=>{
			let size=Math.ceil(obj.totalSize/obj.pageSize);
			return bp.getBarArr(nowPage,size);
		};
		return bp2;
	};
	//breakPage main:
	breakPage=function(totalSize,pageSize,barSize,query?,attr?):void{
		/*send obj:   {skip:* ,size:* };
		  query : will send { q : query, d : obj};
		   		  mongodb will find ( {name:query} );
		  	              else find ( {});
		  attr: is embed array filed; For example: return { arr: [ {} , {} ]};
		*/
		this.getSkipOffset=(nowPage,size)=>{
			let obj={skip:0,size:size};
			obj.skip=totalSize-nowPage*size;
			if(obj.skip>=totalSize){
				return false;
			}else if(obj.skip<0){
				obj.size=size+obj.skip;
				obj.skip=0;
			}
			return obj;
		};
		let barTotalSize=Math.ceil(totalSize/pageSize);
		this.getData=(nowPage,url,ajax,size=pageSize)=>{
			let obj={},baseObj=this.getSkipOffset(nowPage,size);
			if (query){
				obj={q:query,d:baseObj};
			}else{
				obj=baseObj;
			}
			return new Promise(resolve=> {
				ajax.post(url, obj).then(data => {
					if(!data){resolve(false);return;}
					let d=JSON.parse(data);
					attr?resolve(this.inverseArr(d[attr],baseObj.skip)):resolve(this.inverseArr(d,baseObj.skip));
				})
			})
		};
		this.getBarArr=(nowPage,size=barTotalSize)=>{
			nowPage--;
			let startOffset=Math.floor(nowPage/barSize)*barSize+1,
				endOffset=startOffset+barSize;
			startOffset>1? startOffset--:0;

			let arr=[];
			endOffset=endOffset>size?size:endOffset;
			for(let i=startOffset;i<=endOffset;i++){
				arr.push(i);
			}
			return arr;
		};
		this.resetTotalSize=(size)=>{
			totalSize=size;
		};
		this.inverseArr=(arr,skip)=>{
			let arr2=[],len=arr.length;
			let index=skip+len;
			while(len--){
				arr[len].index=index--;
				arr2.push(arr[len]);
			};
			return arr2;
		}
	}
}