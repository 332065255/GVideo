(function(){
	var GV={
		_elementId:"",
		//初始方法,用divid赋值
		init:function(elementId){
			this._elementId=elementId;
			_this=this;
			this.loadScripts(["js/jquery-3.1.0.min.js"],function(){
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
		timeOut:-1,
		soundBtn:"",
		unsoundBtn:"",
		soundPanel:"",
		soundBg:"",
		soundBar:"",
		soundNum:"",
		soundHideTime:"",
		columeNum:1,
		fullBtn:"",
		isFull:false,
		init:function(){
			_this=this;
			
			this.importCss();
			this.mainDiv=document.getElementById(GV._elementId);
			this.mainDiv.innerHTML=this.getDivHtml();
			this.playBtn=$(".playBtn")[0];
			this.pauseBtn=$(".pauseBtn")[0];
			this.video=$(".gvideo")[0];
			this.progressBarBg=$(".progressBg")[0];
			this.timeTxt=$(".timeTxt")[0];
			this.message=$(".messageTxt")[0];
			this.progressBar=$(".progressPlay")[0];
			this.soundBtn=$(".sound")[0];
			this.unsoundBtn=$(".unsound")[0];
			this.soundPanel=$(".soundPanel")[0];
			this.soundBg=$(".soundBg")[0];
			this.soundBar=$(".soundBar")[0];
			this.soundNum=$(".soundNum")[0];
			this.fullBtn=$(".fullBtn")[0];
			
			this.video.addEventListener('loadedmetadata',this.metadataFun,false);
			stream.init();
		},
		getDivHtml:function(){
			return "<div class='videoDiv' id='videoDiv'>"
					+" <video class='gvideo'></video>"
					+" <div class='videoControl'>"
					+"    <div class='playBtn'></div>"
					+"    <div class='pauseBtn'></div>"
					+"    <div class='progressDiv'>"
					+"       <div class='progressBg'></div>"
					+"       <div class='progressLoad'></div>"
					+"       <div class='progressPlay'></div>"
					+"    </div>"
					+"    <div class='settingDiv'>"
					+"    		<div class='timeTxt'>00:00/00:00</div>"
					+"          <div class='sound'></div>"
					+"          <div class='unsound'></div>"
					+"          <div class='soundPanel'>"
					+"				<div class='soundNum'>100</div>"
					+"          		<div class='soundBg'></div>"
					+"              <div class='soundBar'></div>"
					+"          </div>"
					+"          <div class='fullBtn'></div>"
					+"    </div>"
					+"    <div class='playBigBtn'></div>"
					+" </div>"
					+"<div class='messageTxt'>加载中...</div>"
					+"</div>"
					
		},
		importCss:function(){
			var links=document.createElement("link");
			links.href="css/gv.css";
			links.rel="stylesheet";
			document.head.appendChild(links);
		},
		play:function(){
			stream.play();
			_this.playBtn.style.display="none";
			UI.pauseBtn.style.display="block";
			$(".playBigBtn")[0].style.display="none"
		},
		pause:function(){
			stream.pause();
			_this.playBtn.style.display="block";
			UI.pauseBtn.style.display="none";
			$(".playBigBtn")[0].style.display="block"
		},
		addEvent:function(){
			this.playBtn.addEventListener("click",this.play);
			this.video.addEventListener("timeupdate",this.timeupdate)
			this.pauseBtn.addEventListener("click",this.pause)
			this.video.addEventListener('error',this.errorFun,false);
		    this.video.addEventListener('play',this.playFun,false);
		    $(".playBigBtn")[0].addEventListener("click",this.play);
		    this.video.addEventListener('timeupdate',this.timeUpFun,false)
		    this.video.addEventListener('ended',this.endFun,false)
		    this.video.addEventListener('progress',this.progress,false)
		    this.progressBarBg.addEventListener("click",this.seek);
		    this.progressBar.addEventListener("click",this.seek);
		    this.soundBtn.addEventListener("mouseover",this.soundPs);
		    this.unsoundBtn.addEventListener("mouseover",this.soundPs);
		    this.soundPanel.addEventListener("mouseover",this.soundPs);
		    this.soundBtn.addEventListener("mouseout",this.soundPh);
		    this.unsoundBtn.addEventListener("mouseout",this.soundPh);
		    this.soundPanel.addEventListener("mouseout",this.soundPh);
		    this.soundBg.addEventListener('click',this.getVolumeNum);
		    this.soundBar.addEventListener('click',this.getVolumeNum);
		    this.soundBtn.addEventListener('click',this.closeSound);
		    this.unsoundBtn.addEventListener('click',this.openSound);
		    this.fullBtn.addEventListener('click',this.goFullScreen);
		},
		goFullScreen:function(){
			if(!_this.isFull)
			$("#videoDiv")[0].className="fullScreen";
			else
			$("#videoDiv")[0].className="videoDiv";
			_this.isFull=!_this.isFull;
			
		},
		closeSound:function(e){
			var _volnum=_this.columeNum;
			_this.setVolume(0);
			_this.columeNum=_volnum;
			_this.soundBtn.style.display='none';
			_this.unsoundBtn.style.display='block';
		},
		openSound:function(e){
			_this.setVolume(_this.columeNum);
			_this.soundBtn.style.display='block';
			_this.unsoundBtn.style.display='none';
		},
		//根据鼠标点计算音量
		getVolumeNum:function(e){
			console.log($(".soundBg").offset().top);
			_this.setVolume((_this.soundBg.offsetHeight-(e.pageY-$(".soundBg").offset().top))/_this.soundBg.offsetHeight)
		},
		soundPs:function(){
			_this.soundPanel.style.display="block"
			clearTimeout(_this.soundHideTime);
		},
		soundPh:function(){
			_this.soundHideTime=setTimeout(function(){
				_this.soundPanel.style.display="none"
			},1000)
			
		},
		///设置声音
		setVolume:function(num){
			if(num>1)num=num/100;
			_this.soundBar.style.height=parseInt(50*num)+"px";
			_this.soundNum.innerHTML=parseInt(100*num)+"";
			_this.columeNum=parseInt(100*num);
			stream.setVolume(_this.columeNum);
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
//			_this.progressBar.width((UI.video.currentTime/UI.video.duration)*100+"%")
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
			$(".playBigBtn")[0].style.display="block"
		},
		metadataFun:function(){
			_this.showTip(true,"读取数据成功,进入对接通道");
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
			$(".playBigBtn")[0].style.display="none"
		},
		errorFun:function(){
			UI.showTip(true,'出错');
		},
		showTip:function(b,m){
			clearTimeout(_this.timeOut);
			if(b)
			{
				_this.message.innerHTML=m;
				_this.timeOut=setTimeout(_this.showTip,3000,false);
			}
			else{
				_this.message.innerHTML="";
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
		},
		setVolume:function(num){
			UI.video.volume=num/100;
		}
	}
	window.GV=GV;
})(window)
