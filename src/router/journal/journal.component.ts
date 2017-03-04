import {Component,forwardRef} from '@angular/core';
import 'rxjs/add/operator/map';
import {SimpleHttp,Parent} from '../../service/simpleHttp.service';
import {DataPersistance} from '../../service/data-persistance.service';
import {EntryAnimation,Ficker} from '../../animations/some-animate.fn';
import {ClassifyService} from '../../service/classify.service';
import {ConveyMessageService} from '../../service/convey-message.service';
import {Router,ActivatedRoute}from '@angular/router';
@Component({
	template:`
		<div pageBreak>
			<ztw-pageBreakBar [classify]="classify.selected" ></ztw-pageBreakBar>
			<div *ngIf="heroes">
				<div [@entryAnimation] 
					(@entryAnimation.start)='shareOpt.barrage=true'
					(@entryAnimation.done)='shareOpt.barrage=false'
					 class='card mt-3 borderBoth' *ngFor='let hero of heroes'>
					<a [@ficker]='shareOpt.pageIndex==hero.index?"ficker":0' class='card-header border-bottom-0 list-group-item-action text-left '(click)="navigateTo(hero)">
						{{hero.title}}
					</a>
					<div [innerHTML]="hero.abstract" class='card-block'>
					
					</div>
				</div>
			</div>
			<div *ngIf="emptyContent">
				<div class="alert alert-warning"><strong>No</strong> a Journal </div>
			</div>
		</div>
		<ztw-loader  [exist]='heroes||emptyContent'></ztw-loader>
	`,
	providers:[{provide:Parent,useExisting:forwardRef(()=>JournalComponent)}],
	animations:[
		EntryAnimation(),
		Ficker(1000)
	],
	styles:['.bgActive{background:gray}','.borderBoth{border-left-width:0;border-right-width:0}']
})
export class JournalComponent{
	heroes;
	ficker='ficker1';
	emptyContent:boolean=false;
	shareOpt={
		barrage:false,
		nowPage:0,
		pageIndex:-1
	};
	getOption={
		pageSize:5
	};
	url:any={
		tag:'./router/journals.json/tags',
		category:'./router/journals.json/categorys'
	};
	ngOnInit(){
		!this.classify.selected[0]?this.classify.selected=['category','all']:0;
	}
	navigateTo(data){
		data.nowPage=this.shareOpt.nowPage;
		data.pageSize=this.getOption.pageSize;
		this._cms.setData(data);
		this.router.navigate(['one',{n:encodeURIComponent(data.title)}],{relativeTo:this.route});

	}
	constructor(
		private simpleHttp:SimpleHttp,
		public db:DataPersistance,
		public classify:ClassifyService,
		public _cms:ConveyMessageService,
		private router:Router,
		private route:ActivatedRoute
		){};
}