import {Component,ViewChild} from '@angular/core';
import {SimpleHttp}from '../../service/simpleHttp.service';
import {Subject} from 'rxjs/subject';
import  'rxjs/add/operator/distinctUntilChanged';
import  'rxjs/add/operator/debounceTime';
import {FickerIn,SlideToggle} from '../../animations/some-animate.fn';
import {WriteEditorComponent} from './write-editor.component';
import {CategorysService} from '../../service/categorys.service';
import {ConveyJournalService} from '../../service/convey-message.service';

import {Router} from '@angular/router';
declare var $:any;
@Component({
	templateUrl:'./write.html',
	styleUrls:['./write.css'],
	animations:[
		FickerIn(),
		SlideToggle()
	]
})
export class WriteJournalComponent{
	selectCategorys:string='default';
	categorys:Array<any>=[];
	defaultValue:string='default';
	showEditCategory:boolean=false;
	existCategory:boolean=false;
	subject:Subject<any>;
	searchTagSub:Subject<any>=new Subject();
	addInput;
	searchTagStr:any;
	searchTagStr2:any;
	cancelSearch:boolean;
	tagsStr:string;
	@ViewChild(WriteEditorComponent)public _wec;
	titleExistArr:Array<any>=[];
	submitDisabled:boolean=false;
	titleExist:boolean=false;
	legalTags:boolean=true;
	model:string='insert';
	data:any;
	constructor(
		private simpleHttp:SimpleHttp,
		public _cs:CategorysService,
		public _cjs:ConveyJournalService,
		private router:Router
		){}
	ngOnInit(){
		if(/modify/.test(location.pathname)&&this._cjs.conveyJournalData){
			this.data={};
			for(var i in this._cjs.conveyJournalData){
				this.data[i]=this._cjs.conveyJournalData[i];
			}
			this.model='modify';
			this.selectCategorys=this.data.category||'default';
			$('#inputTitle').val(this.data.title);
			this.tagsStr=this.data.tags?this.data.tags.join(','):'';

		}

	}
	ngAfterViewInit(){
		$('#categoryDropdown').on('hide.bs.dropdown',()=>{
			this.showEditCategory=false;
		});
		let cacheTag:any;

		this.searchTagSub.distinctUntilChanged().debounceTime(300).subscribe(value=>{	
			if(cacheTag){
				let test=eval('/^'+value+'/').test(cacheTag);
				if(test){
					this.searchTagStr2=cacheTag;
					return;
				};
			}
			this.simpleHttp.post('router/admin/tags.json/search',{q:value}).then(v=>{
				if(v){
					this.searchTagStr2=v;
					cacheTag=v;
				}else{
					this.searchTagStr2='';
					this.cancelSearch=true;
				}
			})
		},error=>{
				console.log(error);
		})
	}
	fn(){}
	changeTagsBar(e){
		if(!e){this.legalTags=true;return;};
		let arr=e.split(',');
		if(arr.length>6){
			this.legalTags=false;
			arr.pop();
			$('#tags').val(arr.join(','));
			return;
		}
		let nowValue=arr[arr.length-1];
		if(!nowValue)return;
		if(!this.checkTagsStr(nowValue)){
			this.legalTags=false;
			$('#tags').val(e.slice(0,-1));
		}else{
			this.legalTags=true;
		};
		
	}
	fn2(){
		if(this.checkTags($('#tags').val().split(','))){
			this.legalTags=true}else{
			this.legalTags=false;
		};
	
	}
	setSubject(bloo){
		this.subject.next(bloo);
	}
	selectCategoryFn(value,e){
		if(this.showEditCategory){
			e.stopPropagation();
			return;
		}
		this.selectCategorys=value;
	}
	deleteCategory(value){
		this.subject=new Subject();
		this.subject.subscribe(v=>{
			if(!v)return;
			this.simpleHttp.del('router/admin/categorys.json',value.name).then((v:any)=>{
				let index=this._cs.cgArr.indexOf(value);
				this._cs.cgArr.splice(index,1);
			})
		})
		this.alertModal('confirm delete the category of \"<font color="red">  '+value.name+'</font>\"');
	}
	editCategory(e){
		e.stopPropagation();
		this.selectCategorys=this.defaultValue;
		this.showEditCategory=!this.showEditCategory;
	}
	appendCategory(value){
		if(!value)return;
		value=value.trim();
		this.subject=new Subject();
		this.subject.subscribe(v=>{
			if(!v)return;
			this.simpleHttp.update('router/admin/categorys.json',value).then(v=>{
				this._cs.cgArr.push({name:value,count:0});
				this._cs.reSetShowCg();
				this.addInput='';
			})
		});
		this.alertModal('confirm append the category of \"<font color="red">  '+value+'</font>\"');
	}
	check(value){
		if(!value)return;
		value=value.trim();
		for (let category of this._cs.cgArr){
			if(value==category.name||value==this.defaultValue){
				this.existCategory=true;
				return;
			}
		}
		this.existCategory=false;
	}

