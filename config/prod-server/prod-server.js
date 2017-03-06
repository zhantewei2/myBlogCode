module.exports=function(){
var koa=require('koa'),
	Router=require('koa-router'),
	mount=require('koa-mount'),
	send=require('koa-send'),
	convert=require('koa-convert'),
	frontEndComponent=require('./angularProxy.js'),
	path=require('path'),
	session=require('koa-session'),
	bodyParser=require('koa-bodyParser'),
	serve=require('koa-static');
var app=new koa();
var myMongoose=require('./mongoose.js');

app.keys=['myKey'];
app.use(bodyParser());
app.use(convert(session({
	key:'ztwKey'	
},app)));
app.use(mount('/public',convert(serve(path.join(__dirname,'public'),{
	maxage:604800
}))))

app.use(async(ctx,next)=>{
	/* for dev
	ctx.response.set('Access-Control-Allow-Origin','http://localhost:3000');
	ctx.response.set('Access-Control-Allow-Methods','POST,DELETE,PUT');
	ctx.response.set('Access-Control-Allow-Headers','Content-Type');
	ctx.response.set('Access-Control-Allow-Credentials','true');
	ctx.cookies.set('XSRF-TOKEN','myKey',{httpOnly:false});
	*/
	await next();
})
var	router=require('./mainRouter.js')(myMongoose),
	rootRouter=require('./rootRouter.js')(myMongoose),
	adminRouter=require('./adminRouter.js')(myMongoose),
	photoRouter=require('./photoRouter.js')(myMongoose,app);

router.use('/admin',adminRouter.routes());
router.use('/photos',photoRouter.routes());
app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());
app.use(mount('/router',router.routes()));
app.use(frontEndComponent(app,'dest.gzip',path.join(__dirname,'../../')));
app.listen(3001);
}
