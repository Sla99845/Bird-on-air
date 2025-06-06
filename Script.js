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
const gap = 200; // <- buraco aumentado aqui

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawBlocos() {
  for (let i = 0; i < blocos.length; i++) {
    let b = blocos[i];

    let bottomY = b.y + b.height + gap;
    let bottomHeight = canvas.height - bottomY;

    // Parte de cima
    ctx.drawImage(blocoImg, b.x, b.y, 64, b.height);
    // Parte de baixo
    ctx.drawImage(blocoImg, b.x, bottomY, 64, bottomHeight);

    b.x -= 2;

    // Hitbox reduzida do jogador
    let hitbox = {
      x: player.x + 10,
      y: player.y + 10,
      width: player.width - 20,
      height: player.height - 20
    };

    // Colisão com a parte de cima
    let colideCima = hitbox.x < b.x + 64 &&
                     hitbox.x + hitbox.width > b.x &&
                     hitbox.y < b.y + b.height;

    // Colisão com a parte de baixo
    let colideBaixo = hitbox.x < b.x + 64 &&
                      hitbox.x + hitbox.width > b.x &&
                      hitbox.y + hitbox.height > bottomY;

    if (colideCima || colideBaixo) {
      resetGame();
    }

    if (b.x + 64 < 0) {
      blocos.splice(i, 1);
      i--;
    }
  }

  if (frame % 90 === 0) {
    let height = Math.floor(Math.random() * 200) + 50;
    blocos.push({ x: canvas.width, y: 0, height: height });
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  velocity += gravity;
  player.y += velocity;

  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    resetGame();
  }

  if (player.y < 0) {
    player.y = 0;
    velocity = 0;
  }

  drawPlayer();
  drawBlocos();

  frame++;
  requestAnimationFrame(update);
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    velocity = lift;
  }
});

function resetGame() {
  player.y = 200;
  velocity = 0;
  blocos = [];
  frame = 0;
}

// Inicia o jogo após carregar imagens
playerImg.onload = () => {
  blocoImg.onload = () => {
    update();
  };
};
