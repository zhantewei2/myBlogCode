import {Component} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {SimpleHttp}from '../../service/simpleHttp.service';
import {MyIndexDBs} from '../../service/my-indexDBs.service';
import {ConveyMessageService,ConveyJournalService} from '../../service/convey-message.service';
import {SlideRow} from '../../animations/some-animate.fn';
import {LoginService} from '../../service/login.service';
import {DataPersistance} from '../../service/data-persistance.service';
import {CategorysService} from '../../service/categorys.service';
@Component({
	template:`
		<div >
			<button class="btn btn-secondary btn-lg" (click)="goBack()"><i class="fa-chevron-left fa"> </i> Back</button>
			<span  [@slideRow]="fixButton?'true':'false'" class="badge badge-pill fixButton"  (click)='goBack()' pointer >
				<i class="fa-arrow-circle-o-left fa fa-3x"></i>
			</span>
			<div class="col-xl-10 col">
				<div class="card" class="main">
					<h1 class="text-center">{{title}}</h1>
					<ztw-loader [exist]="journalData.content"> </ztw-loader>
					<div [innerHTML]="journalData.content"> </div>
					<div class="mt-5 d-flex flex-column align-items-end text-muted">
						<div *ngIf="loginService.logined" class="mr-3">
							<span (click)="edit=!edit" >
								<span [hidden]="!edit">
									<a class="btn btn-secondary noneB" pointer (click)="delJournal()">Del </a>
									<a class="btn btn-secondary noneB" pointer (click)="modifyJournal()">Modify</a>
								</span>
								<span class="btn btn-secondary noneB" pointer>
								<i class="fa-edit fa"></i>Edit
								</span>
							</span>
						</div>
						<div class="mr-3">				
								<i class="fa fa-calendar "></i>{{journalData.date | date}} <i class="fa fa-eye"> </i>{{journalData.visitCount}}
								<i class="fa-comments fa "> </i>{{journalData.notesCount}}		
						</div>
						<div *ngIf="journalData.lastModify" style="font-size:0.9rem " class="mr-3">
							lastModify:&nbsp;
							<i class="fa-calendar-plus-o fa"></i>
							<span>{{journalData.lastModify | toDate}} </span>
						</div>
						<div class="d-flex flex-wrap mr-3" *ngIf="journalData.tags">
							<span [hidden]="!showTags">
								<span class="badge badge-default mr-2 myBadge" *ngFor="let tag of journalData.tags">{{tag}} </span>
							</span>&nbsp;
							<i class="fa-tags fa" (mouseover)="showTags=true" (mouseleave)="showTags=false"> </i>{{journalData.tags.length}}
					 	</div>
					 </div>
					 
				</div>
			</div>
			<router-outlet></router-outlet>
		</div>
	`,
	styles:[
		'.main{margin:1rem}',
		'.fixButton{color:black;position:fixed;left:10%;top:10%;z-index:40;overflow:hidden;box-shadow:3px 3px 3px gray;opacity:0.5}',
		'.d-flex i{margin-right:0.5rem;margin-left:1.5rem;}',
		'.noneB{border-width:0px;}',
		'.myBadge{background:gray}',
		'.fa-tags:hover{color:green;cursor:pointer}'
	],
	animations:[SlideRow()]
})
export class JournalOneComponent{
	goBackObj={};
	title:string;
	obj:any={};
	fixButton:boolean=false;
	modifyConveyData:any;
	journalData:any={};
	edit:boolean=false;
	showTags:boolean=false;
	constructor(
		private route:ActivatedRoute,
		private router:Router,
		private db:MyIndexDBs,
		private simpleHttp:SimpleHttp,
		public _cms:ConveyMessageService,
		public _cjs:ConveyJournalService,
		public loginService:LoginService,
		public _dp:DataPersistance,
		public _cs:CategorysService
	){}
	ngOnInit(){
		window.addEventListener('scroll',(()=>{
			let pre=0;
			return ()=>{
				let top=document.documentElement.scrollTop||document.querySelector('body').scrollTop;
				if(top>16){
					if(pre&&top<=pre){//scrollUp;
						!this.fixButton?this.fixButton=true:0;
					}else{		//scrollDown;
						this.fixButton?this.fixButton=false:0;
					}
					pre=top;

				}else if(top<16){
					this.fixButton=false;
				}
			};
		})());
		let	params:any=this.route.snapshot.params;
		this.obj.__proto__=this._cms.conveyData;
		this.title=decodeURIComponent(params.n);
		this.db.journalColle.then(model=>{
			model.find(this.title).then(data=>{
				if(params.f==='edit'){
					this.postOne(model);
					return;
				}
				if(this._cms.conveyData){
					window.history.replaceState({},'','journal;nowPage='+this.obj.nowPage+';index='+this.obj.index);
					this.goBackObj={nowPage:this.obj.nowPage,index:this.obj.index};
					if(data&&data.version==this.obj.version&&data.date==this.obj.date){
						this.obj.content=data.content;
						data.notesCount>this.obj.notesCount?this.obj.notesCount=data.notesCount:0;
						this.initPage(this.obj);
					}else{
						this.postOne(model);
					}
				}else{
					if(data){
						this.postTwo(model,data);
					}else{
						this.postOne(model);
					}

				}
			})
		});
	};
	postOne(model){
		this.simpleHttp.post('router/journals.json/one',{id:this.title}).then((json:string)=>{
			let data=JSON.parse(json);
			this.initPage(data);
			model.update({
				position:data.title,
				content:data.content,
				date:data.date,
				version:data.version,
				notesCount:data.notesCount,
				lastModify:data.lastModify,
				category:data.category,
				tags:data.tags
			})
		});
	}
	postTwo(model,DBdata){
		this.simpleHttp.post(
			'router/journals.json/one/part',
			{id:this.title}
		).then((json:string)=>{
			let data=JSON.parse(json);
			if(DBdata.version!==data.version||DBdata.date!==data.date){
				this.postOne(model);
			}else{
				data.__proto__=DBdata;
				this.initPage(data);
			}
		})
	}
	initPage(data){
		this.journalData=data;
		this.journalData.title=this.title;
		this.router.navigate([data.notesCount],{relativeTo:this.route});
	}
	goBack(){
		this.router.navigate(['../',this.goBackObj],{relativeTo:this.route});
	};
	modifyJournal(){
		this._cjs.conveyJournalData=this.journalData;
		this.router.navigate(['./write',{modify:1}]);
	};
	delJournal(){
		let post=(obj)=>{
			this.simpleHttp.post('router/admin/journals.json/del',obj).then(v=>{
				this.db.journalColle.then(model=>{
					model.remove(this.title).then(v=>{
						this._dp.db={};
						this._cs.showCgArr[0].count--;
						this._cs.cgArr[this._cs.findI(this._cs.cgArr,this.journalData.category)].count--;
						this.router.navigate(['../'],{relativeTo:this.route});
					})
				})
			})
		};
		new Promise(r=> {
			if (confirm('delete ' + this.title + '?')) {
				this._cs.getTags().then(v=>r(v));
			}else{
				r(false)
			}
		}).then(v=>{
			if(!v)return;
			let sendObj:any={t:this.title,c:this.journalData.category},
				tags=this.journalData.tags,
				option;
			if(tags&&tags[0]){
				tags.forEach(tagName=>{
					let i = this._cs.findI(this._cs.tgArr,tagName);
					if(i!==null){
						this._cs.tgArr[i].count<=1?this._cs.tgArr.splice(i,1):this._cs.tgArr[i].count--;
					}
				});
				sendObj.d=this._cs.tgArr;
			};
			post(sendObj);
		})

	}
};