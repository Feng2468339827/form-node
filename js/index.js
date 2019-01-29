/**
 * @author  wyfeng
 * @version 1.1
 */

/**
 * [YFImgUpload 上传图片]
 * @param {[type]} name    [传入的选择器]
 * @param {[type]} options [description]
 */
function YFImgUpload(name,options){
	this.me = document.querySelector(name);
	//合并对象，Object.assign(被合并的目标,目标)
	Object.assign(window.YFImgUpload.Defaults.property, options);
	this.init();
}
/**
 * [Defaults 配置默认属性]
 * @type {Object}
 */
YFImgUpload.Defaults = {
	property:{
		//图片大小
		size: 1000,
		//是否可拖拽
		drop: true,
		//是否开启多图上传
		multiple: false,
		//是否开启遮罩层
		mask: true
	}
}
/**
 * [protoType 定义ImgUpload]
 * @type {Object}
 */
YFImgUpload.prototype = {
	/**
	 * [init 初始化]
	 * @return {[type]} [description]
	 */
	init:function(){
		console.log(this)
		//颜色变化
		// let color="#"+ Math.floor(Math.random()*16*16*16*16*16*16).toString(16)
		// document.body.style.color = color;
		//添加可访问
		this.mask.self=this;
		//生成图片
		this.me.innerHTML += `<img src="" alt="">`;
		this.clickInit();
	},
	/**
	 * [clickInit 监视点击和拖拽事件]
	 * @return {[type]} [description]
	 */
	clickInit:function(){
		var self = this;
		this.me.addEventListener('click',function(){
			self.createFileInput();
		})
		if(window.YFImgUpload.Defaults.drop){
			//监视拖拽事件
			this.me.addEventListener('drop',function(e){
				self.onDrop(e);
			});
			this.me.addEventListener('dragover',function(e){
				self.onDragover(e);
			});
		}
	},
	/**
	 * [createFileInput 创建文件上传]
	 * @return {[type]} [description]
	 */
	createFileInput:function(){
		var fileInput = this.fileInput;
		if(!fileInput){
			fileInput               = document.createElement("input");
			fileInput.type          = "file";
			fileInput.multiple      = window.YFImgUpload.Defaults.property.multiple;  //多图上传
			fileInput.style.display = "none";
			this.me.appendChild(fileInput);
			this.fileInput = fileInput;
		}
		fileInput.click();
		fileInput.onchange  = this.onchangeFileInput.bind(this);
	},
	/**
	 * [readerInit description]
	 * @param  {[files]} files [传入的文件]
	 * @return {[type]}       [description]
	 */
	readerInit:function(files){
		var reader = new FileReader();
		var self   = this;
		//多图上传
		if(window.YFImgUpload.Defaults.property.multiple == true){
			// console.log(files.files)
			// for(let File of files.files){
			// 	console.log(File);
			// }
		}
		//单图上传
		else{
			reader.readAsDataURL(files.files[0]);
			reader.name = files.files[0].name;
			//判断文件大小,单位是k
			var fileSize = files.files[0].size/1024;
			if(fileSize < window.YFImgUpload.Defaults.property.size){
				reader.onload = function(){
					//正则判断
					let filetype=/^data:image\/\w+;base64,/;
					if(filetype.test(this.result)){
						//打开遮罩层
						self.mask.init();
						//
						self.me.children[0].src=this.result;
						axios.post('/upload',{
							imgsrc:this.result,
							name:this.name,
							prevFileName:self.prevFileName
						},{
							//监视上传进度条
							onUploadProgress:function(e){
								let diff=e.loaded/e.total
								document.querySelector('.pregress-container>span:first-child').innerHTML = parseInt(diff*100)+'%'
								document.querySelector('.progress').style.width = parseInt(diff*100)+'%';
							}
						}).then((res)=>{
							self.prevFileName = res.data;
							//关闭遮罩层
							self.mask.remove();
							// setTimeout(function(){alert('上传成功')},500)
						});	
					}else{
						alert('请上传图片');
					}
				}
			}else{
				alert('上传大小不能超过2M')
			}
		}
	},
	/**
	 * [mask 进度条遮罩层]
	 * @type {Object}
	 */
	mask:{
		init:function(){
			this.self.me.innerHTML+=`
				<div class="masklayer">
					<div class="pregress-container">
						<span>0%</span>
						<span>/</span>
						<span>100%</span>
						<div class="progress">
						</div>
					</div>
				</div>
			`;
		},
		remove:function(){
			document.querySelector('.masklayer').remove();
		}
	},
	onchangeFileInput:function(){
		var fileInput = this.fileInput;
		this.readerInit(fileInput);
	},
	onDrop:function(e){
		//防止冒泡
		e.stopPropagation();
		//阻止浏览器默认行为
        e.preventDefault();
        var fileList = e.dataTransfer;
		this.readerInit(fileList);
	},
	onDragover:function(e){
		//防止冒泡
		e.stopPropagation();
		//阻止浏览器默认行为
        e.preventDefault();
	}
}