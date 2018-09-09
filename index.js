// 默认选择初级，先选择等级难度，点击开始游戏以后，将等级的class传递到扫雷函数中。
// 初级 15x10 150格子 20个雷 
// 中级 22x15 330格子 40个雷
// 高级 30x22 660格子 90个雷
// 每个雷长度和高度固定 宽和高30px


// 选取ul标签
var ul = document.getElementsByClassName("level")[0];
// 从ul标签中选取li标签（关于等级）
var li = ul.getElementsByTagName("li");
// 选取开始游戏按钮
var btn = document.getElementsByClassName("begin")[0];
// 选取扫雷区域
var box = document.getElementsByClassName("content")[0];
// 创建二位数组记录所有格子的位置
var mapDivPosition = [];
// 包含雷的数组
var landmineArray = [];
// 难度等级
var rank = 0;
// 雷的数量
var num = 0;
// 矩阵行和宽
var row = 0;
var col = 0;
// 所有格子点开计数器
var count = 0;
// 红旗计数器
var flagNum = 0;
// 第一次点击判断标志
var firstClick;
// 游戏结束弹窗
var popup = document.getElementsByClassName("popup")[0];
var result = document.getElementsByClassName("result")[0];
var close = document.getElementsByClassName("close")[0];

// 执行选择等级变色函数
level(li);

// 开始游戏，通过之前等级选出扫雷地图的大小和雷的个数
btn.onclick = function () {
    for(var i = 0; i < li.length; i++){
        if(li[i].classList.contains("select")){
            rank = i;
            break;
        }
    }
    if(rank == 0){
        row = 15;
        col = 10;
        num = 20;
        // 重置盒子内容
        box.innerHTML = "";
        // 布置地图
        mapArea(box);
        firstClick = true;
    }else if(rank == 1){
       row = 22;
       col = 15;
       num = 40;       
       box.innerHTML = "";
       mapArea(box);
       firstClick = true;
   }else if (rank == 2){
       row = 30;
       col = 22;  
       num = 90;
       box.innerHTML = "";
       mapArea(box);
       firstClick = true;
   }
}


// 关于等级选取变色函数
// dom传递值为li标签
function level (dom)  {
    for(var i = 0; i < dom.length; i++){
        (function (i) {
            dom[i].onclick = function () {
                for(var j = 0; j < dom.length; j++){
                    dom[j].classList.remove("select");
                }
                dom[i].classList.add("select");
            }
        })(i)
    }
}

// 扫雷布置函数
// 扫雷布置函数传递值 
//               num 雷的个数 
//               dom 生成的地方 content 

function mapArea (dom){
    // 每次生成扫雷布置区域，自动重置数组和雷数
    mapDivPosition = [];
    landmineArray = [];
    // 生成扫雷地图
    for(var i = 0; i < col; i++){
        // 创建行数组
        var rowArray = [];
        // 创建行div
        var rowDiv = document.createElement("div");
        // 设置行的样式
        rowDiv.className = "row";
        // 将行div添加到地图中
        dom.appendChild(rowDiv);
        for(var j = 0; j < row; j++){
            // 创建格子
            var colDiv = document.createElement("div");
            // 设置格子的样式和位置
            colDiv.className = "column";
            colDiv.setAttribute("XYPosition",i+"-"+j);
            // 将格子添加到行中
            rowDiv.appendChild(colDiv);
            // 将格子添加到行数组中
            rowArray.push(colDiv);
        }
        // 将每行格子添加到地图数组中
        mapDivPosition.push(rowArray);
    } 
}    

// 关闭弹窗
close.onclick = function () {
    popup.style.display = 'none';
    result.style.backgroundImage = 'none';
}

// 取消扫雷区域鼠标右键默认菜单
box.oncontextmenu = function () {
    return false;
}

