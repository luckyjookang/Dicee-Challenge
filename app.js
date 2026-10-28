const image1 = document.querySelector(".img1");
const image2 = document.querySelector(".img2");
const title = document.querySelector("h1");
const rollDuration = 2000;

function randomDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function showDice(value1, value2) {
  image1.setAttribute("src", "images/dice" + value1 + ".png");
  image2.setAttribute("src", "images/dice" + value2 + ".png");
}

function celebrateWinner(winnerImage) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const winnerBounds = winnerImage.getBoundingClientRect();
  const fireworks = document.createElement("div");
  fireworks.className = "fireworks";
  fireworks.setAttribute("aria-hidden", "true");
  document.body.appendChild(fireworks);

  const colors = ["#FFD166", "#FF6B6B", "#4ECCA3", "#70D6FF", "#FFFFFF"];

  // 첫 폭죽은 승리한 주사위에서, 이후 폭죽은 화면 전체에서 터집니다.
  const positions = [
    [winnerBounds.left + winnerBounds.width / 2, winnerBounds.top + winnerBounds.height / 2],
    ...[[0.15, 0.25], [0.8, 0.3], [0.45, 0.15], [0.25, 0.65], [0.75, 0.7], [0.5, 0.45], [0.9, 0.5]]
      .map(([x, y]) => [window.innerWidth * x, window.innerHeight * y]),
  ];
  const burstRadius = Math.min(window.innerWidth, window.innerHeight) * 0.4;

  for (let burst = 0; burst < positions.length; burst++) {
    for (let i = 0; i < 48; i++) {
      const spark = document.createElement("span");
      const angle = (i / 48) * Math.PI * 2;
      const distance = burstRadius * (0.5 + Math.random() * 0.5);
      spark.className = "firework-spark";
      spark.style.left = positions[burst][0] + "px";
      spark.style.top = positions[burst][1] + "px";
      spark.style.backgroundColor = colors[i % colors.length];
      spark.style.color = colors[i % colors.length];
      spark.style.setProperty("--x", Math.cos(angle) * distance + "px");
      spark.style.setProperty("--y", Math.sin(angle) * distance + "px");
      spark.style.animationDelay = burst * 0.3 + "s";
      fireworks.appendChild(spark);
    }
  }

  setTimeout(() => fireworks.remove(), 4200);
}

let isRolling = false;

const resultParams = new URLSearchParams(window.location.search);

function selectedResult(player) {
  const value = Number(resultParams.get(player));
  return Number.isInteger(value) && value >= 1 && value <= 6 ? value : randomDice();
}

function rollDice(result1, result2) {
  if (isRolling) return;
  isRolling = true;
  document.querySelectorAll(".fireworks").forEach(effect => effect.remove());

  // 주사위 눈을 바꾸면서 2초 동안 회전시킵니다.
  title.textContent = "주사위 굴리는 중...";
  showDice(randomDice(), randomDice());
  image1.classList.add("rolling");
  image2.classList.add("rolling");

  const rollInterval = setInterval(() => {
    showDice(randomDice(), randomDice());
  }, 100);

  setTimeout(() => {
    clearInterval(rollInterval);
    image1.classList.remove("rolling");
    image2.classList.remove("rolling");

    const random1 = result1;
    const random2 = result2;
    showDice(random1, random2);

    if (random1 > random2) {
      title.textContent = "🚩 Player 1 승리!";
      celebrateWinner(image1);
    } else if (random1 < random2) {
      title.textContent = "Player 2 승리! 🚩";
      celebrateWinner(image2);
    } else {
      title.textContent = "무승부!";
    }
    isRolling = false;
  }, rollDuration);
}

rollDice(selectedResult("player1"), selectedResult("player2"));
