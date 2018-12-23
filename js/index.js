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
		if(filetype.test(this.result)){
			document.querySelector('.imgcontainer>img').src=this.result;
			//上传图片的base64
			axios.post('/upload',{
				imgsrc:this.result,
				name:this.name
			}).then((res)=>{
				console.log(res)
				if(res.data!=''){
					alert('上传成功！')
				}
			})
		}
		else{
			alert('请上传图片')
		}
	}
}