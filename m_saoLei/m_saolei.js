var table = document.getElementById("landMine");
var start = document.getElementById("start");
var landMineCount = document.getElementById("landMineCount");
var td = document.getElementsByTagName("td");
var costTime = document.getElementById("costTime");
var change = document.getElementById("change");
var image = document.getElementById("image");
var tds=[];
var landMineNum = 0;
var mines=[];
var flagCount = 0;
var stepCount = 0;
var startTime = 0;
var endTime = 0;
var timeCount = null;





//构造扫雷地图
function drawMap(){
    for(var i = 0; i<10;i++){
        tds.push("<tr>");
        for(var j = 0 ;j<10;j++){
            tds.push("<td id="+i+j+"></td>");
        }
        tds.push("</tr>");
    }
    var html = tds.join("");
    table.innerHTML =html;
}

//替换成旗子
change.addEventListener("touchend",function(){
        if(change.className=="flag")
            change.className ="dig";
            else{
                change.className = "flag";
            }
})



//扫雷格子初始化
function Arr(){
    for(var i = 0;i<10;i++){
        mines[i]=[];
        for(var j = 0;j<10;j++){
            mines[i][j]=0;
        }
    }
}

//随机分配地雷数的坐标(也可以用一个数组装0~99的数字，然后数组内部随机排序，取前面的一定个数作为地雷)
function setMine(){
    landMineNum =randomNum(10,20)+10;
    landMineCount.innerHTML = landMineNum;
    var minesRandom; // 储存得到的随机地雷格子的值
    var minesLocation={}; //记录地雷的坐标
    var minesValue=[]; //记录所有地雷的格子值，用于判断是否有随机值相同的
    for(var i=0 ; i<landMineNum ; i++ ){
        minesRandom = randomNum(0,100);
        minesLocation =  mlocation(minesRandom);
        if(minesValue.indexOf(minesRandom)>=0){
            i--;
            continue;
        }
        minesValue.push(minesRandom); 
        mines[minesLocation.row][minesLocation.col]=9; 
    }

}

//计算非地雷坐标的值
function caculateMine(){
    for(var i =0;i<10;i++)
        for(var j = 0; j<10;j++){
            if(mines[i][j]==9){
                continue;
            }
            if(i<9){
                if(mines[i+1][j]==9)
                    mines[i][j]++;
            }
            if(j<9){
                if(mines[i][j+1]==9)
                    mines[i][j]++;
            }
            if(i>0){
                if(mines[i-1][j]==9)
                    mines[i][j]++;
            }
            if(j>0){
                if(mines[i][j-1]==9)
                    mines[i][j]++;
            }
            if(i<9 && j<9){
                if(mines[i+1][j+1]==9)
                    mines[i][j]++;
            }
            if(i>0 && j>0){
                if(mines[i-1][j-1]==9)
                    mines[i][j]++;
            }
            if(i>0 && j<9){
                if(mines[i-1][j+1]==9)
                    mines[i][j]++;
            }
            if(i<9 && j>0){
                if(mines[i+1][j-1]==9)
                    mines[i][j]++;
            }
        }
        console.log(mines);
}

//根据随机的地雷值计算其坐标
function mlocation(num){
    return {
        row:parseInt(num/10),
        col:(num)%10
    }
}

//获得随机值
function randomNum(min,max){
    var minus = max - min;
    return Math.floor(Math.random()*minus);
}

//绑定时间函数
function listener(){
    for(let i = 0;i<100;i++){
    td[i].onclick=function(e){
        e.preventDefault();
        var minesNum,row,col;
        if(change.className == "flag" && !(td[i].className=="up")){
            if(!(td[i].className=="flag")){
                td[i].className = "flag";
                flagCount++;
                landMineCount.innerHTML=landMineNum-flagCount;
            }else{
                td[i].className = "";
                flagCount--;
                landMineCount.innerHTML=landMineNum-flagCount;
            }
            
        }else{
            if(!(td[i].className== "flag")){
             
                minesNum = td[i].getAttribute("id").split("");
                row = minesNum[0];
                col = minesNum[1];
                console.log(row+""+col);
                open(row,col);
            }
        }
    }
  }
}


//展开无雷区域
function showNoMines(row,col){
    var tid;
    row=parseInt(row);
    col=parseInt(col);
    for(var i = row-1; i<row+2;i++){
        for(var j = col-1; j<col+2;j++){
            if(!(i==row &&  j == col)){
                tid= document.getElementById(i+""+j);
                console.log(i+""+j);
                if(tid && tid.className ==""){
                    open(i,j);     
                }
            }
        }
    }
}

function open(row,col){
    var tid = document.getElementById(row+""+col);
    console.log(row+""+col);
    if(mines[row][col]!=9){
        stepCount++;
        if(mines[row][col]!=0){
            tid.innerHTML = mines[row][col];
        }
        if((stepCount+landMineNum)==100){
            alert("恭喜你，你赢了");
            image.className= "win";
            allOpen();
        }
        tid.className="up";
        tid.onclick = null;
        if(mines[row][col]==0){
            showNoMines(row,col);
        }
    }else {
        console.log(row+""+col);
        tid.style.backgroundColor = "red";
        alert("你输了。。。。。");
        image.className= "lose";
        allOpen();
        
    }
}



//全部显示
function allOpen(){
    var tid;
    for(var i=0;i<10;i++)
        for(var j = 0 ; j<10;j++){
            tid = document.getElementById(i+""+j);
            tid.className="up";
            if(mines[i][j]==9){ 
              tid.className = "Mine";
              tid.onclick = null;
            }
            if(mines[i][j]>0 && mines[i][j]<9){
                tid.innerHTML=mines[i][j];
            }
        }
        clearInterval(timeCount);
}

//游戏初始化
function init(){

    drawMap();
    Arr();
}

//开始游戏
function startGame(){
    end();
    setMine();
    caculateMine();
    image.className="look";
    startTime = new Date();
    timeCount = setInterval(function(){
        costTime.innerHTML = parseInt((new Date()-startTime)/1000);
    
    },1000);
    listener();
}

init();
start.addEventListener('click',startGame);

//游戏结束
function end(){
    tds=[];
    landMineNum = 0;
    mines=[];
    flagCount = 0;
    stepCount = 0;
    startTime = 0;
    endTime = 0;
    init();
}



//计时






