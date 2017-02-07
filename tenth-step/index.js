/**
 * Created by llan on 2017/1/23.
 */
'use strict';

class Block {
    constructor(params) {
        //画布大小
        this.siteSize = params.siteSize;
        //当前方块矩阵
        this.arr = params.arr;
        //下一个方块矩阵
        this.nextArr = params.nextArr;
        //方块单位大小
        this.BLOCK_SIZE = params.BLOCK_SIZE;
        //当前方块位置
        this.curLeft = params.curLeft;
        this.curTop = params.curTop;
        //历史最高得分
        this.highestScore = params.highestScore;
        //方块下落速度
        this.delay = params.delay;
    }

    /**
     * 数组矩阵顺时针旋转
     * @param arr 需要旋转的数组矩阵
     * @returns {{newArr: Array, lefts: Array, tops: Array}} 返回旋转后的数组矩阵&左偏移量&上偏移量
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
    }

    /**
     * 判断二维数组为1的下标
     * @param arr 需要判断的数组矩阵
     * @param callback
     * @param el draw函数插入的节点
     * @param className draw函数方块的className
     */
    checkArrWith1(arr, callback, el, className) {
        for (let i = 0; i <= arr.length - 1; i++) {
            for (let j = 0; j <= arr[0].length - 1; j++) {
                if (arr[i][j] === 1) {
                    callback.call(this, i + this.curTop, j + this.curLeft, el, className);
                }
            }
        }
    }

    /**
     * 根据数组矩阵画出当前方块
     * @param i
     * @param j
     * @param el 插入的节点
     * @param className 方块的className
     */
    draw(i, j, el, className) {
        let left = className === 'nextModel' ? j * this.BLOCK_SIZE - (this.siteSize.left + this.siteSize.width / 2 - this.BLOCK_SIZE) : j * this.BLOCK_SIZE;
        let top = className === 'nextModel' ? i * this.BLOCK_SIZE - this.siteSize.top : i * this.BLOCK_SIZE;
        //创建方块
        let model = document.createElement('div');
        model.className = className;
        model.style.left = `${left}px`;
        model.style.top = `${top}px`;
        //添加方块
        el.appendChild(model);
    }

    /**
     * 获取当前方块能到达的边界
     * @param curLeft 当前方块left
     * @param curTop 当前方块top
     * @returns {*} 返回左右下边界
     */
    getInterval(curLeft, curTop) {
        let inactiveModel = document.querySelectorAll('.inactiveModel'),
            highest = null,
            leftmost = null,
            rightmost = null;
        if (inactiveModel.length === 0) {
            highest = this.siteSize.top + this.siteSize.height;
            leftmost = this.siteSize.left - this.BLOCK_SIZE;
            rightmost = this.siteSize.left + this.siteSize.width;
        } else {
            let tops = [],
                lefts = [],
                rights = [];
            for (let v of inactiveModel) {
                let left = parseInt(v.style.left);
                let top = parseInt(v.style.top);
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
                highest = Math.min(...tops);
            }
            if (lefts.length === 0) {
                leftmost = this.siteSize.left - this.BLOCK_SIZE;
            } else {
                leftmost = Math.max(...lefts);
            }
            if (rights.length === 0) {
                rightmost = this.siteSize.left + this.siteSize.width
            } else {
                rightmost = Math.min(...rights);
            }
        }
        return {
            highest: highest,
            leftmost: leftmost,
            rightmost: rightmost
        };
    };

    /**
     * 消除砖块
     * @returns {Array} 返回每一行的元素数组,个数,高度
     */
    eliminate() {
        let res = [],
            inactiveModels = [...document.querySelectorAll('.inactiveModel')];
        inactiveModels.sort(function (a, b) {
            return parseInt(a.style.top) - parseInt(b.style.top);
        });
        for (let i = 0; i < inactiveModels.length;) {
            let count = 0,
                models = [];
            for (let j = 0; j < inactiveModels.length; j++) {
                if (inactiveModels[i].style.top === inactiveModels[j].style.top) {
                    count++;
                    models.push(inactiveModels[j]);
                }
            }
            res.push({
                models: models,
                count: count,
                top: parseInt(inactiveModels[i].style.top)
            });
            i += count;
        }
        return res;
    };

    /**
     * 当灰色砖块高于画布高偏移量,游戏结束
     * @returns {boolean}
     */
    gameOver() {
        const inactiveModels = document.querySelectorAll('.inactiveModel');
        let tops = [];
        for (let v of inactiveModels) {
            tops.push(parseInt(v.style.top));
        }
        return Math.min(...tops) <= this.siteSize.top;
    };