	searchTag(e){
		let value=e.target.value;
		if(!value){
			this.searchTagStr='';
			this.cancelSearch=false;
			return;
		}
		let arr=value.split(',');
		let nowValue=arr[arr.length-1];
		this.searchTagStr=nowValue;
		if(!nowValue){
			this.cancelSearch=false;
			return;
		};
		if(this.cancelSearch)return;
		this.searchTagSub.next(nowValue);
	}
	submit(){
		let title=$('#inputTitle').val();
		if(!title){return};
		title=title.trim().replace(/(\s|\r|\n)/g,'');
		let content=this._wec.getHTML();
		if(!content){return;};
		if(this.titleExistArr.indexOf(title)>=0){
			this.titleExist=true;
			return;
		}
		let tags=$('#tags').val().split(',')||[];
		if(!this.checkTags(tags)){
			this.legalTags=false;
			return;
		}
		this.legalTags=true;
		this.submitDisabled=true;

			this.subject=new Subject();
			this.subject.subscribe(boole=>{
				if(!boole){this.submitDisabled=false;return;};
				let sendObj:any={
					t: title,
					co: content,
					ta: tags,
					ab: this._wec.getAbstract(50)
				};

				new Promise(resolve=>{
					if(this.data&&title==this.data.title){
						resolve(0);
					}else{
						this.simpleHttp.post('router/admin/journals.json/titleExist', {q: title}).then(v=>{
							resolve(v);
						})
					}
				}).then(v => {
					if(+v){
						this.titleExistArr.push(title);
						this.submitDisabled = false;
						this.titleExist = true;
						return;
					}
					this.dealAllTags(tags).then(sendAllTags=>{

						if(sendAllTags)sendObj.at=sendAllTags;
						if(this.model=='insert') {
							sendObj.c=this.selectCategorys;
							this.simpleHttp.post('router/admin/journals.json/insert', sendObj).then(v => {
								this._cs.cgArr[this._cs.findI(this._cs.cgArr,sendObj.c)].count++;
								this._cs.reSetShowCg();
								this._wec.clearDB();
							})
						}else{
							sendObj.q=this.data.title;
							if(this.selectCategorys!=this.data.category){
								sendObj.c=this.selectCategorys;
								sendObj.oc=this.data.category;
							};
							this.simpleHttp.post('router/admin/journals.json/update',sendObj).then(v=>{
								if(sendObj.oc){
									this._cs.cgArr[this._cs.findI(this._cs.cgArr,sendObj.oc)].count--;
									this._cs.cgArr[this._cs.findI(this._cs.cgArr,sendObj.c)].count++;
									this._cs.reSetShowCg();
								}
								this.router.navigate(['./journal/one',{n:title,f:'edit'}]);
							})
						}
					});

				})
			});
			this.alertModal('确定写入？');

		
		
	}
	checkTags(arr){
		if(arr.length>6)return false;
		for(var v of arr){
			if(!this.checkTagsStr(v))return false;
		};
		return true;
	}
	checkTagsStr(str,max=24){
		let size=0;
		for (var i of str){
			size+=i.codePointAt(0).toString(16).length;
		}
		return size>max?false:true;
	}
	alertModal(value){
		$('#myModal .modal-body').html(value);
		$('#myModal').modal('show');	
	};
	dealSelfTags(tags,callback){
			let arr = [];
			if(!this.data) {
				if(!tags||!tags[0])return callback(arr);
				tags.forEach(v => {
					arr.push({name: v, insert: true})
				});
				return callback(arr)
			}
			if((!this.data.tags||!this.data.tags[0])&&(!tags||!tags[0]))return callback(arr);
			tags.forEach(tag=>{
				let self;
				if(this.data.tags&&this.data.tags[0]){
					this.data.tags.forEach(oTag => {
						self = tag !== oTag ? true : false;
					});
				}else{
					self=true;
				}
				if(self)arr.push({name:tag,insert:true});
			});
			this.data.tags.forEach(oTag=>{
				let self;
				if(tags&&tags[0]){
					tags.forEach(tag => {
						self = oTag !== tag ? true : false;
					})
				}else {
					self=true;
				}
				if(self)arr.push({name:oTag,insert:false});
			});
			return callback(arr);
	};
	dealAllTags(selfTags){
		return this._cs.getTags().then(()=>{
			return this.dealSelfTags(selfTags,(arr:any)=>{
				let sendTgArr,newTgArr=[];
				if(!arr||!arr[0])return null;
				arr.forEach((item:any)=>{
					let index=this._cs.findI(this._cs.tgArr,item.name);
					if(index!==null){
						if(!item.insert&&this._cs.tgArr[index].count<=1){
							this._cs.tgArr.splice(index,1);
						}else{
							this._cs.tgArr[index].count+=item.insert?1:-1;
						}
					}else{
						item.name&&item.insert?this._cs.tgArr.push({name:item.name,count:1}):0;
					}
				});
				return this._cs.tgArr;
			})
		})
	}
};