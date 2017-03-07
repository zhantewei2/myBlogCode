const send=require('koa-send');
const fs=require('fs')
const pathUt=require('path');
const staticCache=require('koa-static-cache');
module.exports=function(app,path,dirname=''){
	app.use(async(ctx,next)=>{
		ctx.set('Content-Encoding','gzip');
		await next();
	})
	app.use(staticCache(
		pathUt.join(dirname,path),
		{
		/*	maxAge:604800, */
			buffer:true
		}
	));
	return async(ctx,body)=>{
		let abPath=pathUt.join(dirname,path+ctx.path);
		await send(ctx,path+'/index.html',{root:dirname});
		/*
		let fileExist=await function(){
			return new Promise((resolve,reject)=>{
				fs.access(abPath,err=>{
					if(!!err||ctx.path==='/'){
						resolve(false);
					}else{	
						resolve(true);
					}
				})
			})
		}();
		if(fileExist){
			await send(ctx,path+ctx.path,{root:dirname});
		}else{
			await send(ctx,path+'/index.html',{root:dirname});
		}
		*/
	}
}