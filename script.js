
class Deque {
    constructor() {
        this.front = this.back = undefined;
        this.size = 0;
    }
    push_front(value) {
        if (!this.front) this.front = this.back = { value };
        else this.front = this.front.next = { value, prev: this.front };
        this.size++;
    }
    pop_front() {
        let value = this.get_front();
        if (this.front === this.back) this.front = this.back = undefined;
        else (this.front = this.front.prev).next = undefined;
        this.size--;
        return value;
    }
    get_front() { 
        return this.front && this.front.value;
    }
    push_back(value) {
        if (!this.front) this.front = this.back = { value };
        else this.back = this.back.prev = { value, next: this.back };
        this.size++;
    }
    pop_back() {
        let value = this.get_back();
        if (this.front === this.back) this.front = this.back = undefined;
        else (this.back = this.back.next).back = undefined;
        this.size--;
        return value;
    }
    get_back() { 
        return this.back && this.back.value;
    }
    get(){
        let snake2 = new Deque;
        let snake_val = "";
        snake_val +=snake.length()+" -> ";
        while(this.length()){
            let temp=this.pop_front();
            snake2.push_back(temp);
            snake_val +="("+temp[0]+","+temp[1]+") ";
        }
        console.log(snake_val);
        return snake2;
    }
    length(){
    	return this.size;
    }
}

var totalRows = 30;
var totalCols = 50;
var cellsToAnimate = [];
var total_score = 0;
running = true;

var snake = new Deque;
var operation = [0,-1];
var egg = [];
document.onkeydown = checkKey;


function updateResults(duration, pathFound, status){
    var firstAnimation = "swashOut";
    var secondAnimation = "swashIn";
    $("#results").removeClass();
    if(!pathFound){
        setTimeout(function(){ 
            $("#resultsIcon").removeClass();
            $('#results').css("background-color", "#ff6961");
            $("#resultsIcon").addClass("fas fa-times");
            $("#duration").text("Total Score: " + duration + " Points");
        },0);
    }
    else{
        $("#results").addClass("magictime " + firstAnimation); 
        setTimeout(function(){ 
            $("#resultsIcon").removeClass();
            $('#results').css("background-color", "#77dd77");
            $("#resultsIcon").addClass("fas fa-check");
            $("#duration").text(status + "Total Score: " + duration + " Points");
            $('#results').removeClass(firstAnimation);
            $('#results').addClass(secondAnimation); 
        },0);
    }
}

function generateGrid( rows, cols ) {
    var grid = "<table>";
    for ( row = 1; row <= totalRows; row++ ) {
        grid += "<tr>"; 
        for ( col = 1; col <= totalCols; col++ ) {      
            grid += "<td></td>";
        }
        grid += "</tr>"; 
    }
    grid += "</table>"
    return grid;
}

$( "#maze" ).append(generateGrid());

async function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38' && operation[0]==0) {
        operation = [-1,0];
    }
    else if (e.keyCode == '40' && operation[0]==0) {
        operation = [1,0];
    }
    else if (e.keyCode == '37' && operation[1]==0) {
        operation = [0,-1];
    }
    else if (e.keyCode == '39' && operation[1]==0) {
        operation = [0,1];
    }
}

function placeEgg(){
	egg = [Math.floor(Math.random() * totalRows),Math.floor(Math.random() * totalCols)];
	cellsToAnimate.push([[egg[0],egg[1]],"egg"]);
}

function chk_egg() {
	let head = snake.get_front();
	if(head[0]==egg[0] && head[1]==egg[1]){
		grow_snake();
		cellsToAnimate.push([[egg[0],egg[1]],""]);
        total_score++;
		placeEgg();
	}
}

function chk_end(){
    let snake2 = new Deque;
    let head = snake.pop_front();
    let flag=1;
    snake2.push_back(head);
    while(snake.length()){
        let temp=snake.pop_front();
        snake2.push_back(temp);
        if(temp[0]==head[0] && temp[1]==head[1])
            end_game(total_score,1,"!!! Game Over !!!    "),flag=0;
    }
    if(flag)
        snake = snake2;
}

function grow_snake(){
    let head = snake.get_front();
    head[0]=(head[0]+operation[0]+totalRows)%totalRows;
    head[1]=(head[1]+operation[1]+totalCols)%totalCols;
    snake.push_front(head);
    cellsToAnimate.push([[head[0], head[1]], "searching"]);
}

function move(){
    var head = snake.get_front();
    let tail = snake.pop_back();
    var new_head = [];
    cellsToAnimate.push([[tail[0],tail[1]],""]);
    if(snake.length())
        cellsToAnimate.push([[head[0],head[1]],"searching"]);
    new_head[0]=(head[0]+operation[0]+totalRows)%totalRows;
    new_head[1]=(head[1]+operation[1]+totalCols)%totalCols;
    snake.push_front(new_head);
    cellsToAnimate.push([[new_head[0], new_head[1]], "visited"]);
}

async function run(){
    let i=0;
	while(++i && running){
        updateResults(total_score,0,"");
		chk_egg();
		move();
        chk_end();
		await animateCells();
	    await new Promise(resolve => setTimeout(resolve,200));
	}
}

$( "#startBtn" ).click(async function(){
    end_game(total_score,1,"Starting Game !! ");
    await new Promise(resolve => setTimeout(resolve,2000));
    running = true;
    total_score = 0;
    snake.push_front([15,25]);
    cellsToAnimate.push([[15,25],"searching"]);
	placeEgg();
	run();
});

$( "#endGame" ).click(function(){
    end_game(total_score,1,"Game Terminated  ");
});

async function end_game(score,isfinished,status){
    updateResults(score,isfinished,status);
    for(i=0;i<totalRows;i++)
        for(j=0;j<totalCols;j++)
            cellsToAnimate.push([[i,j],""]);

    snake = new Deque;
    running = false;
    egg = [];
    animateCells();
    console.log("End Game");
}

async function animateCells(){
	animationState = null;
	var cells = $("#maze").find("td");
	for (var i = 0; i < cellsToAnimate.length; i++){
		var cellCoordinates = cellsToAnimate[i][0];
		var x = cellCoordinates[0];
		var y = cellCoordinates[1];
		var num = (x * (totalCols)) + y;
		var cell = cells[num];
		var colorClass = cellsToAnimate[i][1];

		$(cell).removeClass();
		$(cell).addClass(colorClass);
	}
	cellsToAnimate = [];
	return new Promise(resolve => resolve(true));
}
