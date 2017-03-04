var mongoose=require('mongoose');
var Schema=mongoose.Schema;
mongoose.connect('mongodb://localhost:4000/test',{user:'journalBase',pass:'JeazJournal'});
var mySchema=new Schema({
	title:String,
	abstract:{type:String,default:'no abstract'},
	content:String,
	tags:Array,
	category:String,
	date:{type:Date,default:Date()},
	lastModify:Date,
	notes:{type:Array,default:[]},
	notesCount:{type:Number,default:0},
	version:{type:Number,default:0},
	visitCount:{type:Number,default:0}
}),
	userSchema=new Schema({
	name:String,
	category:Object,
	tags:Array,
	photoCategory:Array
}),
	photosSchema=new Schema({
	_id:{type:Schema.Types.ObjectId},
	name:String,
	date:{type:Date,default:Date()},
	introduction:String,
	category:{type:String,default:'default'}
});

mySchema.statics.findPage=function(opt,gather){
	let query,condi=opt.addon,
		limitQuery={_id:0,title:1,content:1,data:1};
	if(condi=='all'){
		query={};
	}else{
		if(gather=='categorys'){
			query={category:condi};
		}else if(gather =='tags'){
			query={tags:condi};
		}else{
			Promise.resolve('');return;
		}
	}
	return new Promise((resolve,reject)=>{
		if(Number(opt.totalSize)===-1){
			this.count(query).then(count=>{
				let skipCount=count-(+opt.pageSize);
				skipCount=skipCount<0?0:skipCount;
				this.find(query,{_id:0,notes:0,content:0}).skip(skipCount).limit(+opt.pageSize).exec((err,data)=>{					
					if(!data||!data[0]){resolve('');return};
					let data2={};
					data2.data=data;
					data2.count=count;
					resolve(data2);
				})
			})
		}else if(Number(opt.totalSize)>0){
			this.find(query,{_id:0,notes:0,content:0}).skip(+opt.start).limit(+opt.pageSize).then(data=>{
				if(!data||!data[0]){resolve('');return};
				let data2={};
				data2.data=data;
				data2.count=opt.totalSize;
				resolve(data2);
			})
		}else{
			resolve('Not found')
		}
	})
	
}
mySchema.statics.titleExist=function(query){
	return new Promise((resolve,reject)=>{
		this.findOne({title:query},{_id:0,title:1}).then(data=>{
			data!=null?resolve(1):resolve(0);
		})
	})
};
mySchema.statics.getOneAllNotes=function(query,obj){
	return new Promise(resolve=>{
		this.findOne({title:query},{notes:{$slice:[obj.skip,obj.size]},_id:0,notesCount:1}).then(data=>{
			data?resolve(data):resolve('');
		})
	})
}
mySchema.statics.appendNotes=function(query,obj){
	obj.date=new Date();
	return new Promise(resolve=>{
		this.update({title:query},{$push:{notes:obj},$inc:{notesCount:1}}).then(v=>{
			v?resolve('true'):resolve('');
		})
	})
};
//journal
var journalCo=mongoose.model('journals',mySchema);

//users
userSchema.statics.getCategorys=function(login){
	return new Promise((resolve,reject)=>{
		this.findOne({name:'admin'},{'category':1,_id:0}).then(categorys=>{
			categorys!=null?resolve({d:categorys['category'],l:login}):resolve('');
		})
	})
}
userSchema.statics.deleteCategory=function(key){
	let obj={};
	obj['category.'+key]=1;
	return new Promise((resolve,reject)=>{
		this.update({name:'admin'},{$unset:obj}).then(v=>{
			v!=null?resolve(v):resolve('');
		})
	})
}
userSchema.statics.appendCategory=function(item){
	let obj={};
	obj['category.'+item]=0;
	return new Promise((resolve,reject)=>{
		this.update({name:'admin'},{$set:obj}).then(v=>{
			v!=null?resolve(v):resolve('');
		})
	})
}
userSchema.statics.searchTags=function(item){
	return new Promise((resolve,reject)=>{
		this.findOne({'tags.name':eval('/^'+item+'/')},{'tags.$':1,_id:0}).then(v=>{
			v!=null?resolve(v.tags[0].name):resolve('');
		})
	})
}
userSchema.statics.findTag=function(tagName,fn){
	this.findOne({'tags.name':tagName},{'_id':1},(err,data)=>{
		fn(data);
	})
}
userSchema.statics.appendTag=function(tagName,fn){
	this.update({'name':'admin'},{$addToSet:{tags:{name:tagName,count:1}}},{writeConnern:{w:0}},fn)
}
userSchema.statics.incTag=function(tagName,num,fn){
	this.update({'tags.name':tagName},{$inc:{'tags.$.count':num}},{writeConnern:{w:0}},fn)
}
userSchema.statics.getAllTags=function(){
	return new Promise(resolve=>{
		this.findOne({name:'admin'},{_id:0,tags:1},function(err,data){
			err?resolve(''):resolve(data);
		})
	})
}

var userCo=mongoose.model('users',userSchema);

Array.prototype.AsyncForEach=function(fn,endFn){
	this.length?fn(this[0],()=>{this.slice(1).AsyncForEach(fn,endFn)}):endFn();
};

exports.dealJournal=function(obj,condit){
	let obj2={
		title:obj.t,
		category:obj.c,
		content:obj.co,
		tags:obj.ta,
		abstract:obj.ab
	}
	if(condit){
		return new Promise((resolve)=>{
			(new journalCo(obj2)).save(v=>{
				dealCategory(()=>{
					dealTag(()=>{
						resolve('');
					})
				})
			})
		});
	}else{
		return new Promise(resolve=>{ 
			journalCo.update({title:obj.t},{$set:obj2,$currentDate:{lastModify:true},$inc:{version:1}}).then(v=>{
				if(v){
					dealCategory(()=>{
						dealTag(()=>{
							resolve('');
						})
					})
				}else{
					resolve('false');
				}
			})
		})
	}
	function dealCategory(fn){
		let obj={};
		obj['category.'+obj2.category]=1;
		userCo.update({name:'admin'},{$inc:obj},(err,data)=>{
			fn(data);
		})
	}
	function dealTag(fn){
		if(obj2.tags&&obj2.tags[0]){
			obj2.tags.AsyncForEach(
				(tag,next)=>{
					userCo.findTag(tag,(data)=>{
						if(data){
							userCo.incTag(tag,1,()=>{next()});
						}else{
							userCo.appendTag(tag,()=>{next()});
						}
					})
				},
				()=>{
					userCo.update({name:'admin'},{$push:{tags:{$each:[],$sort:{count:1}}}}).then(v=>{
						fn();
					});
				}
			);
		}else{
			fn();
		}
	}

}

//photosCo:


var photosCo=mongoose.model('photos',photosSchema);

exports.photosColle=photosCo;
exports.journalColle=journalCo;
exports.userColle=userCo;