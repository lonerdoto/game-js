let score = 0;
let lives = 3;
let caseSensitive = true;

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 30,
  color: '#FF7408'
};

const letter = {
  font: '25px Monospace',
  color: '#ffcc00',
  width: 15,
  height: 20,
  highestSpeed: 1.6,
  lowestSpeed: 0.6,
  probability: 0.02
};

let letters = [];

ctx.font = label.font;
letter.width = ctx.measureText('0').width;

document.addEventListener('keyup', keyUpHandler);
document.addEventListener('keydown', keyDownHandler);
window.addEventListener('resize', resizeHandler);
loop(function (frames) {
  paintCircle(center.x, center.y, center.radius, center.color);
  ctx.font = letter.font;
  ctx.fillStyle = letter.color;
  for (const l of letters) {
    ctx.fillText(String.fromCharCode(l.code), l.x, l.y);
  }
  paintParticles();
  ctx.font = label.font;
  ctx.fillStyle = label.color;
  ctx.fillText('Счёт: ' + score, label.left, label.margin);
  ctx.fillText('Осталось жизней: ' + lives, label.right, label.margin);
  ctx.fillText('Нажимай как можно быстрее на те буквы на клавиатуре, что видишь!', label.right - 1100, label.margin + 40);
  ctx.fillText('На клавиатуре должна быть включена кириллица!', label.right - 960, label.margin + 70);
  ctx.fillText('И да, они чувствительны к регистру, поэтому большие буквы нужно нажимать через Shift!', label.right - 1250, label.margin + 100);
  ctx.fillText('Пауза: ESC', label.right - 700, label.margin);
  processParticles(frames);
  createLetters();
  removeLetters(frames);
});


function createLetters () {
  if (Math.random() < letter.probability) {
    const x = Math.random() < 0.5 ? 0 : canvas.width;
    const y = Math.random() * canvas.height;
    const dX = center.x - x;
    const dY = center.y - y;
    const norm = Math.sqrt(dX ** 2 + dY ** 2);
    const speed = generateRandomNumber(letter.lowestSpeed, letter.highestSpeed);
    letters.push({
      x,
      y,
      code: generateRandomCharCode(caseSensitive),
      speedX: dX / norm * speed,
      speedY: dY / norm * speed
    });
  }
}
// function gameOver () {
//   const audio = new Audio('audio/game-over.mp3');
//   audio.preload = true;
//   audio.play();
// }

function removeLetters (frames) {
  for (const l of letters) {
    if (isIntersectingCircle({ x: l.x, y: l.y - letter.height }, letter.width, letter.height, center, center.radius)) {
      // gameOver();
      if (--lives === 0) {
        window.alert(`Игра окончена! Вы набрали ${score} очков.`);
        // newGame();
        window.location.reload(false);

      } else if (lives > 0) {


        window.alert('Начни заново!');
        restart();
        letters = [];
      }
      break;
    } else {
      l.x += l.speedX * frames;
      l.y += l.speedY * frames;
    }
  }
}

const scoreUp = () => {
  const audio = new Audio('audio/score-up.mp3'),
  audio2 = new Audio('audio/score-up2.mp3'),
  audio3 = new Audio('audio/score-up3.mp3');
  let wpAudio = generateRandomInteger(4, 1);
  if (wpAudio == 1) {
    audio.play();
  } else if (wpAudio == 2) {
    audio2.play();
  } else {
    audio3.play();
  }
}

const scoreDown = () => {
  const audio = new Audio('audio/score-down.mp3'),
  audio2 = new Audio('audio/score-down2.mp3'),
  audio3 = new Audio('audio/score-down3.mp3');
  let wpAudio = generateRandomInteger(4, 1);
  if (wpAudio == 1) {
    audio.play();
  } else if (wpAudio == 2) {
    audio2.play();
  } else {
    audio3.play();
  }
}

const pauseMenu = () => {
  const audio = new Audio('audio/pause.mp3');
  audio.play();
}

const restart = () => {
  const audio = new Audio('audio/restart.mp3');
  audio.play();
}

// const newGame = () => {
//   const audio = new Audio('audio/new-game.mp3');
//   audio.play();
// }



function type (i, l) {
  letters.splice(i, 1);
  score++;
  scoreUp();
  createParticles(l.x, l.y);
}





function keyDownHandler (e) {
  if (animation !== undefined && e.key.charCodeAt(0) >= 1040 && e.key.charCodeAt(0) <= 1103 ) {
    for (let i = letters.length - 1; i >= 0; i--) {
      
      const l = letters[i];
        if (e.shiftKey) {
          if (e.key.charCodeAt(0) == l.code) {
            type(i, l);
            return;
          }
        } else if (!e.shiftKey) {
          if (e.key.charCodeAt(0) == l.code) {
            type(i, l);
            return;
          }
        }

    }
    score--;
    scoreDown();
  }
}


function keyUpHandler (e) {
  if (e.keyCode === 27) {
    if (animation === undefined) {
      animation = window.requestAnimationFrame(gameLoop);
    } else {
      pauseMenu();
      window.cancelAnimationFrame(animation);
      animation = undefined;
    }
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
}
