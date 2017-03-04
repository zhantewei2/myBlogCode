module.exports=function(mongoose,app){
	var fs=require('fs');
		Router=require('koa-router'),
		photoRouter=new Router(),
		adminRouter=new Router(),
		photosColle=mongoose.photosColle,
		userColle=mongoose.userColle,
		mongoose0=require('mongoose'),
		path=require('path');
		
	photoRouter.use(async(ctx,next)=>{
		await next();
	});
	photoRouter.post('/rootLoad',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await new Promise(resolve=>{
			userColle.findOne({name:'admin'},{_id:0,photoCategory:1}).then(v=>{
				!v?resolve(''):resolve(v);
			})
		})
	})
	photoRouter.post('/one/find',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await new Promise(resolve=>{
			photosColle.find({category:obj.q}).skip(obj.d.skip).limit(obj.d.size).then(data=>{
				!data?resolve(''):resolve(data);
			})
		})
	})

	//adminRouter:
	adminRouter.use(async(ctx,next)=>{
		if(!ctx.session.login)return;
		await next();
	})

	adminRouter.post('/upload',async(ctx)=>{
		let name=ctx.request.query.name;
		if(!name||!ctx.request.accepts('text/event-stream'))return;
		let introduction=decodeURIComponent(ctx.request.query.itd),
			ws,
			_id=new mongoose0.Types.ObjectId,
			category=ctx.request.query.category;
		ctx.body=await new Promise(resolve=>{(new photosColle({_id:_id,name:name,introduction:introduction,category:category})).save(()=>{
			ws=fs.createWriteStream(path.join(__dirname,'public/photos','/')+_id);
			ctx.req.pipe(ws);
			userColle.update({'photoCategory.name':category},{$inc:{'photoCategory.$.count':1}}).then(v=>{
					!v?resolve(''):resolve(1);
				})
			})
		})
	});
	adminRouter.post('/appendAlbum',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await new Promise(resolve=>{
			userColle.update({name:'admin'},{$addToSet:{photoCategory:{name:obj.n,count:0}}}).then(v=>{
				!v?resolve(''):resolve(1);
			})
		})
	})
	adminRouter.post('/delPhoto',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await new Promise(resolve=>{
			photosColle.remove({_id:obj.id}).then(v=>{
				if(!v)return;
				userColle.update({'photoCategory.name':obj.c},{$inc:{'photoCategory.$.count':-1}}).then(v=>{
					!v?resolve(''):resolve(1);
				})
			})
		})
	});
	adminRouter.post('/updatePhoto',async(ctx)=>{
		let obj=ctx.request.body,obj2;
		if(!obj||!obj.b)return;
		obj2=obj.b.itd?{name:obj.b.name,introduction:obj.b.itd}:{name:obj.b.name};
		ctx.body=await new Promise(resolve=>{
			photosColle.update({_id:obj.q},{$set:obj2}).then(v=>{
				!v?resolve(''):resolve(1);
			})
		})
	});
	adminRouter.post('/setCover',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await new Promise(resolve=>{
			userColle.update({'photoCategory.name':obj.q},{'photoCategory.$.main':obj.d}).then(v=>{
				!v?resolve(''):resolve(1);
			})
		})        

	});
	adminRouter.post('/delAlbum',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await new Promise(resolve=>{
			photosColle.remove({category:obj.q}).then(v=>{
				if(!v)return resolve('');
				userColle.update({},{$pull:{photoCategory:{name:obj.q}}}).then(v=>{
					!v?resolve(''):resolve(1);
				})
			})
		})
	})
	photoRouter.use('/admin',adminRouter.routes());
	return photoRouter;
}