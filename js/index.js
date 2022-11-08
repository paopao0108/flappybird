var blocks = document.querySelectorAll('.block');
var holes = document.querySelectorAll('.hole');
var bird = document.querySelector('.bird');
var startBtn = document.querySelector('.start');
var counter = 0; // 计数器
var jumpCount = 0;

/**
 * @description: 碰撞检测
 */
function isCrash() {
  // 1. 角色接触地面
  // 2. 角色碰撞障碍物: 水平方向上 用 block 判断, 垂直方向上 用 hole 判断
  let birdLeft = parseInt(window.getComputedStyle(bird).getPropertyValue('left'));
  let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue('top'));
  if (birdTop > 480) {
    return true;
  }

  let curIndex = counter % 3;
  let blockLeft = parseInt(window.getComputedStyle(blocks[curIndex]).getPropertyValue('left'));
  let holeTop = parseInt(window.getComputedStyle(holes[curIndex]).getPropertyValue('top'));
  if (birdLeft > blockLeft - 20 && birdLeft < blockLeft + 150 && (birdTop < holeTop || birdTop > holeTop + 130)) {
    return true;
  }
  return false;
}

/**
 * @description: 失败后的处理
 */
function lose() {
  blocks.forEach(block => block.classList.remove('move'));
  alert('Game Over, Score: ' + counter);
  counter = 0;
  startBtn.classList.remove('hidden');
  bird.style.top = 250 + 'px';
}

/**
 * @description: 鼠标点击触发的jump操作
 */
function birdJump() {
  let jumpInterval = setInterval(function () {
    let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue('top'));
    bird.style.top = parseInt(birdTop) - 5 + 'px';
    jumpCount++; // 用于限制jump的次数
    if (jumpCount > 20) {
      clearInterval(jumpInterval);
      jumpCount = 0;
    }
  }, 10);
}

/**
 * @description: 监听动画开始的事件
 */
blocks.forEach((block, i) => {
  block.addEventListener('animationiteration', function () {
    // 监听到动画重新开始时，需要更改 hole 的位置
    holes[i].style.top = Math.random() * 350 + 'px';
    counter++;
  });
});

// 开始按钮 ----> 角色下落 ----> 下落过程需要判断是否失败
startBtn.addEventListener('click', function () {
  this.classList.add('hidden');
  blocks.forEach((block, i) => block.classList.add('move'));
  // 模拟角色默认的自由落体
  let downInterval = setInterval(function () {
    let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue('top'));
    bird.style.top = birdTop + 2 + 'px';
    if (isCrash()) {
      clearInterval(downInterval);
      lose();
    }
  }, 10);
});
