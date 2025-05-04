const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "Passarinho pixelado.png";

const blocoImg = new Image();
blocoImg.src = "Bloco.png";

let gravity = 0.5;
let lift = -12;
let velocity = 0;

let player = {
  x: 50,
  y: 200,
  width: 64,
  height: 64
};

let blocos = [];
let frame = 0;
const gap = 200; // BURACO MAIOR

function jump() {
  velocity = lift;
}

// Suporte a teclado, clique e toque (PC e celular)
document.addEventListener("keydown", jump);
canvas.addEventListener("mousedown", jump);
canvas.addEventListener("touchstart", function (e) {
  e.preventDefault();
  jump();
});

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawBlocos() {
  blocos.forEach(bloco => {
    ctx.drawImage(blocoImg, bloco.x, bloco.topY, bloco.width, bloco.height);
    ctx.drawImage(blocoImg, bloco.x, bloco.bottomY, bloco.width, bloco.height);
  });
}

function updateBlocos() {
  if (frame % 90 === 0) {
    const maxTop = canvas.height - gap - 100; // Evita ultrapassar limite
    let topHeight = Math.floor(Math.random() * maxTop) + 20;
    let bottomY = topHeight + gap;

    blocos.push({
      x: canvas.width,
      topY: 0,
      bottomY: bottomY,
      width: 64,
      height: 400 // altura do sprite real
    });
  }

  blocos.forEach(bloco => {
    bloco.x -= 2;
  });

  blocos = blocos.filter(bloco => bloco.x + bloco.width > 0);
}

function checkCollision() {
  for (let bloco of blocos) {
    let shrink = 12; // Hitbox menor (encolhe 12px de cada lado)

    let px = player.x + shrink;
    let py = player.y + shrink;
    let pw = player.width - shrink * 2;
    let ph = player.height - shrink * 2;

    let collidesTop = px < bloco.x + bloco.width &&
                      px + pw > bloco.x &&
                      py < bloco.topY + bloco.height;

    let collidesBottom = px < bloco.x + bloco.width &&
                         px + pw > bloco.x &&
                         py + ph > bloco.bottomY;

    if (collidesTop || collidesBottom || player.y > canvas.height || player.y < 0) {
      resetGame();
    }
  }
}

function resetGame() {
  player.y = 200;
  velocity = 0;
  blocos = [];
  frame = 0;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawBlocos();
  updateBlocos();
  checkCollision();

  velocity += gravity;
  player.y += velocity;

  frame++;
  requestAnimationFrame(gameLoop);
}

playerImg.onload = () => {
  gameLoop();
};
