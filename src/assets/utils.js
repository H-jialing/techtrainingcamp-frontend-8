export const clearPoint = (point, anima) => {
  for (var i = 0; i < 4; i++) {
    point[i] = new Array(4).fill(0)
    anima[i] = new Array(4).fill(false)
  }
}
export const getRandom = () => {
  return parseInt(Math.random() * 4)
}
export const getNum = (level) => {
  if(level == 0) {
    if (Math.random() < 0.6) return 2
    else if(Math.random() < 0.9) return 4
    else return 32
  } else {
    if (Math.random() > 0.8) return 4
    else return 2
  }
      
}

export const canMoveLeft = (point) => {
  for (var i = 0; i < 4; i++) {
    // 最左边的一列不移动，因此不用判断
    for (var j = 1; j < 4; j++) {
      // 格子不等于零就要向左移动
      if (point[i][j] !== 0) {
        if (point[i][j - 1] === 0 || point[i][j - 1] === point[i][j]) return true
      }
    }
  }
  return false
}
export const canMoveRight = (point) => {
  for (var i = 0; i < 4; i++) {
    for (var j = 2; j >= 0; j--) {
      if (point[i][j] !== 0) {
        if (point[i][j + 1] === 0 || point[i][j] === point[i][j + 1]) return true
      }
    }
  }
  return false
}

export const canMoveUp = (point) => {
  for (var j = 0; j < 4; j++) {
    for (var i = 1; i < 4; i++) {
      if (point[i][j] !== 0) {
        if (point[i - 1][j] === 0 || point[i - 1][j] === point[i][j]) return true
      }
    }
  }
  return false
}

export const canMoveDown = (point) => {
  for (var j = 0; j < 4; j++) {
    for (var i = 0; i < 3; i++) {
      if (point[i][j] !== 0) {
        if (point[i + 1][j] === 0 || point[i + 1][j] === point[i][j]) return true
      }
    }
  }
  return false
}

// 判断第row行的第col1列到第col2列是否存在障碍物
export const noBlockHorizontal = (point, row, col1, col2) => {
  for (var i = col1 + 1; i < col2; i++) {
    if (point[row][i] !== 0) return false
  }
  return true
}

export const noBlockVertical = (point, col, row1, row2) => {
  for (var i = row1 + 1; i < row2; i++) {
    if (point[i][col] !== 0) return false
  }
  return true
}

export const generateOneNum = (point, ref, level) => {
  var x = getRandom()
  var y = getRandom()
  if (point[x][y] === 0) {
    point[x][y] = getNum(level)
    ref.children[x * 4 + y].innerHTML = point[x][y]
    ref.children[x * 4 + y].setAttribute('class', 'cell number-cell' + point[x][y])
  } else {
    generateOneNum(point, ref)
  }
}
export const HorAnimation = (ref, i, j, k) => {
  ref.children[i*4 + j].style.transform = 'translate(' + (k-j)*90 + 'px, 0)'
}
export const VerAnimation = (ref, i, j, k) => {
  ref.children[i*4 + j].style.transform = 'translate(0, ' + (k-i)*90 + 'px)'
}
export const numberInit = (point, numberRef) => {
  numberRef.innerHTML = ''
  for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 4; j++) {
      let el = document.createElement('div')
      if(point[i][j] === 0) {
        el.className = 'number-cell'
      } else {
        el.className = 'cell number-cell' + point[i][j]
        el.innerHTML = point[i][j]
      }
      numberRef.appendChild(el)
    }
  }
}

export const alert = (str) =>{
  var msgw, msgh, bordercolor;  
      msgw=140;//提示窗口的宽度  
      msgh=40;//提示窗口的高度  
      bordercolor="#E9CF7F";//提示窗口的边框颜色  
      var sWidth,sHeight;  
      //获取当前窗口尺寸  
      sWidth = document.body.offsetWidth;  
      sHeight = document.body.offsetHeight;  
    //背景div  
      var bgObj=document.createElement("div");  
      bgObj.setAttribute('id','alertbgDiv');  
      bgObj.style.position="absolute";  
      bgObj.style.top="0";  
      bgObj.style.background="#FFFFFF";  
      bgObj.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";  
      //透明度
      bgObj.style.opacity="0.3";  
      bgObj.style.left="0";  
      bgObj.style.width = sWidth + "px";  
      bgObj.style.height = sHeight + "px";  
      bgObj.style.zIndex = "10000";
      document.body.appendChild(bgObj);  
      //创建提示窗口的div  
      var msgObj = document.createElement("div")  
      msgObj.setAttribute("id","alertmsgDiv");  
      msgObj.setAttribute("align","center"); 
      msgObj.style.background="#8C7B69";  
      msgObj.style.border="1px solid " + bordercolor;
      //div设置圆角  
      msgObj.style.setProperty('border-radius', '5px 5px 5px 5px', 'important');  
      msgObj.style.position = "absolute";  
      msgObj.style.left = "50%";  
      msgObj.style.font="12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";  
      //窗口距离左侧和顶端的距离   
      msgObj.style.marginLeft = "-75px";  
      //窗口被卷去的高+（屏幕可用工作区高/2）-150  
      msgObj.style.top = document.body.scrollTop+(window.screen.availHeight/2)-50 +"px";  
      msgObj.style.width = msgw + "px";  
      msgObj.style.height = msgh + "px";  
      msgObj.style.textAlign = "center";  
      msgObj.style.whiteSpace = "nowrap"
      msgObj.style.overflow = "hidden";
      msgObj.style.textOverflow = "ellipsis";  
      msgObj.style.fontSize = "1rem";
      msgObj.style.fontWeight = "600";
      msgObj.style.lineHeight = "20px";
      msgObj.style.zIndex = "10001";  
      document.body.appendChild(msgObj);  
      //提示信息  
      var txt = document.createElement("p");  
      txt.setAttribute("id","msgTxt");  
      txt.style.margin="10px 0";
      txt.innerHTML = str; 
    txt.style.color="white";	
      document.getElementById("alertmsgDiv").appendChild(txt);  
      //设置关闭时间
      window.setTimeout(closewin, 2000, 1); 
}

export const closewin = () =>{
  document.body.removeChild(document.getElementById("alertbgDiv"));  
  document.body.removeChild(document.getElementById("alertmsgDiv"));
}