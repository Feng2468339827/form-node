function createFileInput(){
	var fileInput = this.fileInput;
	if(!fileInput){
		fileInput=document.createElement("input");
		fileInput.type="file";
		// fileInput.multiple = true; 多图上传
		fileInput.style.display="none";
		document.querySelector('.imgcontainer').appendChild(fileInput);
		this.fileInput = fileInput;
	}
	fileInput.click();
	fileInput.onchange  = this.onchangeFileInput.bind(this);
}
function onchangeFileInput(){
	var reader = new FileReader(),
		fileInput = this.fileInput;
	reader.readAsDataURL(fileInput.files[0]);
	//获得图片名
	reader.name = fileInput.files[0].name;
	reader.onload=function(){
		//正则判断
		let filetype=/^data:image\/\w+;base64,/;
		//判断是图片类型才能上传
		document.querySelector('.masklayer').classList.remove('hidden');
		if(filetype.test(this.result)){
			document.querySelector('.imgcontainer>img').src=this.result;
			//上传图片的base64
			axios.post('/upload',{
				imgsrc:this.result,
				name:this.name
			},{
				//允许在上传过程中的做一些操作
				onUploadProgress:function(e){
					console.log(e)
					let diff=e.loaded/e.total
					document.querySelector('.pregress-container>span:first-child').innerHTML=parseInt(diff*100)+'%'
					document.querySelector('.progress').style.width=parseInt(diff*100)+'%';
				}
			}).then((res)=>{
				console.log(res)
				document.querySelector('.masklayer').classList.add('hidden');
				if(res.data!=''){
					alert('上传成功！')
					document.querySelector('.pregress-container>span:first-child').innerHTML=0+'%'
					document.querySelector('.progress').style.width=0+'%';
				}
			})
		}
		else{
			alert('请上传图片')
		}
	}
}