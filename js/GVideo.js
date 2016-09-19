(function(){
	var GV={
		_elementId:"",
		//初始方法,用divid赋值
		init:function(elementId){
			this._elementId=elementId;
			_this=this;
			this.loadScripts(["js/jquery-1.11.3.min.js"],function(){
				_this.loadSucc();
			});
		},
		loadScripts:function(arr,fun){
			var res;
			if((arr.constructor)==String)
			{
				res=[];
				res.push(arr);
			}
			else{
				res=arr;
			}
			_this=this;
			queue=function(re,cb){
				_this.loadScript(re.shift(),function(){
					re.length>0?queue(re,cb):cb();
				})
			};
			queue(res,fun);
			
		},
		loadScript:function(src,callback){
			var readyState = false;
			var script=document.createElement("script");
			script.src=src;
			script.onload = script.onreadystatechange = function () {
				if (!readyState && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
					readyState = true;
					callback && callback();
				}
			};
			document.body.appendChild(script);
		},
		loadSucc:function(){
			UI.init();
		},
	}
	var UI={
		video:"",
		pauseBtn:"",
		playBtn:"",
		progressBar:"",
		progressBarBg:"",
		progressBarDIV:"",
		progressBarLoad:"",
		mainDiv:"",
		bgControl:"",
		message:"",
		_this:"",
		timeTxt:"",
		totalTime:"",
		
		init:function(){
			this.mainDiv=document.getElementById(GV._elementId);
			this.mainDiv.style.backgroundColor="black";
			this.video=document.createElement("video");
			this.video.style.height="100%";
			this.video.style.width="100%";
			
			this.bgControl=document.createElement("div");
			this.bgControl.style.height="25px";
			this.bgControl.style.width="100%";
//			this.bgControl.style.margin="0px 0px";
//			this.bgControl.style.left="2.5%"
//			this.bgControl.borderColor="#000000";
//			this.bgControl.style.border="0.1px solid #000000";
//			this.bgControl.style.borderColor="";
			
			this.bgControl.style.backgroundColor="#ffffff";
//			this.bgControl.style.borderRadius="5px"
			this.bgControl.style.position="relative";
			this.bgControl.style.bottom="25px";
//			this.bgControl.cssText=".bg{height:60px,width:90%,margin:0px}"
			this.pauseBtn=document.createElement("div");
			this.pauseBtn.style.backgroundImage="url(img/pause.png)";
			this.pauseBtn.style.backgroundRepeat="no-repeat";
			this.pauseBtn.style.backgroundPositionX="0px";
			this.pauseBtn.style.backgroundPositionY="0px";
			this.pauseBtn.style.width="26px";
			this.pauseBtn.style.height="35px";
			this.pauseBtn.style.position="relative";
			this.pauseBtn.style.top="-3px";
			this.pauseBtn.style.left="5px";
			this.pauseBtn.style.display="none";
			this.playBtn=document.createElement("div");
			this.playBtn.style.backgroundImage="url(img/play.png)";
			this.playBtn.style.backgroundRepeat="no-repeat";
			this.playBtn.style.backgroundPositionX="0px";
			this.playBtn.style.backgroundPositionY="0px";
			this.playBtn.style.width="26px";
			this.playBtn.style.height="35px";
			this.playBtn.style.position="relative";
			this.playBtn.style.top="-3px";
			this.playBtn.style.left="5px";
			
			this.progressBarDIV=document.createElement("div");
			this.progressBarDIV.style.width="80%";
			this.progressBarDIV.style.height="100%";
			this.progressBarDIV.style.position="absolute";
			this.progressBarDIV.style.left="31px";
			this.progressBarDIV.style.top="0px";
			
			this.progressBar=document.createElement("div");
			this.progressBarBg=document.createElement("div");
			this.progressBarLoad=document.createElement("div");
			this.progressBarBg.style.width="100%";
			this.progressBarBg.style.height="50%";
			this.progressBarBg.style.position="absolute";
			this.progressBarBg.style.left="0px";
			this.progressBarBg.style.top="25%";
			this.progressBarBg.style.borderRadius="4px";
			this.progressBarBg.style.backgroundColor="#cccccc";
			
			this.progressBarLoad.style.width="0%";
			this.progressBarLoad.style.height="50%";
			this.progressBarLoad.style.position="absolute";
			this.progressBarLoad.style.left="0px";
			this.progressBarLoad.style.top="25%";
			this.progressBarLoad.style.borderRadius="4px";
			this.progressBarLoad.style.backgroundColor="#33ccff";
			
			this.progressBar.style.width="0%";
			this.progressBar.style.height="50%";
			this.progressBar.style.position="absolute";
			this.progressBar.style.left="0px";
			this.progressBar.style.top="25%";
			this.progressBar.style.borderRadius="4px";
			this.progressBar.style.backgroundColor="#FFcc33";
			
			this.message=document.createElement("div");
			this.message.style.width="100%";
			this.message.style.height="20px";
			this.message.style.position="absolute";
			this.message.style.left="0px";
			this.message.style.top="0px";
//			this.message.style.backgroundColor="#FFcc33";
			this.message.style.color=("#ffffff");
			this.message.style.size="12px";
			
			
			this.timeTxt=document.createElement("div");
			this.timeTxt.style.width="10%";
			this.timeTxt.style.height="25px";
			this.timeTxt.style.position="absolute";
//			this.timeTxt.style.float="left";
			this.timeTxt.style.left="85%";
			this.timeTxt.style.lineHeight="25px";
			this.timeTxt.style.center="true";
			this.timeTxt.style.top="0px";
//			this.message.style.backgroundColor="#FFcc33";
			this.timeTxt.style.color=("#000000");
			this.timeTxt.style.size="10ft";
			this.timeTxt.innerHTML="00:00/00:00";
//			this.pauseBtn.cssText=".pauseBtn{"
//								+"background: url(../img/assets.png);"
//								+"background-position-x: 16px;"
//								+"background-position-y: 0px;"
//								+"}"
			this.mainDiv.appendChild(this.video);
			this.mainDiv.appendChild(this.message);
			this.mainDiv.appendChild(this.bgControl);
			this.bgControl.appendChild(this.pauseBtn)
			this.bgControl.appendChild(this.playBtn)
			this.bgControl.appendChild(this.progressBarDIV)
			this.bgControl.appendChild(this.timeTxt)
			this.progressBarDIV.appendChild(this.progressBarBg)
			this.progressBarDIV.appendChild(this.progressBarLoad)
			this.progressBarDIV.appendChild(this.progressBar)
			this.video.addEventListener('loadedmetadata',this.metadataFun,false);
			stream.init();
			_this=this;
		},
		play:function(){
			stream.play();
			_this.playBtn.style.display="none";
			UI.pauseBtn.style.display="block";
		},
		pause:function(){
			stream.pause();
			_this.playBtn.style.display="block";
			UI.pauseBtn.style.display="none";
		},
		addEvent:function(){
			this.playBtn.addEventListener("click",this.play);
			this.video.addEventListener("timeupdate",this.timeupdate)
			this.pauseBtn.addEventListener("click",this.pause)
			this.video.addEventListener('error',this.errorFun,false);
		    this.video.addEventListener('play',this.playFun,false);
		    
		    this.video.addEventListener('timeupdate',this.timeUpFun,false)
		    this.video.addEventListener('ended',this.endFun,false)
		    this.video.addEventListener('progress',this.progress,false)
		    this.progressBarBg.addEventListener("click",this.seek);
		},
		seek:function(e){
			var time="";
			time=(e.pageX-(_this.progressBarBg.getBoundingClientRect().left))/_this.progressBarBg.offsetWidth*_this.video.duration;
			stream.seek(time);
		},
		timeupdate:function(){
			
			console.log(UI.video.buffered.end(0),UI.video.buffered.start(0))
//			UI.progressBarLoad.style.width=((UI.video.buffered.start(0)+UI.video.buffered.end(0))/UI.video.duration)*100+"%";
			UI.progressBar.style.width=(UI.video.currentTime/UI.video.duration)*100+"%";
			
			var time="";
			if(_this.video.currentTime/60>=10)
			{
				time=parseInt(_this.video.currentTime/60)+":";
			}
			else
			{
				time="0"+parseInt(_this.video.currentTime/60)+":";
			}
			
			if(_this.video.currentTime%60>=10)
			{
				time+=parseInt(_this.video.currentTime%60);
			}
			else
			{
				time+="0"+parseInt(_this.video.currentTime%60);
			}
			_this.timeTxt.innerHTML=time+"/"+totalTime;
		},
		progress:function(){
			
		},
		endFun:function(){
			UI.showTip(true,'播放结束');
			_this.playBtn.style.display="block";
			UI.pauseBtn.style.display="none";
		},
		metadataFun:function(){
			_this.addEvent();
			if(_this.video.duration/60>=10)
			{
				
				totalTime=parseInt(_this.video.duration/60)+":";
			}
			else
			{
				totalTime="0"+parseInt(_this.video.duration/60)+":";
			}
			
			if(_this.video.duration%60>=10)
			{
				totalTime+=parseInt(_this.video.duration%60);
			}
			else
			{
				totalTime+="0"+parseInt(_this.video.duration%60);
			}
	    		_this.timeTxt.innerHTML="00:00/"+totalTime;
		},
		playFun:function(){
			UI.showTip(false)
		},
		errorFun:function(){
			UI.showTip(true,'出错');
		},
		showTip:function(b,m){
			if(b)
			{
				this.message.innerHTML=m;
			}
			else{
				this.message.innerHTML="";
			}
		}
	}
	//详细的流处理
	var stream={
		init:function(){
			UI.video.src="http://vod.chvoice.com/video/8.mp4";
			UI.addEvent();
		},
		play:function(){
			UI.video.play();
		},
		pause:function(){
			UI.video.pause();
		},
		seek:function(time){
			UI.video.currentTime=(time);
		}
	}
	window.GV=GV;
})(window)