// 扫雷区域左键和右键动作函数
box.onmousedown = function (e){
    count = 0;
    flagNum = 0;
    // 兼容浏览器
    var e = window.event || e;
    // 选取点击元素
    var target = e.target;
    // 判断是否在扫雷区域点击
    if(target.classList.contains("column")){
    // 随机生成地雷
    while(firstClick&&num){
    // 判断生成雷是否重复 1表示不重复 0表示重复
    var landmineFlag = 1;
    // 随机生成某行
    var rowRandom = Math.floor(Math.random() * col);
    // 随机生成某列
    var colRandom = Math.floor(Math.random() * row); 
    // 雷数组的长度
    var landmineArrayLength = landmineArray.length;

    // 通过雷数组中已经生成的雷和新生成的雷做比较，并保证第一次点击不出现雷，看是否重复
    if(mapDivPosition[rowRandom][colRandom] !== target){
        for(var m = 0; m < landmineArrayLength; m++){
            if((landmineArray[m] == mapDivPosition[rowRandom][colRandom])){
                landmineFlag = 0;
                break;
            }
        }   
            // 把不重复的雷加入数组中,并将雷的元素中landmine设置1
            if(landmineFlag){
                landmineArray.push(mapDivPosition[rowRandom][colRandom]);
                mapDivPosition[rowRandom][colRandom].setAttribute("isLei", "1");
        // 数组添加了1个雷，总数减少1
        num -- ;
        }
    }
}

if(firstClick){
    num = landmineArray.length;
}
    // 仅第一次点击执行
    firstClick = false;
    // 判断是否在扫雷区域 避免报错
    if(e.which == 1){
        leftClick(target);
    }else if(e.which == 3){
        rightClick(target);
    }
    // 判断格子是否全部点完和地雷是否全被标记完
    for(var i = 0; i < col; i++){
        for(var j = 0; j < row; j++){
            if(mapDivPosition[i][j].classList.contains("grade")||mapDivPosition[i][j].classList.contains("mark")){
                count ++;
            }
            if(mapDivPosition[i][j].classList.contains("mark")){
                flagNum ++;
            }
        }
    }
    if(!num&&(count == (row * col))&& (flagNum == landmineArray.length)){
        // 显示扫雷成功弹窗
        setTimeout(function(){
            popup.style.display = 'block';
            result.style.backgroundImage = 'url(img/success.jpg)';
        },500);
    }
}
}

// 扫雷左键函数
function leftClick (dom) {
    // 得到点击元素的X、Y坐标
    var domPosition = dom.getAttribute("XYPosition").split("-");
    var Ydom = +domPosition[0];
    var Xdom = +domPosition[1];
    // 雷数组的长度
    var landmineArrayLength = landmineArray.length;
    // 判断该元素是否是雷
    if(dom.getAttribute("isLei")){
        // 显示全部雷
        for(var i = 0; i < landmineArrayLength; i++){
            landmineArray[i].classList.add("mark");
            landmineArray[i].style.backgroundImage = "url(img/landmine.jpg)";
            // 显示扫雷失败的弹窗
            setTimeout(function(){
                popup.style.display = 'block';
                result.style.backgroundImage = 'url(img/fail.jpg)';  
            },500);
        }
    }else{
        // 积分函数
        integral(Ydom,Xdom);
    }
}

// 积分函数
function integral (Y,X) {
    // 记录点击元素目标
    var target = mapDivPosition[Y][X];
    // 记录分数
    var grade = 0;
    // 判断八个方向是否有雷 有雷+1分
    for(var i = Y - 1; i <= Y + 1; i++){
        for(var j = X - 1; j <= X + 1; j++){
            // 判断八个方向元素，要在矩阵方位内
            if((i >= 0 && i < col) && (j >= 0 && j < row)){
                if(mapDivPosition[i][j].getAttribute("isLei")){
                    grade ++;
                }
            }
        }
    }
    // 分数不为0，则记录分数 
    // 如果点击的八个方向都没雷，则四周扩散
    if(grade){
        target.classList.add("grade");
        target.innerHTML = grade;
    }else{
        target.classList.add("grade");
        for(var i = Y - 1; i <= Y + 1; i++){
            for(var j = X - 1; j <= X + 1; j++){
                if((i >= 0 && i < col) && (j >= 0 && j < row)){
                    // 利用递归，四周扩散
                    if(!mapDivPosition[i][j].classList.contains("grade")){
                        integral(i,j)
                    }
                }
            }
        }
    }
}

// 扫雷右键函数
function rightClick (dom) {
    // 如果已经被标记，可以取消标记，
    // 当地雷被取消标记，则地图总数+1
    if(dom.classList.contains("mark")){
        dom.style.backgroundImage = 'none';
        dom.classList.remove("mark");
        if(dom.getAttribute("isLei")){
            num ++;
        }
    }else{
        //  显示标记
        //  当地雷被标记，则地图总数-1
        if(!dom.classList.contains("grade")){
            dom.classList.add("mark");
            dom.style.backgroundImage = 'url(img/flag.jpg)';
            if(dom.getAttribute("isLei")){
                num --;
            }
        }
    }
}