function load_images(){
// player , virus , gem
enemy_image=new Image;
enemy_image.src="assets/v2.png";


player_image=new Image;
player_image.src="assets/superman.png";

gem_image=new Image;
gem_image.src="assets/gemm.png";


}


function init(){
// define objects in the game
canvas=document.getElementById("mycanvas");
console.log(canvas);
W=700;
H=400;
canvas.width=W;
canvas.height=H;
// create a pen which will draw objects
pen=canvas.getContext('2d');
console.log(pen);
game_over=false;
e1 = {
    x:150,
    y:50,
    w:60,
    h:60,
    speed:20,

}
e2 = {
    x:320,
    y:150,
    w:60,
    h:60,
    speed:30,

}
e3 = {
    x:500,
    y:20,
    w:60,
    h:60,
    speed:40,

}
player= {
    x:20,
    y:H/2,
    w:60,
    h:60,
    speed:20,
    moving:false,
    health:100,

}

gem= {
    x:W-100,
    y:H/2,
    w:60,
    h:60,

}

//listen to events on the scanner 
canvas.addEventListener('mousedown',function(){console.log("Mouse Pressed");
player.moving=true;
});

canvas.addEventListener('mouseup',function(){console.log("Mouse Released");
player.moving=false;
});

enemy =[e1,e2,e3];

}
function isOverlap(rect1,rect2){

    if (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y) 
        {return true}
     return false;
}






function draw(){

// CLEAR THE CANVAS AREA FOR THE OLD FRAME
    pen.clearRect(0,0,W,H);

pen.fillStyle="RED" // CAPITAL OR SMALL DOES NOT MATTER
//pen.fillRect(box.x,box.y,box.w,box.h);
//pen.drawImage(enemy_image,box.x,box.y,box.w,box.h);

// DRAW THE GEM AND DRAW THE PLAYER

pen.drawImage(player_image,player.x,player.y,player.w,player.h);
pen.drawImage(gem_image,gem.x,gem.y,gem.w,gem.h);

for(let i=0;i<enemy.length;i++)
{
    pen.drawImage(enemy_image,enemy[i].x,enemy[i].y,enemy[i].w,enemy[i].h);
}
pen.fillStyle="white";
pen.fillText("SCORE"+player.health,10,10);
}






function update(){
// MOVE THE BOX DOWNWARDS
//box.y=box.y+box.speed;

//below three statements just like others is commented because now there is an array of enemies not a single box so we need a loop
//if(box.y>H-box.h||box.y<0){
//    box.speed=box.speed*-1;
//}



for(let i=0;i<enemy.length;i++)
{
    if (
        isOverlap(enemy[i],player)){player.health-=50;
        if(player.health<0)
        {
            console.log(player.health);
            game_over=true;
            alert("GAME OVER"+String(player.health));
        }
        }
}

// CHECK IF OVERLAP

if(isOverlap(player,gem))
 {   
     console.log("YOU WON THE GAME ");
     alert("YOU WON !!!!");
     game_over =true;
     return;

 }


//if the player is moving
if(player.moving==true)
{
    player.x=player.x+player.speed;
    player.health+=20;
}




for(let i=0;i<enemy.length;i++)
    {
        enemy[i].y=enemy[i].y+enemy[i].speed;
        if(enemy[i].y>H-enemy[i].h || enemy[i].y<0)
        {
            enemy[i].speed *=-1;
        }
    }
}
function gameloop(){
    if(game_over==true)
    {
        clearInterval(f);
    }
  draw();
  update();
  console.log("IN GAME LOOP");



} 
load_images();
init();
var f=setInterval(gameloop,100);
 // above three statements are standard procedure in game like these you load game images , initialise your objects and then enter your game loop which will call your funtions until gamme is over
