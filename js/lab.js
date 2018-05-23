/*
Function: "绿色变身大作战"游戏
Author  :王晓燕
Build_Data :2015-12-25
Version:3.0
*/

//1.公共变量声明块..................................
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    image = new Image();
var x=(canvas.width-image.width*0.1)/2;//地球的横坐标
var left=false,//判断地球是否左移
    right=false;//判断地球是否右移
var objTime=document.getElementById('time');
    id=null;//倒计时计时器初始化
    t_time=60;//倒计时 时间初始化
var objAgain=document.getElementById('again');
    objPause=document.getElementById('pause');
    flag=0;//判断动画是否试行
    isPause=true;//判断暂时键是否被点击
var objScore1=document.getElementById('score1');
    objScore2=document.getElementById('score2');
    count=1;//点击画布的次数  
    treeCount = 0;
    axeCount = 0;
var treeImage=new Image();
    axeImage=new Image();
var lastTime=0,//记录上次执行动画的时间
    INTERVAL=500,//上次执行动画与下次执行动画的时间差
    arrTree=[],//存放所有树苗
    arrAxe=[],
    i=0,//下落树苗的个数
    j=0;
//掉落行为
var drop = {
       Velocity:55,//掉落的速度为55
       x:0,
       y:0,

       execute: function (sprite, ctx) {//执行
         this.y+= this.Velocity;
         sprite.left=this.x;
         sprite.top=this.y;  
       }
    },

    //树苗绘制器
    treePainter ={

        x:this.x||0,
        y:this.y||0,

        paint: function(sprite,ctx){
            ctx.save();

            ctx.beginPath();
            ctx.drawImage(treeImage,this.x,this.y,treeImage.width*0.25,treeImage.height*0.25);

            ctx.restore();
        }
    };
    axePainter ={

        x:this.x||0,
        y:this.y||0,

        paint: function(sprite,ctx){
            ctx.save();

            ctx.beginPath();
            ctx.drawImage(axeImage,this.x,this.y,axeImage.width*0.25,axeImage.height*0.25);

            ctx.restore();
        }
    };

var comments=['GAME START','GAME OVER'];//游戏开始时及游戏结束时的文字提示

//2.函数定义块......................................
function drawImage(x){
  ctx.drawImage(image,x,canvas.height-image.height*0.1,image.width*0.1,image.height*0.1);
}
function move()
{
  y=canvas.height-image.height*0.1;  //地球的纵坐标
  if(left&&t_time>0){
      ctx.clearRect(x-1,y-1,image.width*0.1+1,image.height*0.1+1);//里面加一减一之类的只是为了把图片擦得干净点
      x-=10;
      if(x<=0)x=0;//地球不能超过左边边界
      ctx.drawImage(image,x,y,image.width*0.1,image.height*0.1);//绘制新地球
  }else if(right&&t_time>0){
      ctx.clearRect(x-1,y-1,image.width*0.1,image.height*0.1+1);
      x+=10;
      if(x>=canvas.width-image.width*0.1)//地球不能超过右边边界
        x=canvas.width-image.width*0.1;
      ctx.drawImage(image,x,y,image.width*0.1,image.height*0.1);//绘制新地球
  }
}
function drawTree(){
    i=arrTree.length;
    tree= new Sprite('tree',treePainter,[drop]);
    tree.left=Math.random()*canvas.width;
    tree.top=0;
    tree.painter.x=tree.left;
    tree.painter.y=tree.top;
    tree.paint(ctx);
    arrTree.push(tree);

}
function drawAxe(){
    j=arrAxe.length;
    axe= new Sprite('axe',axePainter,[drop]);
    axe.left=Math.random()*canvas.width;
    axe.top=0;
    axe.painter.x=axe.left;
    axe.painter.y=axe.top;
    axe.paint(ctx);
    arrAxe.push(axe);

}
//每帧刷新内容
function animate(time){
    if(time-lastTime>INTERVAL){

        ctx.clearRect(0,0,canvas.width,canvas.height);//清除屏幕
        if (time === undefined) {
            time = +new Date;
        }

        drawImage(x);//出现地球

        i=arrTree.length;
        while(i--){
            var tree=arrTree[i];
            drop.x=tree.left;
            drop.y=tree.top;
            
            tree.update(ctx);//更新树苗行为
            tree.painter.x=tree.left;
            tree.painter.y=tree.top;
            tree.paint(ctx);//绘制树苗

            if(tree.top>canvas.height){
                //删除下落的树苗
                arrTree.splice(i,1);
            }
            
            if(tree.top>y&&tree.left>=x&&tree.left<=x+image.width*0.1)
            {
              treeCount++;
              objScore1.innerHTML=treeCount;
              arrTree.splice(i,1);
            }
            
        }
        j=arrAxe.length;
        while(j--){
            var axe=arrAxe[j];
            drop.x=axe.left;
            drop.y=axe.top;
            
            axe.update(ctx);//更新树苗行为
            axe.painter.x=axe.left;
            axe.painter.y=axe.top;
            axe.paint(ctx);//绘制树苗

            if(axe.top>canvas.height){
                //删除下落的树苗
                arrAxe.splice(j,1);
            }

            if(axe.top>y&&axe.left>=x&&axe.left<=x+image.width*0.1)
            {
              axeCount++;
              objScore2.innerHTML=axeCount;
              arrAxe.splice(j,1);

            }
            
        }
        
        lastTime=time;//记录本次时间
        if(Math.random() < 1 - Math.pow(.993, time)) {
            var number = Math.floor(Math.random()*10);
            if(number>7)
            {
                drawTree();
            }//产生新树苗
            else if(number<3 && number>0)
            {
                drawAxe();
            }//产生新斧头
        }


        // drawTree();//产生新树苗
        // drawAxe();//产生新斧头
        
    }
    if(t_time!=0&&flag==0) //游戏没结束前
     requestNextAnimationFrame(animate);//调用动画循环

}

