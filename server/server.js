const Koa        = require('koa');

const app        = new Koa();

const router     = require('koa-router')();

const bodyParser = require('koa-bodyparser');

const static     =require('koa-static');

const fs         =require('fs');

const path       =require('path');

const staticPath ='../';
// __dirname总是指向被执行 js 文件的绝对路径
app.use(static(
	path.join( __dirname, staticPath)
))

app.use(bodyParser());

router.post('/upload',async(ctx,next)=>{
	//传入base64
	let imgsrc = ctx.request.body.imgsrc;
	//传入文件名称
    let journalFileName=ctx.request.body.name
	//过滤data:URL
    var base64Data = imgsrc.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = Buffer.from(base64Data, 'base64');
    //写入文件
    const write=function(){
        var wri=fs.createWriteStream('../images/' + journalFileName)
        return new Promise((resolve,reject)=>{
            wri.write(dataBuffer);
            wri.end();
            wri.on('finish',function(){
                resolve(journalFileName)
            })
            wri.on('error',function(){
                reject(0)
            })
        })
    }
    let result;
    result=await write();
    ctx.body=result;
});

app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');
