let collisionSound, winSound, moveSound, gemAnimationFrame = 0;

function load_images() {
    // Load images
    enemy_image = new Image();
    enemy_image.src = "assets/v2.png";

    player_image = new Image();
    player_image.src = "assets/superman.png";

    gem_image = new Image();
    gem_image.src = "assets/gemm.png";

    // Load sound effects
    collisionSound = new Audio('assets/collision.mp3');
    winSound = new Audio('assets/win.mp3');
    moveSound = new Audio('assets/move.mp3');
    moveSound.volume = 0.3;  // Subtle movement sound
}

function init() {
    // Increase canvas size
    canvas = document.getElementById("mycanvas");
    W = 900;  // Increased width
    H = 500;  // Increased height
    canvas.width = W;
    canvas.height = H;

    pen = canvas.getContext('2d');
    game_over = false;

    // Enemy objects with adjusted speed for e3
    e1 = { x: 150, y: 50, w: 60, h: 60, speed: 20 };
    e2 = { x: 320, y: 150, w: 60, h: 60, speed: 30 };
    e3 = { x: 500, y: 20, w: 60, h: 60, speed: 20 };  // Reduced speed for e3

    // Player with increased speed
    player = { x: 20, y: H / 2, w: 60, h: 60, speed: 10, movingRight: false, movingLeft: false, health: 100 };  // Increased speed

    gem = { x: W - 100, y: H / 2, w: 60, h: 60 };

    // Keyboard events for continuous movement (left and right)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'd') {
            player.movingRight = true;
        } else if (e.key === 'ArrowLeft' || e.key === 'a') {
            player.movingLeft = true;
        }
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'd') {
            player.movingRight = false;
        } else if (e.key === 'ArrowLeft' || e.key === 'a') {
            player.movingLeft = false;
        }
    });

    enemy = [e1, e2, e3];
}

function isOverlap(rect1, rect2) {
    return (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y);
}

function draw() {
    pen.clearRect(0, 0, W, H);  // Clear canvas

    // Draw gem with simple animation (scaling effect)
    let gemScale = 1 + 0.1 * Math.sin(gemAnimationFrame / 10);
    pen.drawImage(gem_image, gem.x, gem.y, gem.w * gemScale, gem.h * gemScale);
    gemAnimationFrame++;

    // Draw player
    pen.shadowColor = "rgba(0, 0, 0, 0.5)";
    pen.shadowBlur = 10;
    pen.drawImage(player_image, player.x, player.y, player.w, player.h);

    // Draw enemies
    for (let i = 0; i < enemy.length; i++) {
        pen.shadowBlur = 20;
        pen.drawImage(enemy_image, enemy[i].x, enemy[i].y, enemy[i].w, enemy[i].h);
    }

    // Draw player's health bar
    pen.shadowBlur = 0;  // Disable shadow for health bar
    pen.fillStyle = "rgba(0, 255, 0, 0.7)";
    pen.fillRect(10, 40, player.health, 10);

    // Draw health score
    pen.font = "20px Arial";
    pen.fillStyle = "white";
    pen.fillText("Health: " + player.health, 10, 30);
}

function update() {
    // Player movement
    if (player.movingRight) {
        player.x += player.speed;
        if (player.x + player.w > W) {
            player.x = W - player.w;
        }
        moveSound.play();
    }

    if (player.movingLeft) {
        player.x -= player.speed;
        if (player.x < 0) {
            player.x = 0;
        }
        moveSound.play();
    }

    // Collision with enemies
    for (let i = 0; i < enemy.length; i++) {
        if (isOverlap(enemy[i], player)) {
            if (player.health > 0) {
                player.health -= 50;
                collisionSound.play();
                if (player.health <= 0) {
                    game_over = true;
                    break;
                }
            }
        }
    }

    // Winning condition
    if (isOverlap(player, gem)) {
        winSound.play();
        game_over = true;
        setTimeout(() => {
            // Trigger confetti animation
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }, 500);
    }

    // Move enemies
    for (let i = 0; i < enemy.length; i++) {
        enemy[i].y += enemy[i].speed;
        if (enemy[i].y > H - enemy[i].h || enemy[i].y < 0) {
            enemy[i].speed *= -1;
        }
    }
}

function gameloop() {
    if (game_over) {
        // Display game over or victory screen
        pen.clearRect(0, 0, W, H);
        pen.font = "30px Arial";
        pen.fillStyle = "red";

        if (player.health <= 0) {
            pen.fillText("Game Over! You Lost!", W / 2 - 100, H / 2);
        } else {
            pen.fillText("Congratulations! You Won!", W / 2 - 150, H / 2);
        }

        document.getElementById("playAgainBtn").style.display = "inline-block";  // Show play again button
        clearInterval(f);  // Stop the game loop
        return;
    }

    update();
    draw();
}

function restartGame() {
    location.reload();  // Reload the page to restart the game
}

load_images();
init();
let f = setInterval(gameloop, 50);  // Higher frame rate for smoother gameplay
