
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

var snake = new Deque;
snake.push_front([11,29]);
snake.push_front([11,28]);
cellsToAnimate.push([[11,28],"searching"]);
cellsToAnimate.push([[11,29],"searching"]);
var operation = [0,-1];
var egg = [];
document.onkeydown = checkKey;

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

    if (e.keyCode == '38') {
        operation = [-1,0];
        console.log("up key pressed");
    }
    else if (e.keyCode == '40') {
        operation = [1,0];
        console.log("down key pressed");
    }
    else if (e.keyCode == '37') {
        operation = [0,-1];
        console.log("left key pressed");
    }
    else if (e.keyCode == '39') {
        operation = [0,1];
        console.log("right key pressed");
    }
}

function placeEgg(){
	egg = [Math.floor(Math.random() * totalRows),Math.floor(Math.random() * totalCols)];
	cellsToAnimate.push([[egg[0],egg[1]],"egg"]);
}

function chk() {
	let head = snake.get_front();
	if(head[0]==egg[0] && head[1]==egg[1]){
		console.log("chk - true");
		grow_snake();
		cellsToAnimate.push([[egg[0],egg[1]],""]);
		placeEgg();
	}
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
    new_head[0]=(head[0]+operation[0]+totalRows)%totalRows;
    new_head[1]=(head[1]+operation[1]+totalCols)%totalCols;
    snake.push_front(new_head);
    cellsToAnimate.push([[head[0], head[1]], "searching"]);
}

async function run(){
	while(1){
		move();
		chk();
		await animateCells();
		await new Promise(resolve => setTimeout(resolve,200));
	}
}

$( "#startBtn" ).click(function(){
	placeEgg();
	run();
});

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
