#es6实现`俄罗斯方块`
## 目的
* 为熟悉es6增加趣味性
* 提高开发动力
* balabalabala....编不下去了

## 注意
    俄罗斯方块用es6写,无经过babel转es5,示例请用支持es6的chrome
    俄罗斯方块用es6写,无经过babel转es5,示例请用支持es6的chrome.
    俄罗斯方块用es6写,无经过babel转es5,示例请用支持es6的chrome.
    
##实现
### 架构
```bash
.
├── LICENSE
├── README.md
├── favicon.ico
├── index.css
├── index.html
└── index.js
```
### 构思`俄罗斯方块`的形状&规则
* 形状
![俄罗斯方块][1]
每个`方块`都可看作一个二维数组,需要填充的部分为1,留空为0.
* 规则
    * 上方向键 ===> 方块顺时针形变
    * 左方向键 ===> 方块向左移动
    * 右方向键 ===> 方块向右移动
    * 空格键 ===> 方块加速下落
    * 方块掉落自动掉落
    * 方块集齐满一排消除
    * 方块到顶部视为失败
### 需要用到变量
```javascript
constructor(params) {
    //方块矩阵
    this.arr = params.arr;
    //当前方块左,上偏移量
    this.curLeft = params.curLeft;
    this.curTop = params.curTop;
    //下一个落下方块矩阵
    this.nextArr = params.nextArr;
    //方块大小
    this.BLOCK_SIZE = params.BLOCK_SIZE;
    //当前画布大小
    this.siteSize = params.siteSize;
    //历史最高得分
    this.highestScore = params.highestScore;
    //方块下落速度
    this.delay = params.delay;
}
//得分
    window.__score__ = 0;
```
### 掉落方块绘制
   要根据二维数组画出当前掉落`方块`,需要判断二维数组中值为`1`的位置.
* 样式
```
.activityModel {
    border: 1px;
    width: 19px;
    height: 19px;
    background: linear-gradient(70deg, indianred, white);
    position: absolute;
}
```
* js
```javascript
/**
 * 判断数组中值为1的下标
 * @param arr 需要判断的数组
 * @param callback 需要执行的回调函数
 * @param className 作为draw回调函数的参数
 * @param el 作为draw回调函数的参数
 */
checkArrWith1(arr, callback, className, el) {
    for (let i = 0; i <= arr.length - 1; i++) {
        for (let j = 0; j <= arr[0].length - 1; j++) {
            if (arr[i][j] === 1) {
                callback.call(this, i + this.curTop, j + this.curLeft, className, el);
            }
        }
    }
};

/**
 * 画当前方块
 * @param i
 * @param j
 * @param className 创建方块的className
 * @param el 容纳方块的element
 */
draw(i, j, className, el) {
    let left = className === 'nextModel' ? (j + 1) * this.BLOCK_SIZE - (this.siteSize.left + this.siteSize.width / 2 - this.BLOCK_SIZE) : j * this.BLOCK_SIZE;
    let top = className === 'nextModel' ? (i + 1) * this.BLOCK_SIZE - this.siteSize.top : i * this.BLOCK_SIZE;
    let model = document.createElement('div');
    model.className = className;
    model.style.left = `${left}px`;
    model.style.top = `${top}px`;
    el.appendChild(model);
};
```
### 掉落方块形变
```javascript
/**
 * 顺时针旋转矩阵
 * @param arr 需要旋转的矩阵
 * @returns {{newArr: Array, lefts: Array, tops: Array}}
 */
clockwise(arr) {
    let newArr = [];
    for (let i = 0; i < arr[0].length; i++) {
        let temArr = [];
        for (let j = arr.length - 1; j >= 0; j--) {
            temArr.push(arr[j][i]);
        }
        newArr.push(temArr);
    }
    let lefts = [],
        tops = [];
    this.checkArrWith1(newArr, function (i, j) {
        lefts.push(j * this.BLOCK_SIZE);
        tops.push(i * this.BLOCK_SIZE);
    });
    return {
        newArr: newArr,
        lefts: lefts,
        tops: tops
    };
};
```
### 获取方块能位移的边界
```javascript
/**
 * 获取当前方块能到达的边界
 * @param curLeft 当前方块left
 * @param curTop 当前方块top
 * @returns {*} 返回左右下边界
 */
getInterval(curLeft, curTop) {
    let inactiveModel = document.querySelectorAll('.inactiveModel');
    if (inactiveModel.length === 0) {
        return {
            highest: this.siteSize.top + this.siteSize.height,
            leftmost: this.siteSize.left - this.BLOCK_SIZE,
            rightmost: this.siteSize.left + this.siteSize.width
        };
    } else {
        let tops = [],
            lefts = [],
            rights = [],
            highest = null,
            leftmost = null,
            rightmost = null;
        for (let v of inactiveModel) {
            let {left, top} = window.getComputedStyle(v);
            if (left === curLeft) {
                tops.push(top);
            }
            if (top === curTop) {
                if (left < curLeft) {
                    lefts.push(left);
                } else if (left > curLeft) {
                    rights.push(left);
                }
            }
        }
        if (tops.length === 0) {
            highest = this.siteSize.top + this.siteSize.height;
        } else {
            tops = Array.from(tops, top => parseInt(top.replace('px', '')));
            highest = Math.min(...tops);
        }
        if (lefts.length === 0) {
            leftmost = this.siteSize.left - this.BLOCK_SIZE;
        } else {
            lefts = Array.from(lefts, left => parseInt(left.replace('px', '')));
            leftmost = Math.max(...lefts);
        }
        if (rights.length === 0) {
            rightmost = this.siteSize.left + this.siteSize.width
        } else {
            rights = Array.from(rights, right => parseInt(right.replace('px', '')));
            rightmost = Math.min(...rights);
        }
        return {
            highest: highest,
            leftmost: leftmost,
            rightmost: rightmost
        };
    }
};
```
### 方块下落,左右,变形判断
    方块所有形变/位移都需要判断是否有足够位置发生
