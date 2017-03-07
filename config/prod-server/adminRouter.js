module.exports=function(mongoose){
	var journalColle=mongoose.journalColle;
	var userColle=mongoose.userColle;
	var Router=require('koa-router');
	var router=new Router();
	router.use(async(ctx,next)=>{
		if(ctx.session.login/* &&ctx.get('X-XSRF-TOKEN')=='myKey' */){
			await next();
		}else{
			ctx.response.status=500;
		}
	})
	router.post('/journals.json/titleExist',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await journalColle.titleExist(obj.q);
	});
	router.post('/journals.json/insert',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await mongoose.dealJournal(obj,true);
	});
	router.post('/journals.json/update',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await mongoose.dealJournal(obj,false);
	})
	router.post('/journals.json/del',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await new Promise(resolve=>{
			journalColle.remove({title:obj.t}).then(v=>{
				if(!v) return resolve('');
				let cObj={};
				cObj['category.'+obj.c]=-1;
				userColle.update({},{$set:{tags:obj.d},$inc:cObj}).then(v=>{
					!v?resolve(''):resolve(1);
				})
			})	
		})
		
	})
	router.get('/categorys.json',async(ctx)=>{
		ctx.body=await userColle.getCategorys();
	});
	router.put('/categorys.json',async(ctx)=>{
		let obj=ctx.request.body;
		if(obj.m=='delete'){
			ctx.body=await userColle.deleteCategory(obj.q);
		}else if(obj.m=='append'){
			ctx.body=await userColle.appendCategory(obj.q);
		}
	});
	router.post('/tags.json/search',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await userColle.searchTags(ctx.request.body.q);
	});
	return router;
}