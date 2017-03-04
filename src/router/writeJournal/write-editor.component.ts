import {Component,ViewChild,Input} from '@angular/core';
let writeJs=require('./write.js');
import {MyIndexDBs} from '../../service/my-indexDBs.service';
import {ConveyJournalService} from '../../service/convey-message.service';
@Component({
	selector:'ztw-editor',
	templateUrl:'./editor.html',
	styleUrls:['./write.css']
})
export class WriteEditorComponent{
	@ViewChild('contentHTML')contentHTML;
	@Input('model')model;
	@Input('content')content;
	switchH:boolean=false;
	switchBtn:string='TEXT';
	db:any;
	storage:any;
	storageStrPre:string='';
	constructor(
		private indexDB:MyIndexDBs,
		private _cjs:ConveyJournalService
	){};
	ngOnInit(){
		writeJs();
		let textOne=document.getElementById('TEXTOne');
		if(this.model=='modify'){
			textOne.innerHTML=this._cjs.conveyJournalData.content;
			this._cjs.conveyJournalData=undefined;
			return;
		}
		this.db=this.indexDB.cappedWriteDB;
		//capped write content:
		this.db.then(model=>{
			model.find('one').then(data=>{
				if(data&&data.content){
					textOne.innerHTML=data.content;
				}else {
					model.insert({journal: 'one'});
				}
			})
		})
	};
	focus(e){
		this.storage=setInterval(()=> {
			let value=e.target.innerHTML;
			if(this.storageStrPre==value)return;
			this.db.then(model=>{
				model.update({journal:'one',content:value}).then(v=>{
					console.log(1);
				});
			})
		},10000)
	};
	clearDB(){
		this.db.then(model=>{
			model.remove('one');
		})
	}
	blur(){
		this.storage?clearInterval(this.storage):0;
		let html=document.getElementById('TEXTOne').innerHTML;
		if(!html)return;
		this.db.then(model=>{
			model.update({journal:'one',content:html});
		})
	}
	switchEditor(){
		this.switchBtn=this.switchBtn==='TEXT'?'HTML':'TEXT';
		this.switchH=!this.switchH;
	}
	ngAfterViewInit(){
		let contentNode=this.contentHTML.nativeElement;
		this.getHTML();
	}
	getHTML(){
		return this.miniHTML(this.contentHTML.nativeElement.innerText);
	};
	getAbstract(max){
		let value=this.contentHTML.nativeElement.innerText;
		console.log(value);
		let content=value.replace(/(\n|\r)/g,'\t').replace(/<.+?>/g,'');
		return content.length>max?content.substr(0,max):content;
	}
	miniHTML(HTML){
		return HTML.replace(/(\r|\n)/g,'').replace(/\s+$/,'');
	}
};