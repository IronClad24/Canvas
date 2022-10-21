const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.height =500;
canvas.width =500;



let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownhandler);
document.addEventListener("keyup", keyUphandler);


function keyDownhandler(e) {
    if (e.key == "right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    };
}


function keyUphandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
         rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

let score = 0;

function drawScore(){
    ctx.font = '16px Arial';
    ctx.fillStyle = '#230c33';
    ctx.fillText("Score: " + score, 8, 20);
}

function movePaddle() {
    if (rightPressed) {
        paddle.x += 7;
        if(paddle.x + paddle.width >= canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }
    }else if (leftPressed) {
        paddle.x -= 7;
        if(paddle.x < 0) {
            paddle.x = 0;
        }
    } 
}

let speed = 3;

let ball ={
    x: canvas.width / 2,
    y: canvas.height - 50,
    dx: speed,
    dy: -speed + 1,
    radius: 7,
    draw: function(){
        ctx.beginPath();
        ctx.fillStyle = "#230c33";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2, true);
        ctx.closePath();
        ctx.fill();
    }
};

let paddle = {
    height: 10,
    width: 76,
    x: canvas.width / 2 - 76 / 2,
    draw: function(){
        ctx.beginPath();
        ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
        ctx.fillStyle = "#230c33";
        ctx.closePath();
        ctx.fill(); 
    }
};

const scoreDisplay = document.querySelector(".high-score");
function play(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    paddle.draw();
    drawBricks();
    drawScore();
    movePaddle();
    levelUp();
    collisionDetection();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }
      // reset
      /*if(ball.x + ball.radius > canvas.height){
        if(score > parseInt(localStorage.getItem('highScore'))){
          localStorage.setItem('highScore', score.toString());
          scoreDisplay.innerHtml = `High Score: ${score}`  
        }

        score = 0;
        generateBricks();
        ball.dx = speed;
        ball.dy = -speed + 1;

      }*/
     
     
     
      //Bounce of paddle
    if(ball.x >= paddle.x && 
        ball.x <= paddle.x + paddle.width &&
        ball.y + ball.radius >= canvas.height - paddle.height 
        ) {
            ball.dy *= -1;
            console.log("hit");
        }
    

    requestAnimationFrame(play);
}



let brickRowCount = 5;
let brickColumnCount = 3;
let brickWidth = 70;
let brickHeight = 20;
let brickPadding =20;
let brickOffsetTop = 30;
let brickOffsetLeft = 35;

let bricks =[];

function generateBricks() {
    for (let c = 0; c < brickRowCount; c++) {
        bricks.push([]) ;
        for ( let r = 0; r < brickColumnCount; r++) {
            bricks[c].push([]);
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function drawBricks() {
    for (let c = 0; c < brickRowCount; c++) {
        for (let r = 0; r < brickColumnCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#230c33";
                ctx.fill();
                ctx.closePath();    
            }
        }
    }
}


function collisionDetection(){
    for (let c = 0; c < brickRowCount; c++ ){
        for (let r = 0; r < brickColumnCount; r++){
            let b = bricks[c][r];
            if (ball.x >= b.x && 
                 ball.x <= b.x + brickWidth &&
                 ball.y >= b.y &&
                 ball.y <= b.y + brickHeight &&
                 b.status == 1){
                    ball.dy *= -1;
                    b.status = 0;
                    score++
                }
        }
    }
}

let gameLevelUp = true;


function levelUp(){
    if (score % 15 == 0 && score !=0){
        if(ball.y > canvas.height / 2) {
            generateBricks();
        }

        if(gameLevelUp){
            if(ball.dy > 0) {
                ball.dy += 1;
                gameLevelUp = false;
            } else if (ball.dy < 0) {
                ball.dy -= 1;
                gameLevelUp = false;
            }
            if(score % 15 != 0) {
                gameLevelUp = true;
            }
        }
    }
}
console.log(bricks);

generateBricks();
play();