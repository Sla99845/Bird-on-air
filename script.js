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
const gap = 220; // Buraco aumentado

// Função de pulo
function jump() {
  velocity = lift;
}

document.addEventListener("keydown", jump);
canvas.addEventListener("mousedown", jump); // Suporte para celular
canvas.addEventListener("touchstart", jump); // Suporte para toque

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
    let topHeight = Math.floor(Math.random() * 200) + 50;
    let bottomY = topHeight + gap;

    blocos.push({
      x: canvas.width,
      topY: 0,
      bottomY: bottomY,
      width: 64,
      height: canvas.height,
    });
  }

  blocos.forEach(bloco => {
    bloco.x -= 2;
  });

  // Remover blocos fora da tela
  blocos = blocos.filter(bloco => bloco.x + bloco.width > 0);
}

function checkCollision() {
  for (let bloco of blocos) {
    let hitboxShrink = 12; // Reduz a hitbox

    let pX = player.x + hitboxShrink;
    let pY = player.y + hitboxShrink;
    let pW = player.width - hitboxShrink * 2;
    let pH = player.height - hitboxShrink * 2;

    if (
      pX < bloco.x + bloco.width &&
      pX + pW > bloco.x &&
      (
        pY < bloco.topY + bloco.height ||
        pY + pH > bloco.bottomY
      )
    ) {
      // Colidiu
      resetGame();
    }
  }

  // Fora dos limites
  if (player.y > canvas.height || player.y < 0) {
    resetGame();
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

// Iniciar jogo
playerImg.onload = () => {
  gameLoop();
};
