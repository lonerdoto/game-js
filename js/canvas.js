const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight ;

const getTime = typeof performance === 'function' ? performance.now : Date.now;
const FRAME_THRESHOLD = 300;
const FRAME_DURATION = 1000 / 58;
let then = getTime();
let acc = 0;
let animation;
let gameLoop;

const particle = {
    decrease: 0.05,
    highestAlpha: 0.8,
    highestRadius: 5,
    highestSpeedX: 5,
    highestSpeedY: 5,
    lowestAlpha: 0.4,
    lowestRadius: 2,
    lowestSpeedX: -5,
    lowestSpeedY: -5,
    total: 100
};

const particles = [];




const label = {
    font: '24px Monsterrat',
    color: '#FFFFF',
  margin: 30,
  left: 20,
  right: canvas.width - 290
};

const addPause = () => {
  document.addEventListener('keyup', e => {
    if (e.keyCode === 80) {
      if (animation === undefined) {
        animation = window.requestAnimationFrame(gameLoop);
      } else {
        window.cancelAnimationFrame(animation);
        animation = undefined;
      }
    }
  });
};

const addResize = () => {
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
};

const loop = gameLogic => {
  const now = getTime();
  const ms = now - then;
  let frames = 0;
  then = now;
  if (ms < FRAME_THRESHOLD) {
    acc += ms;
    while (acc >= FRAME_DURATION) {
      frames++;
      acc -= FRAME_DURATION;
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameLogic(frames);
  if (gameLoop === undefined) {
    gameLoop = () => {
      loop(gameLogic);
    };
  }
  animation = window.requestAnimationFrame(gameLoop);
};

const drawCircle = (x, y, radius) => {
  ctx.moveTo(x, y);
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
};

const paintCircle = (x, y, radius, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  drawCircle(x, y, radius);
  ctx.fill();
};

const drawLine = (x1, y1, x2, y2) => {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
};

const paintLine = (x1, y1, x2, y2, color) => {
  ctx.strokeStyle = color;
  ctx.beginPath();
  drawLine(x1, y1, x2, y2);
  ctx.stroke();
};

const drawRoundRect = (x, y, width, height, arcX, arcY) => {
  ctx.moveTo(x + arcX, y);
  ctx.lineTo(x + width - arcX, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + arcY);
  ctx.lineTo(x + width, y + height - arcY);
  ctx.quadraticCurveTo(x + width, y + height, x + width - arcX, y + height);
  ctx.lineTo(x + arcX, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - arcY);
  ctx.lineTo(x, y + arcY);
  ctx.quadraticCurveTo(x, y, x + arcX, y);
};

const paintRoundRect = (x, y, width, height, arcX, arcY, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  drawRoundRect(x, y, width, height, arcX, arcY);
  ctx.fill();
};


const isIntersectingCircle = (rect, width, height, circle, radius) => {
  const distX = Math.abs(circle.x - rect.x - width / 2);
  const distY = Math.abs(circle.y - rect.y - height / 2);
  if (distX > (width / 2 + radius) || distY > (height / 2 + radius)) {
    return false;
  }
  if (distX <= (width / 2) || distY <= (height / 2)) {
    return true;
  }
  const dX = distX - width / 2;
  const dY = distY - height / 2;
  return dX ** 2 + dY ** 2 <= radius ** 2;
};

const getDistance = (p1, p2) => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

const generateRandomNumber = (min, max) => {
  return min + Math.random() * (max - min);
};

const generateRandomInteger = (range, out) => {
  return Math.floor(Math.random()* (range - out) + out);
};

const generateRandomRgbColor = () => {
  return [generateRandomInteger(255, 150), generateRandomInteger(255, 150), generateRandomInteger(255, 150)];
};

const generateRandomCharCode = (caseSensitive) => {
  const codes = [];
  if (caseSensitive) {
    for (let i = 0; i < 31; i++) {
      codes.push(1040 + i);
    }
  }
  for (let i = 0; i < 31; i++) {
    codes.push(1072 + i);
  }
  return codes[generateRandomInteger(codes.length, 0)];
};



const paintParticles = () => {
    for (const p of particles) {
        paintCircle(p.x, p.y, p.radius, p.color);
    }
};

const createParticles = (x, y) => {
    for (let i = 0; i < particle.total; i++) {
    const c = generateRandomRgbColor();
    const alpha = generateRandomNumber(particle.lowestAlpha, particle.highestAlpha);
    particles.push({
        x,
        y,
        radius: generateRandomNumber(particle.lowestRadius, particle.highestRadius),
        color: `rgba(${c[0]}, ${c[1]}, ${c[2]})`,
        speedX: generateRandomNumber(particle.lowestSpeedX, particle.highestSpeedX),
        speedY: generateRandomNumber(particle.lowestSpeedY, particle.highestSpeedY)
    });
    }
};

const processParticles = frames => {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX * frames;
        p.y += p.speedY * frames;
        p.radius -= particle.decrease;
        if (p.radius <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
            particles.splice(i, 1);
    }
    }
};