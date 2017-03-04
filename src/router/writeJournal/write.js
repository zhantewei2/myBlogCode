module.exports=function(){

function id(name){
      return document.getElementById(name);
    }
    function sel(name){
      return document.querySelector(name);
    }
    createShade();
    initCloseButton();
    id('btn1').onclick=function(){
      document.execCommand('Bold','false');
    }
    id('btn2').onclick=function(){
      this.ZTW_selectColor=this.ZTW_selectColor||'black';
      document.execCommand('ForeColor','false',this.ZTW_selectColor);
    }
    id('btn3').onclick=function(){
      if(sel('.popDiv').style.display==='none'){
        sel('.popDiv').style.display='block';
        id('insertImg').style.display='block';
        var select=window.getSelection();
        var node=select.focusNode;
        var ancestor=findAncestor(node,{'id':'TEXTOne'});
        if(ancestor){
          var range=select.getRangeAt(0);
          this.ZTW_storage=range;
        }
        sel('.ZTW_shade').of(sel('.popDiv'));
        sel('.ZTW_shade').show();
      }else{
        sel('.popDiv').style.display='none';
        id('insertImg').style.display='none'
      }

    }
    sel('.popDiv #insertImg input[type=button]').onclick=function(){
        var range=id('btn3').ZTW_storage;
        if(!range) return;
        var imgEl=document.createElement('img');
        var value=this.previousElementSibling.value;
        if(!value) return ;
        imgEl.src=value;
        range.surroundContents(imgEl);
        closePop();
        this.previousElementSibling.value='';
    }
    sel('.popDiv #insertImg button').onclick=function(){
        var inputNode=sel('.popDiv #insertImg input[type=text]');
        inputNode.value='';
        inputNode.focus();
    }
    function closePop(){
      var pop=sel('.popDiv');
      var shade=sel('.ZTW_shade');
      pop.style.display!=='none'?pop.style.display='none':0;
      shade.style.display!=='none'?shade.style.display='none':0;
    }
    function initCloseButton(){
      var close=sel('.close');
      var parent=close.parentNode;
      close.innerHTML='<b>X</b>'
      close.onclick=function(){
        parent.style.display='none';
        sel('.ZTW_shade').style.display!=='none'?sel('.ZTW_shade').hiddenN():0;
      }
    }
    
    function createShade(){
      sel('.myEditor').style.position='relative'
      var myEditor=sel('.myEditor');
      var shadeDiv=document.createElement('div');
      var arrNode=[];
      shadeDiv.style.width=myEditor.offsetWidth+'px';
      shadeDiv.style.height=myEditor.offsetHeight+'px';
      shadeDiv.style.top='0px';
      shadeDiv.style.left='0px';
      shadeDiv.className='ZTW_shade';
      shadeDiv.style.position='absolute';
      shadeDiv.style.backgroundColor='rgba(255,255,255,0.6)';
      shadeDiv.style.display='none';
      shadeDiv.style.zIndex=10;
      shadeDiv.show=function(){
        this.style.display='block'
      }
      shadeDiv.hiddenN=function(){
        this.style.display='none';
      }
      shadeDiv.of=function(node){
        arrNode.push(node);
      }
      shadeDiv.addEventListener('click',function(){
        if(arrNode[0]){
          arrNode.forEach(function(v){
            v.style.display='none';
         });
        }
        arrNode=[];
        this.hiddenN();
      })
      sel('.myEditor').appendChild(shadeDiv);
    }

    function palette(target,bindNode,n){
      n=n||6;
      target.ZTW_open=target.ZTW_open===undefined?false:!target.ZTW_open;
      if(!target.ZTW_first){
        var bottomPos=target.offsetTop+target.clientHeight;
        var leftPos=target.offsetLeft;
        var fragNode=document.createDocumentFragment();
        var colorNode=document.createElement('span');
        colorNode.style.cssText='width:1em;height:1em;float:left;display:inline-block;margin:0.2em;border-radius:0.2em;box-sizing:border-box;box-shadow:1px 1px 1px gray';

        genRGB(n,function(data,totalN){
          var nodeOne=colorNode.cloneNode(true);
          nodeOne.style.backgroundColor=data;
          fragNode.appendChild(nodeOne);
          totalN%6===0?fragNode.appendChild(document.createElement('br')):0;
        })
        
        var div1=document.createElement('button');
        div1.appendChild(fragNode);
        div1.style.cssText='z-index:5;position:absolute;border:1px solid black;border-radius:5px;padding:0.5em;background:rgba(255,255,255,0.5);font-size:16px';
        div1.style.left=leftPos+'px';
        div1.style.top=bottomPos+5+'px';
        div1.addEventListener('click',function(e){
          var targetNode=e.target;
          if(targetNode.nodeName==='SPAN'){
            var color=targetNode.style.backgroundColor;
            bindNode.ZTW_selectColor=color;
            target.ZTW_open=!target.ZTW_open;
            target.ZTW_palette.style.display='none';
            target.ZTW_storageNode?target.ZTW_storageNode.style.outline='':0;
            target.ZTW_storageNode=targetNode;
            document.execCommand('ForeColor','false',color);
            sel('.showColor').style.backgroundColor=color;
          }
        });
        div1.addEventListener('mouseover',function(e){
          var targetNode=e.target;
          if(targetNode.nodeName==='SPAN'){
            targetNode.style.outline='4px double gray'
            targetNode.style.cursor='pointer';
          }
        });
        div1.addEventListener('mouseout',function(e){
          var targetNode=e.target;
          var comp=this.compareDocumentPosition(e.relatedTarget);
          if(comp===0||comp===20){
            targetNode.style.outline='';
          }else{
            if(target.ZTW_open) return;
            target.ZTW_open=!target.ZTW_open;
            target.ZTW_palette.style.display='none';
          }
        })
        div1.id='node1';
        target.ZTW_palette=div1;
        target.ZTW_first=true;
        target.parentNode.insertBefore(div1,target.parentNode.lastElementChild);
      }else{
        target.ZTW_palette.style.display=target.ZTW_open?'none':'block';
        id('node1').onclick=function(){
          document.execCommand('copy');
        }
      }
    }
    id('selectColor').onclick=function(){
      palette(this,id('btn2'));
    }

    function checkScript(str){
      if(str.indexOf('<script>')>-1)return 'error';
      return str;
    }
    id('TEXTOne').ZTW_combo=false;
    id('TEXTOne').ZTW_first=false;
    id('TEXTOne').addEventListener('keydown',function(e){
      var keyCode=e.keyCode||e.which;
      var select=window.getSelection();
      var currentNode=select.focusNode;
      if(!currentNode)return;
      var parentNode=currentNode.parentNode;
      var range=select.getRangeAt(0);
      var offset=select.focusOffset;
      if(parentNode===this&&!this.ZTW_first){
        range.selectNode(currentNode);
        range.surroundContents(document.createElement('div'));
        select.collapse(currentNode,offset);
        this.ZTW_first=true;
      }  
      if(keyCode===9){
        e.preventDefault();  
        var tab='&nbsp;&nbsp;'
        if(currentNode.nodeValue){
          var text=currentNode.nodeValue.slice(0,offset)+tab+currentNode.nodeValue.slice(offset);
          text=partEncode(text);
          currentNode.parentNode.innerHTML=text;
          select.collapse(currentNode,offset+2);
        }else{
          currentNode.innerHTML=tab;
          select.collapse(currentNode,1)
        }
      }else if(keyCode===13||keyCode===100){
        if(this.combo){
          e.preventDefault();
          if(currentNode.nodeValue){
            var node=realyParent(currentNode);
            var afterNode=document.createElement('div');
            afterNode.innerHTML='&nbsp;';
            insertAfter(afterNode,node);
            select.collapse(afterNode,0);
          }
          return;
        }
        var parentNode=realyParent(currentNode);
        if(currentNode.nodeValue){
          if(offset===currentNode.nodeValue.length){
              setTimeout(function(){
                var node=parentNode.nextSibling;
                var getTabs=findAllTabs(parentNode);
                if(getTabs){
                  var tabNums=getTabs.length/6;
                  node.innerHTML=getTabs;
                  select.collapse(node.childNodes[0],tabNums);
                }
              },1)
          }else{
            var old=realyParent(currentNode);
            setTimeout(function(){
              var now=realyParent(currentNode);
              var getTabs=findAllTabs(old);
              if(getTabs){
                var tabNums=getTabs.length/6;
                now.innerHTML=getTabs+partEncode(now.innerText);
                select.collapse(now.childNodes[0],tabNums);
              }         
            },1)
          }
        }  
      }else if(keyCode==18){
        this.combo=true;
      }
    })
    id('TEXTOne').addEventListener('keyup',function(e){
      var keyCode=e.keyCode||e.which;
      if(keyCode==18) {this.combo=false}
    })
    function findAllTabs(node){
      var getTabs='';
      var textArr=getAllText(node);
      for(var i=0,len=textArr.length;i<len;i++){
        var matchStr=textArr[i].match(/^\s+/);
        if(matchStr){
          getTabs+=matchStr.toString();
        }
        if(/[^\s]/.test(textArr[i])) break;
      }
      return getTabs?getTabs.replace(/\s/g,'&nbsp;'):null;
    }
    function partEncode(str){
      return str.replace(/</g,'&lt;');
    }
    id('HTMLOne').addEventListener('blur',function(){
      id('TEXTOne').innerHTML=this.innerText;
    })
    id('TEXTOne').addEventListener('blur',function(){
      id('HTMLOne').innerText=checkScript(this.innerHTML);
    });
    id('TEXTOne').addEventListener('paste',filterPaste);
    id('HTMLOne').addEventListener('paste',filterPaste);
  function findAncestor(node,obj){
    if(!node) return; 
    if(node.nodeName.toLowerCase()==='bpdy')return ;
    var proArr=Object.getOwnPropertyNames(obj);
    var r=true;
    for(var i=0,len=proArr.length,v=proArr[i];i<len;i++){
      if(node[v]!==obj[v]){
        r=false;
        break;
      }
    }
    if(r==true) return node;
    return findAncestor(node.parentNode,obj);
  }

  function realyParent(node,tagName){
    tagName=tagName||'div';
    var parentNode=node.parentNode;
    var parentTagName=parentNode.nodeName.toLowerCase();
    if(parentTagName==='body')return ;
    if(parentTagName===tagName){
      return parentNode;
    }else{
      return realyParent(parentNode,tagName);
    }
  }
  function getAllText(node){
    var arr=[];
    find(node);
    function find(node){
      if(node.nodeValue){
          arr.push(node.nodeValue);
      }else if(node.innerHTML){
          node.childNodes.forEach(function(v){
            find(v);
          })
      }
    }
    return arr;
  }
  function filterPaste(e){   
    e.preventDefault();
    if(e.clipboardData.types.indexOf('text/plain')>-1){
     var data=e.clipboardData.getData('text/plain');
     var currentNode=e.target;
     var textNode=currentNode.childNodes[0];
     var select=window.getSelection();
     var offset=select.focusOffset;
     if(textNode){
        textNode.nodeValue=textNode.nodeValue.slice(0,offset)+data+textNode.nodeValue.slice(offset);
         select.collapse(textNode,offset+data.length);
      }else{
        if(currentNode!==this){
          var innerNode=document.createTextNode(data);
          //insertBefore <br>;
          currentNode.parentNode.insertBefore(innerNode,currentNode);
          select.collapse(innerNode,data.length);
        }else{
          var range=select.getRangeAt(0);
          var div=document.createElement('div');
          div.appendChild(document.createTextNode(data));
          this.appendChild(div)
          select.collapse(div.childNodes[0],data.length);
        }
      }
    }
  }
  function genRGB(n,fn){
    var totalN=0;
    function setRGB(n,fn1,fn2){
      var time=n,e=Math.floor(255/n),color=e;
      var rgb='';
      while(time--){
        totalN++;
        rgb=fn1(color);
        fn2(rgb,totalN);
        color+=e;
      }
    }
   for(var nowN=1;nowN<=7;nowN++){
    switch(nowN){
      case 1:
        setRGB(n,function(color){
          var thisColor=color;
          totalN===1?thisColor=0:0;
          return 'rgb('+thisColor+','+thisColor+','+thisColor+')'},fn);
        break;
      case 2:
        setRGB(n,function(color){return 'rgb(255,'+color+',0)'},fn);
        break;
      case 3:
        setRGB(n,function(color){return 'rgb('+(255-color)+',255,0)'},fn);
        break;
      case 4:
        setRGB(n,function(color){return 'rgb(0,255,'+color+')'},fn);
        break;
      case 5:
        setRGB(n,function(color){return 'rgb(0,'+(255-color)+',255)'},fn);
        break;
      case 6:
        setRGB(n,function(color){return 'rgb('+color+',0,255)'},fn);
        break;
      case 7:
        setRGB(n,function(color){return 'rgb(255,0,'+(255-color)+')'},fn);
      }
    }
  }
  function insertAfter(insertNode,node){
    if(node.nextSibling){
      node.parentNode.insertBefore(insertNode,node.nextSibling);
    }else{
      node.parentNode.appendChild(insertNode);
    }
  }
}