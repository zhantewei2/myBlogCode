module.exports=function(mongoose){
	let colle=mongoose.userColle;
	var Router=require('koa-router');
	var router=new Router();
	router.post('/login',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		let obj2={name:obj.a,pswd:obj.p};
		ctx.body=await new Promise((resolve,reject)=>{
			colle.findOne(obj2,{_id:1}).then(v=>{
				if(v!=null){
					resolve('1');
					ctx.session.login=true;
				}else{
					resolve('0');
				}
			})
		})
	})
	router.post('/logout',async(ctx)=>{
		ctx.session=null;
		ctx.body='1';
	})
	return router;
}