 var x=0;
 var oJdt=document.getElementById('jdt');
 window.onload=function()
 {
      setInterval(function()
      {
        if(x<=320)
        {
           x+=80;
           oJdt.style.width=x+'px';
        }
        else
        {
          window.open('index.html','_self');
        }
      },1000);
 }
     