    /**
     * gameOver填充动画
     * @param curTop
     * @param curLeft
     */
    static fill(curTop, curLeft) {
        let model = document.createElement('div');
        model.className = 'inactiveModel';
        model.style.left = `${curLeft}px`;
        model.style.top = `${curTop}px`;
        document.body.appendChild(model);
    };

    /**
     * 判断是否可以移动
     * @param arr 需要判断的矩阵数组
     * @param deform 是否需要形变
     * @param displacement 位移量
     * @returns {{canMoveRight: boolean, canMoveDown: boolean, canMoveLeft: boolean}}
     * @param move
     */
    canMove(arr, deform = false, displacement = 1, move = {
        canMoveRight: true,
        canMoveDown: true,
        canMoveLeft: true
    }) {
        let highest = null;
        this.checkArrWith1(arr, function (i, j) {
            let interval = this.getInterval(j * this.BLOCK_SIZE, i * this.BLOCK_SIZE),
                leftmost = interval.leftmost,
                rightmost = interval.rightmost;
            highest = interval.highest;
            if (deform) {
                if (this.BLOCK_SIZE * (j + 1) > rightmost) {
                    move.canMoveRight = false;
                }
                if (this.BLOCK_SIZE * (i + displacement) > highest) {
                    move.canMoveDown = false;
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
                }
                if (this.BLOCK_SIZE * (j - 1) <= leftmost) {
                    move.canMoveLeft = false;
                }
            }
        });
        return move;
    };