```javascript
/**
 * 判断当前方块是否能移动||变形
 * @param arr 将要判断的方块
 * @param deform 是否需要变形
 * @param displacement 位移
 * @param move
 * @returns
 */
canMove(arr, displacement = 1, deform = false, move = {
    canMoveRight: true,
    canMoveDown: true,
    canMoveLeft: true,
    moveDownDivide: []
}) {
    this.checkArrWith1(arr, function (i, j) {
        let {highest, leftmost, rightmost} = this.getInterval(`${j * this.BLOCK_SIZE}px`, `${i * this.BLOCK_SIZE}px`);
        if (deform) {
            if (this.BLOCK_SIZE * (j + 1) > rightmost) {
                move.canMoveRight = false;
            }
            if (this.BLOCK_SIZE * (i + displacement) > highest) {
                move.canMoveDown = false;
                move.moveDownDivide.push(highest - this.BLOCK_SIZE * (i + 1));
            }
            if (this.BLOCK_SIZE * (j - 1) < leftmost) {
                move.canMoveLeft = false;
            }
        } else {
            if (this.BLOCK_SIZE * (j + 1) >= rightmost) {
                move.canMoveRight = false;
            }
            if (this.BLOCK_SIZE * (i + displacement) >= highest) {
                move.canMoveDown = false;
                move.moveDownDivide.push(highest - this.BLOCK_SIZE * (i + 1));
            }
            if (this.BLOCK_SIZE * (j - 1) <= leftmost) {
                move.canMoveLeft = false;
            }
        }
    });
    return move;
};
```
### 判断方块是否触顶表示是否游戏结束
```javascript
/**
 * 当灰色砖块高于画布高偏移量,游戏结束
 * @returns {boolean}
 */
gameOver() {
    const inactiveModels = document.querySelectorAll('.inactiveModel');
    let tops = [];
    for (let v of inactiveModels) {
        tops.push(parseInt(window.getComputedStyle(v).top.replace('px', '')));
    }
    return Math.min(...tops) <= this.siteSize.top;
};
```
### 方块自由落体
    按照游戏等级速度改变
