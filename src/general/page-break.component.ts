import {Component,Optional,Input} from '@angular/core';
import {Parent,SimpleHttp}from '../service/simpleHttp.service';
import {ActivatedRoute} from '@angular/router';
import {PageBreakService} from '../service/page-break.service';
import {DataPersistance} from '../service/data-persistance.service';
@Component({
	selector:'ztw-pageBreakBar',
	template:`
		<div class='btn-group'>
			<button class='btn btn-outline-secondary' (click)='pre()' [disabled]='shareOpt.nowPage-1<0'>&lt; </button>
			<button (click)='gotoPage(btn)' [class.active]='btn==shareOpt.nowPage' class='btn btn-outline-secondary' *ngFor='let btn of btns'>{{btn}}</button>
			<button class='btn btn-outline-secondary' (click)='next()' [disabled]='shareOpt.nowPage+1>totalPage'>&gt; </button>
			<div style='display:inline-block;height:50px;'> 
				<ztw-loader [exist]='cancelLC'></ztw-loader>
			</div>
		</div>
	`
})
export class PageBreakComponent{
	symbolMerge:string='_ztw_';
	cancelLC:any=true;
	btns=[];
	limitPage:number=5;
	rangePage:number;
	totalPage:number;
	nextPage:number;
	prePage:number;
	options=this.parent.getOption;
	shareOpt=this.parent.shareOpt;
	//send url +obj:
	sendUrl:string;
	addition:any=null;
	//pageService.totalSize 's field:
	v0:any;
	v1:any;
	name:string;
	@Input('classify') set getClassify(v){
		//v[0]-urlName;
		//v[1]-addonConditionStr;
		let v0=v[0],v1=v[1];
		this.v0=v0;
		this.v1=v1;
		if(!v0)return;
		this.sendUrl=this.parent.url[v0];
		this.addition=null;
		if(v1){
			this.addition=v1;
			this.name=v0+this.symbolMerge+v1;
		}else{
			this.name=v0;
		}
		!this.pageService.totalSize[this.name]?this.pageService.totalSize[this.name]=-1:0;

		this.options.totalSize=-1;
		this.shareOpt.nowPage=0;
		this.options.start=0;
		this.start();
	}
	constructor(
		@Optional() public parent:Parent,
		private simpleHttp:SimpleHttp,
		private route:ActivatedRoute,
		private pageService:PageBreakService,
		//pageService storage: [url ][router];
		private db:DataPersistance
		){
		!this.db.db.allJournals?this.db.db.allJournals=this.db.initCollection(20):0;
	}
	start(){
		let opt=this.options;
		if(this.pageService.totalSize[this.name]!==-1){
			this.route.params.subscribe((d:any)=>{
				d.nowPage?this.shareOpt.nowPage=+d.nowPage:0;
				d.index?this.shareOpt.pageIndex=+d.index:0;
				opt.totalSize=this.pageService.totalSize[this.name];
				this.init(opt);
				this.updateParent(this.sendUrl,opt);
			})
		}else{
			this.updateParent(this.sendUrl,opt).then(v=>{
				this.init(opt);
			})
		}
	}
	init(opt){
		this.totalPage=Math.ceil(opt.totalSize/opt.pageSize)-1;
		this.convertStart(this.shareOpt.nowPage);
		this.rangePage=Math.floor(this.shareOpt.nowPage/this.limitPage);
		this.provideBtns(this.rangePage);
	}
	pre(){
		let targetPage=this.shareOpt.nowPage-1;
		if(targetPage>=0){
			this.gotoPage(targetPage);
		}
	}
	next(){
		let targetPage=this.shareOpt.nowPage+1;
		if(targetPage<=this.totalPage){
			this.gotoPage(targetPage);
		}
	}
	provideBtns(rangeNum){
		this.btns=[];
		rangeNum++;
		let i=rangeNum*this.limitPage-this.limitPage;
		let oldI=i;
		let end=rangeNum*this.limitPage;
		end=end>this.totalPage?this.totalPage:end;
		for(i;i<=end;i++){
			this.btns.push(i);
		};
		rangeNum!==1?this.btns.unshift(oldI-1):0;
	}

	gotoPage(page){
		if(page===this.shareOpt.nowPage) return;
		if(this.parent.shareOpt.barrage) return;
		this.shareOpt.pageIndex=-1;
		let rangePageNow=Math.floor(page/this.limitPage);
		this.cancelLC=false;
		this.options.start=this.convertStart(page);
		this.shareOpt.nowPage=page;
		if(rangePageNow!==this.rangePage){
			this.rangePage=rangePageNow;
			this.provideBtns(rangePageNow);
		};

		this.updateParent(this.sendUrl,this.options);
	}
	updateParent(url,opt0){

		let opt:any={};
		for(let i in opt0){
			opt[i]=opt0[i];
		}
		if(this.addition){opt['addon']=this.addition};
		if(this.options.start<0){
			opt.pageSize=this.options.pageSize+this.options.start;
			opt.start=0;
		};
		let item=this.name+this.symbolMerge+this.shareOpt.nowPage;
		return new Promise((resolve)=>{
		let storeData=this.db.db.allJournals.get(item);
		if(storeData){
			if(storeData=='empty'){
				this.parent.emptyContent=true;
				this.parent.heroes='';
			}else {
				this.parent.emptyContent=false;
				this.updateData(storeData);
			}
			resolve();
		}else{
		this.simpleHttp.post(url,opt).then((d:any)=>{
			if(!d){
				this.parent.emptyContent=true;
				this.parent.heroes='';
				this.db.db.allJournals.set(item,'empty');
				return;
			}
			this.parent.emptyContent=false;
			d=JSON.parse(d);
			let len=d.data.length;
			let dataInvert=[];
			while(len){
				len--;
				let per=d.data[len];
				per.index=len;
				dataInvert.push(per);
			}
			this.db.db.allJournals.set(item,dataInvert);
			this.updateData(dataInvert,d.count,function(){
				resolve();
			})
		})
		}
		})
	}
	convertStart(page){
		++page;
		return this.options.start=this.options.totalSize-page*this.options.pageSize;
	}	
	updateData(data,count?,fn?){
		this.parent.heroes=data;
		if(count){
			this.options.totalSize=count;
			this.pageService.totalSize[this.name]=count;
		}
		this.cancelLC==='undefined'?0:this.cancelLC=true;
		if(!fn)return;
		fn();
	}

}