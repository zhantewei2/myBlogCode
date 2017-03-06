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
	constructor(
		private simpleHttp:SimpleHttp,
		public _cs:CategorysService,
		public _cjs:ConveyJournalService,
		private router:Router
		){}
	ngOnInit(){
		let data=this._cjs.conveyJournalData;
		if(/modify/.test(location.pathname)&&data){
			this.model='modify';
			this.selectCategorys=data.category||'default';
			$('#inputTitle').val(data.title);
			this.tagsStr=data.tags?data.tags.join(','):'';
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
			this.simpleHttp.del('router/admin/categorys.json',value).then((v:any)=>{
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
		let tags=$('#tags').val().split(',');
		if(!this.checkTags(tags)){
			this.legalTags=false;
			return;
		}
		this.legalTags=true;
		this.submitDisabled=true;

			this.subject=new Subject();
			this.subject.subscribe(boole=>{
				if(!boole){this.submitDisabled=false;return;};
				if(this.model=='insert') {
					this.simpleHttp.post('router/admin/journals.json/titleExist', {q: title}).then(v => {
						if (+v) {
							this.titleExistArr.push(title);
							this.submitDisabled = false;
							this.titleExist = true;
						} else {
							this.simpleHttp.post('router/admin/journals.json/insert', {
								t: title,
								c: this.selectCategorys,
								co: content,
								ta: tags,
								ab: this._wec.getAbstract(50)
							}).then(v => {
								this._wec.clearDB();
							})
						}
					})
				}else{
					this.simpleHttp.post('router/admin/journals.json/update',{
						t:title,
						c:this.selectCategorys,
						co:content,
						ta:tags,
						ab:this._wec.getAbstract(50)
					}).then(v=>{
						console.log(v);
						this.router.navigate(['./journal/one',{n:title,f:'edit'}]);
					})
				}
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
	}
};