```javascript
/**
 * 方块自由下落
 * @type {number}
 */
const fallDown = setTimeout(function loop() {
    let moveDown = this.canMove(this.arr).canMoveDown;
    if (moveDown) {
        for (let v of activityModels) {
            v.style.top = `calc(${v.style.top} + ${this.BLOCK_SIZE}px)`;
        }
        this.curTop++;
        setTimeout(loop.bind(this), this.delay / window.__level__);
    } else {
        for (let i = 0; i < activityModels.length; i++) {
            activityModels[i].className = 'inactiveModel'
        }
        let res = this.eliminate();
        for (let i = 0; i < res.length; i++) {
            let {count, models, top} = res[i];
            if (count === parseInt(this.siteSize.width / this.BLOCK_SIZE)) {
                for (let j = 0; j < models.length; j++) {
                    document.body.removeChild(models[j]);
                }
                let inactiveModels = document.querySelectorAll('.inactiveModel');
                for (let v of inactiveModels) {
                    if (parseInt(window.getComputedStyle(v).top.replace('px', '')) < top) {
                        v.style.top = `calc(${window.getComputedStyle(v).top} + ${this.BLOCK_SIZE}px)`;
                    }
                }
                window.__score__ += window.__level__ * 100;
                let score = document.querySelector('#score');
                score.innerText = window.__score__;
                //level最高为4
                //升级规则为当前消除数大于等于level*10
                if (window.__score__ - (window.__level__ - 1) * (window.__level__ - 1) * 1000 >= window.__level__ * window.__level__ * 1000 && window.__level__ <= 4) {
                    window.__level__++;
                    let level = document.querySelector('#level');
                    level.innerText = window.__level__;
                }
            }
        }
        if (!this.gameOver()) {
            init(this.nextArr);
        } else {
            console.log('Game over~');
            next.innerHTML = null;
            let curTop = this.siteSize.height + this.siteSize.top - this.BLOCK_SIZE,
                curLeft = this.siteSize.width + this.siteSize.left - this.BLOCK_SIZE;
            let fillId = setInterval(function () {
                Block.fill(curTop, curLeft);
                curLeft -= this.BLOCK_SIZE;
                if (curLeft < this.siteSize.left) {
                    curLeft = this.siteSize.width + this.siteSize.left - this.BLOCK_SIZE;
                    curTop -= this.BLOCK_SIZE;
                }
                if (curTop < this.siteSize.top) {
                    clearInterval(fillId);
                    let restart = document.querySelector('.start-restart');
                    restart.style.display = 'block';
                    restart.onclick = (e)=> {
                        e.preventDefault();
                        restart.style.display = 'none';
                        let inactiveModels = [...document.querySelectorAll('.inactiveModel')];
                        if (inactiveModels.length > 0) {
                            for (let v of inactiveModels) {
                                document.body.removeChild(v);
                            }
                        }
                        if (this.highestScore < window.__score__) {
                            localStorage.setItem('highestScore', window.__score__);
                            let highestScoreDiv = document.querySelector('#highest-score');
                            highestScoreDiv.innerText = window.__score__;
                        }
                        window.__score__ = 0;
                        let score = document.querySelector('#score');
                        score.innerText = window.__score__;
                        window.__level__ = 1;
                        let level = document.querySelector('#level');
                        level.innerText = window.__level__;
                        this.init();
                    }
                }
            }.bind(this), 30);
        }
        clearTimeout(fallDown);
    }
}.bind(this), this.delay / window.__level__);
```
## 传送门
写到这里无耻求`start` :relaxed:  
写到这里无耻求`start` :relaxed:  
写到这里无耻求`start` :relaxed:  
github地址: [https://github.com/timmyLan/tetris][2]  
示例: [https://timmylan.github.io/tetris/][3]  


  [1]: http://ohumzw01d.bkt.clouddn.com/%E4%BF%84%E7%BD%97%E6%96%AF%E6%96%B9%E5%9D%97.png
  [2]: https://github.com/timmyLan/tetris
  [3]: https://timmylan.github.io/tetris/
