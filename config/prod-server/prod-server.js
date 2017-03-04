module.exports=function(){
var koa=require('koa'),
	Router=require('koa-router'),
	mount=require('koa-mount'),
	send=require('koa-send'),
	convert=require('koa-convert'),
	frontEndComponent=require('./angularProxy.js'),
	staticCache=require('koa-static-cache');
	path=require('path'),
	session=require('koa-session'),
	bodyParser=require('koa-bodyParser'),
	serve=require('koa-static');
var app=new koa(),
	router=new Router();

var rooter=function(...args){
	return path.join(__dirname,...args);
};
var myMongoose=require('./mongoose.js');
var verify=require('./verify.js'),
	myVerify=new verify();
app.keys=['myKey'];
app.use(bodyParser());
app.use(convert(session({
	key:'ztwKey'	
},app)));
app.use(async(ctx,next)=>{
	ctx.response.set('Access-Control-Allow-Origin','http://localhost:3000');
	ctx.response.set('Access-Control-Allow-Methods','POST,DELETE,PUT');
	ctx.response.set('Access-Control-Allow-Headers','Content-Type');
	ctx.response.set('Access-Control-Allow-Credentials','true');
	await next();
})
app.use(
	mount('/public',convert(serve(path.join(__dirname,'public'),{
		maxage:60*60*1000*24 })
	))
)
var rootRouter=require('./rootRouter.js')(myMongoose),
	adminRouter=require('./adminRouter.js')(myMongoose),
	photoRouter=require('./photoRouter.js')(myMongoose,app);
router.use('/admin',adminRouter.routes());
router.use('/photos',photoRouter.routes());
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
	let bb=myVerify.encrypt(verifyStr,'ztwk');
	ctx.body=bb;
})

router.post('/tags.json',async(ctx)=>{
	ctx.body=await myMongoose.userColle.getAllTags();
})
router.get('/categorys.json',async(ctx)=>{
	ctx.body=await myMongoose.userColle.getCategorys(ctx.session.login);
})

app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());
app.use(mount('/router',router.routes()));
app.use(frontEndComponent('dest',path.join(__dirname,'../../')));
app.listen(3001);
}