function countdown(){//60秒倒计时
       
    objTime.innerHTML=t_time;
    clearInterval(id);//清除计时器
    id=setInterval(countdown,1000);//放置计时器
    t_time-=1;   
    if(t_time<0){
        clearInterval(id);
        text(1);//显示game over
    }

}

function text(NUM){//文本绘制函数，返回值为数组文本
  ctx.font= "80px Arial";
  var text_x=ctx.measureText(comments[NUM]).width;
  ctx.strokeText(comments[NUM],(canvas.width-text_x)/2,document.documentElement.clientHeight/2);//后面那个是可视屏幕的高度
}


function start(){//初始化工作
  treeCount = 0;
  axeCount = 0;
  t_time=60;//时间变回60秒
  objTime.innerHTML=t_time;//让时间显示出来
  ctx.clearRect(0,0,canvas.width,canvas.height);//清除画布
  drawImage(x);//出现地球
  count=1;//重新记录点击画布的次数
  objScore1.innerHTML='0';//打中数归零
  objScore2.innerHTML='0';//打中数归零
  i=0,//下落树苗的个数归零
  j=0;//下落斧头的个数归零
  arrTree=[],//清空所有树苗
  arrAxe=[];//清空所有斧头
  text(0);//显示game start
}

//3.事件注册块......................................
document.onkeydown = function(event)
{
  var event = event || window.event;
  var keyCode = event.keyCode;
  switch(keyCode){
     case 37: left = true;break;
     case 39: right = true;break;
  }
}
document.onkeyup = function(event)
{
  var event = event || window.event;
  var keyCode = event.keyCode;
  switch(keyCode){
     case 37: left = false;break;
     case 39: right = false;break;
  }
}

canvas.onclick=function(e)//鼠标点击画布时的事件
{
  
  if(count==1)//判断，当第一次点击画布时游戏开始，之后继续点击画布，不在执行
  {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawImage(x);//出现地球
    drawTree();
    drawAxe();
    requestNextAnimationFrame(animate);
    countdown();//倒计时开始
    flag=0;
  }
  count++;

  if(time)//判断游戏是否结束
    objScore1.innerHTML=treeCount;
    objScore2.innerHTML=axeCount;//结束后，击中数不在增加

}

objAgain.onclick=function(e){
  start();
  flag=1;
  isPause=true;
  objPause.innerHTML='暂停';
}  
objPause.onclick=function()
{
  if(t_time!=60)//游戏开始前点击按钮，按钮始终为暂停
  {
    if(isPause)//判断点击了暂停按钮
    {
      objPause.innerHTML='继续游戏';
      isPause=false;
      flag=1;//动画停止的标志
      clearInterval(id);
    }
    else//判断点击了继续游戏按钮
    {
      objPause.innerHTML='暂停';
      isPause=true;
      flag=0;//动画开始的标志
      if(t_time!=0&&flag==0) //游戏没结束前
       requestNextAnimationFrame(animate);//调用动画循环
     countdown();//计时函数
    }
 }
}
//4.初始化块........................................

image.src="images/earth.png";
image.onload = function(e) {
   drawImage(x);
   text(0); //显示game start
};
setInterval(move,50);
 treeImage.src="images/tree seedling.png";
 axeImage.src="images/axe.png";