    /**
     * 键盘事件
     * 上下左右分别控制方块对应移动20px
     */
    move() {
        document.onkeydown = (e)=> {
            let activeModel = document.querySelectorAll('.activityModel');
            const key = e.keyCode;
            let move,
                canMoveRight,
                canMoveLeft,
                canMoveDown;
            if (activeModel.length) {
                switch (key) {
                    //left
                    case 37:
                        canMoveLeft = this.canMove(this.arr).canMoveLeft;
                        if (canMoveLeft) {
                            for (let v of activeModel) {
                                v.style.left = `${parseInt(v.style.left) - this.BLOCK_SIZE}px`;
                            }
                            this.curLeft--;
                        } else {
                            console.log('can not move left');
                        }
                        break;
                    //up
                    case 38:
                        let {newArr, lefts, tops} = this.clockwise(this.arr);
                        move = this.canMove(newArr, true);
                        canMoveDown = move.canMoveDown;
                        canMoveRight = move.canMoveRight;
                        canMoveLeft = move.canMoveLeft;
                        if (canMoveRight && canMoveDown && canMoveLeft) {
                            //修改当前数组矩阵
                            this.arr = newArr;
                            //修改当前方块偏移量
                            for (let i in lefts) {
                                activeModel[i].style.left = `${lefts[i]}px`;
                                activeModel[i].style.top = `${tops[i]}px`;
                            }
                        }
                        break;
                    //right
                    case 39:
                        canMoveRight = this.canMove(this.arr).canMoveRight;
                        if (canMoveRight) {
                            for (let v of activeModel) {
                                v.style.left = `${parseInt(v.style.left) + this.BLOCK_SIZE}px`;
                            }
                            this.curLeft++;
                        } else {
                            console.log('can not move right');
                        }
                        break;
                    //space
                    case 32:
                        canMoveDown = this.canMove(this.arr, false, 2).canMoveDown;
                        if (canMoveDown) {
                            for (let v of activeModel) {
                                v.style.top = `${parseInt(v.style.top) + 2 * this.BLOCK_SIZE}px`
                            }
                            this.curTop += 2;
                        } else {
                            console.log('can not move down');
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    /**
     * 初始化方块
     */
    init() {
        //清除下一个方块
        let next = document.querySelector('#next');
        next.innerHTML = null;
        //画出当前方块
        this.checkArrWith1(this.arr, this.draw, document.body, 'activityModel');
        //画出下一个方块
        this.checkArrWith1(this.nextArr, this.draw, next, 'nextModel');
        let activeModel = document.querySelectorAll('.activityModel');
        //方块自由落体
        const fallDown = setTimeout(function loop() {
            let canMoveDown = this.canMove(this.arr).canMoveDown;
            if (canMoveDown) {
                for (let v of activeModel) {
                    v.style.top = `${parseInt(v.style.top) + this.BLOCK_SIZE}px`;
                }
                this.curTop++;
                setTimeout(loop.bind(this), this.delay / window.__level__);
            } else {
                console.log('can not move down');
                for (let i = 0; i <= activeModel.length - 1; i++) {
                    activeModel[i].className = 'inactiveModel';
                }
                let res = this.eliminate();
                for (let i = 0; i < res.length; i++) {
                    let {count, models, top} = res[i];
                    //判断每一行方块数量,若凑满一整行,消去
                    if (count === parseInt(this.siteSize.width / this.BLOCK_SIZE)) {
                        for (let j = 0; j < models.length; j++) {
                            document.body.removeChild(models[j]);
                        }
                        let inactiveModels = document.querySelectorAll('.inactiveModel');
                        for (let v of inactiveModels) {
                            if (parseInt(v.style.top) < top) {
                                v.style.top = `${parseInt(v.style.top) + this.BLOCK_SIZE}px`;
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
                if (this.gameOver()) {
                    console.log('GAME OVER ~');
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
                            //清除下一个方块
                            let next = document.querySelector('#next');
                            next.innerHTML = null;
                            let startOrRestart = document.querySelector('.start-restart');
                            startOrRestart.style.display = 'block';
                            startOrRestart.onclick = (e)=> {
                                e.preventDefault();
                                startOrRestart.style.display = 'none';
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
                            };
                        }
                    }.bind(this), 30);
                } else {
                    init(this.nextArr);
                }
                clearTimeout(fallDown);
            }
        }.bind(this), this.delay / window.__level__);
    }
}
/**
 * 初始化数据
 */
const init = (nextArr)=> {
    const random = Math.floor(Math.random() * __arrs__.length),
        nextRandom = Math.floor(Math.random() * __arrs__.length),
        arr = nextArr ? nextArr : __arrs__[random],
        delay = 600,
        //传入Block的变量
        params = {
            arr: arr,
            nextArr: __arrs__[nextRandom],
            siteSize: __siteSize__,
            BLOCK_SIZE: __BLOCK_SIZE__,
            curLeft: __curLeft__,
            curTop: __curTop__,
            delay: delay,
            highestScore: __highestScore__
        };
    //新建Block
    let block = new Block(params);
    block.init();
    block.move();
};
/**
 * 浏览器加载初始化
 */
window.onload = ()=> {
    //获取画布大小&位置
    let site = document.querySelector('.site');
    let {width, height, left, top} = window.getComputedStyle(site);
    let siteSize = {
        width: parseInt(width),
        height: parseInt(height),
        left: parseInt(left),
        top: parseInt(top),
    };
    //方块大小
    const BLOCK_SIZE = 20;
    //俄罗斯方块初始位置
    let curLeft = parseInt((siteSize.left + siteSize.width / 2) / BLOCK_SIZE);
    let curTop = parseInt(siteSize.top / BLOCK_SIZE);
    //形状数组
    window.__arrs__ = [
        //L
        [[1, 0], [1, 0], [1, 1]],
        [[1, 1, 1], [1, 0, 0]],
        [[1, 1], [0, 1], [0, 1]],
        [[0, 0, 1], [1, 1, 1]],
        //』
        [[0, 1], [0, 1], [1, 1]],
        [[1, 0, 0], [1, 1, 1]],
        [[1, 1], [1, 0], [1, 0]],
        [[1, 1, 1], [0, 0, 1]],
        //I
        [[1], [1], [1], [1]],
        [[1, 1, 1, 1]],
        [[1], [1], [1], [1]],
        [[1, 1, 1, 1]],
        //田
        [[1, 1], [1, 1]],
        [[1, 1], [1, 1]],
        [[1, 1], [1, 1]],
        [[1, 1], [1, 1]],
        //T
        [[1, 1, 1], [0, 1, 0]],
        [[0, 1], [1, 1], [0, 1]],
        [[0, 1, 0], [1, 1, 1]],
        [[1, 0], [1, 1], [1, 0]],
        //Z
        [[1, 1, 0], [0, 1, 1]],
        [[0, 1], [1, 1], [1, 0]],
        [[1, 1, 0], [0, 1, 1]],
        [[0, 1], [1, 1], [1, 0]],
        //倒Z
        [[0, 1, 1], [1, 1, 0]],
        [[1, 0], [1, 1], [0, 1]],
        [[0, 1, 1], [1, 1, 0]],
        [[1, 0], [1, 1], [0, 1]]
    ];
    window.__siteSize__ = siteSize;
    window.__BLOCK_SIZE__ = BLOCK_SIZE;
    window.__curLeft__ = curLeft;
    window.__curTop__ = curTop;
    //显示历史最高分
    const highestScore = localStorage.getItem('highestScore') || 0;
    let highestScoreDiv = document.querySelector('#highest-score');
    highestScoreDiv.innerText = highestScore;
    //等级
    window.__level__ = 1;
    //得分
    window.__score__ = 0;
    //显示等级
    let level = document.querySelector('#level');
    level.innerText = window.__level__;
    //历史最高分
    window.__highestScore__ = highestScore;
    let start = document.querySelector('.start-restart');
    start.onclick = (e)=> {
        e.preventDefault();
        start.innerText = 'restart';
        start.style.display = 'none';
        init();
    };
};
