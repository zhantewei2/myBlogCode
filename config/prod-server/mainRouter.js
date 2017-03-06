var verify=require('./verify.js'),
	myVerify=new verify(),
	router=new require('koa-router')();
module.exports=function(myMongoose){
	router.post('/journals.json/categorys',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await myMongoose.journalColle.findPage(obj,'categorys');
	})
	router.post('/journals.json/tags',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await myMongoose.journalColle.findPage(obj,'tags');
	})
	router.post('/journals.json/one',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await new Promise(resolve=>{
			myMongoose.journalColle.findOneAndUpdate({title:obj.id},{$inc:{visitCount:1}},{projection:{_id:0},returnNewDocument:true}).then(v=>{
				v?resolve(v):resolve('')
			})
		})
	});
	router.post('/journals.json/one/notes',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await myMongoose.journalColle.getOneAllNotes(obj.q,obj.d);
	});
	router.post('/journals.json/one/notes/append',async(ctx)=>{
		console.log('post')
		let obj=ctx.request.body;
		if(!obj)return;
		if(obj.v!=ctx.session.verify)return;
		ctx.body=await myMongoose.journalColle.appendNotes(obj.q,obj.d);
	});
	router.post('/journals.json/one/part',async(ctx)=>{
		let obj=ctx.request.body;
		if(!obj)return;
		ctx.body=await new Promise(resolve=>{
			myMongoose.journalColle.findOne({title:obj.id},{_id:0,version:1,notesCount:1,visitCount:1,date:1}).then(v=>{
				v?resolve(v):resolve('');
			})
		})
	})
	router.post('/journals.json/one/notes/verify',async(ctx)=>{
		let verifyStr=myVerify.genVerify();
		ctx.session.verify=verifyStr.toLowerCase();
		let bb=myVerify.encrypt(verifyStr,'love');
		ctx.body=bb;
	})

	router.post('/tags.json',async(ctx)=>{
		ctx.body=await myMongoose.userColle.getAllTags();
	})
	router.get('/categorys.json',async(ctx)=>{
		ctx.body=await myMongoose.userColle.getCategorys(ctx.session.login);
	});
	return router;
}