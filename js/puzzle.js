var right=document.getElementById("right");
var data=[];	
var wih="";
var order=0;
var spans=right.getElementsByTagName("span");
var imgArr=["pt1.jpg","pt2.jpg","pt3.jpg","pt4.jpg"];
function init(){
	var imgIndex=parseInt(Math.random()*imgArr.length);
	for(var i=0;i<5;i++){
		for(var j=0;j<9;j++){
			data.push({
				"order":order,
				"left":j*100,
				"top":i*100
			});
			wih+="<span style='background-image:url(img/拼图游戏/"+imgArr[imgIndex]+"); background-position:"+
			(-j*100)+"px "+(-i*100)+"px;' order='"+order+"'></span>";//"+(i*9+j)+"
			order++;
		}
	}
	right.innerHTML=wih;
	var mDivs=document.querySelectorAll(".magnifier div");
	for(var i=0;i<mDivs.length;i++){
		mDivs[i].style.backgroundImage="url(img/拼图游戏/"+imgArr[imgIndex]+")";
	}
	ordersb(1);
}
init();
function ordersb(n){
	var arr=[];
	if(n==1){
		arr=data.sort(function(a,b){
			return a.order-b.order;
		});
	}else{
		arr=data.sort(function(){
			return Math.random()-0.5;
		});
	}
	for(var i=0;i<data.length;i++){
		spans[i].style.transition="1s";
		spans[i].style.left=data[i].left+"px";
		spans[i].style.top=data[i].top+"px";
		spans[i].setAttribute("order",data[i].order);
		spans[i].addEventListener("transitionend",function(){
			for (var j = 0; j < spans.length; j++) {
				spans[j].style.transition = "none";
			}
		})				
	}
}
var random=document.getElementById("random");
random.onoff=false;
random.onclick=function(ev){
	if(!random.onoff){
		ordersb(2);
		random.value="验证";
		for(var i=0;i<spans.length;i++){
			drag(spans[i]);
		}
	}else{
		var flag=true;
		for(var i=0;i<spans.length;i++){
			if(parseInt(spans[i].getAttribute("order"))!=i){
				alert("游戏结束--挑战失败");
				flag=false;
				break;
			}					
		}
		if(flag){
			alert("游戏结束--挑战成功");
		}					
		ordersb(1);
		random.value="开始";
		right.innerHTML=right.innerHTML;
		right.onmousemove=null;
		right.onmouseup=null;
	}				
	random.onoff=!random.onoff;
	ev.cancelBubble=true;
};
function find(obj,l,t){
	for(var i=0;i<spans.length;i++){
		if( obj.getAttribute("order") == spans[i].getAttribute("order") ){
			continue;
		}
		if(spans[i].offsetLeft==l &&
		spans[i].offsetTop==t){
			return spans[i];
		}
	}				
}
function drag(obj){				
	obj.onmousedown=function(ev){
		obj.style.zIndex="99";
		var br=obj.offsetLeft;
		var bb=obj.offsetTop;
		var width=obj.offsetWidth;
		var height=obj.offsetHeight;
		var or=right.getBoundingClientRect().left;
		var ob=right.getBoundingClientRect().top;
		var rMax=right.clientWidth-width;
		var bMax=right.clientHeight-height;
		var oOrder=obj.getAttribute("order");
		var disX=ev.clientX- br-or;
		var disY=ev.clientY-bb-ob;
		var  l,t,eel,eet,erl;
		right.onmousemove=function(ev){
			l=ev.clientX-disX-or;
			t=ev.clientY-disY-ob;
			l=l>rMax?rMax:l;
			l=l<0?0:l;
			t=t>bMax?bMax:t;
			t=t<0?0:t;
			obj.style.left=l+"px";
			obj.style.top=t+"px";
			eel=Math.round(l/width)*width;
			eet=Math.round(t/height)*height;
			erl=find(obj,eel,eet);
			for(var i=0;i<spans.length;i++){
				spans[i].style.opacity="";
			}
			if(erl){							
				erl.style.opacity=".5";
			}
		}
		right.onmouseup=function(){
			right.onmousemove=null;
			obj.style.zIndex="";
			if(erl){
				obj.setAttribute("order",erl.getAttribute("order"));						
				erl.style.left=br+"px";
				erl.style.top=bb+"px";
				erl.style.opacity="";
				erl.setAttribute("order",oOrder);
			}					
			obj.style.left=eel+"px";
			obj.style.top=eet+"px";						
		}
		return false;
	}
}
(function(){
	var smallPic=document.querySelector(".smallPic");
	var bigPic=document.querySelector(".bigPic");
	var spMask=document.querySelector(".spMask");
	smallPic.onmouseover=function(){
		spMask.classList.add("spmShow");
		bigPic.classList.add("bpShow");
	}
	smallPic.onmouseout=function(){
		spMask.classList.remove("spmShow");
		bigPic.classList.remove("bpShow");
	}
	var spWid=smallPic.clientWidth,sphei=smallPic.clientHeight
		spmW=spMask.offsetWidth,spmH=spMask.offsetHeight;
	smallPic.onmousemove=function(ev){
		var l=ev.clientX-spmW/2-smallPic.offsetLeft;
		var t=ev.clientY-spmH/2-smallPic.offsetTop;
		if(l<0){
			l=0;
		}
		if(l>spWid-spmW){
			l=spWid-spmW;
		}
		if(t<0){
			t=0;
		}
		if(t>sphei-spmH){
			t=sphei-spmH;
		}
		spMask.style.left=l+"px";
		spMask.style.top=t+"px";
		bigPic.style.backgroundPositionX=-l*3+"px";
		bigPic.style.backgroundPositionY=-t*3+"px";
	}
})();
