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

//bodyParser配置
app.use(bodyParser({
    formLimit:"5mb",
    jsonLimit:"5mb",
    textLimit:"5mb",
    enableTypes: ['json', 'form', 'text']
}));

//接收前台发来的数据
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
    //传入上一张图片文件名
    let fileName=ctx.request.body.filename;
    //传入第二张图片时将上一张图片删除
    if(fileName!=undefined){
        fs.unlink('../images/'+fileName, (err) =>{
            if(err) throw err;
            console.log('删除成功！')
        })
    }
    else{
        console.log('第一次上传')
    }
});

app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');