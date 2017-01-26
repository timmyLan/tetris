/**
 * Created by llan on 2017/1/23.
 */
'use strict';

class Block {
    constructor(params) {
        this.siteSize = params.siteSize;
        this.arr = params.arr;
        this.BLOCK_SIZE = params.BLOCK_SIZE;
        this.curLeft = params.curLeft;
        this.curTop = params.curTop;
    }

    /**
     * 数组矩阵顺时针旋转
     * @param arr 需要旋转的数组矩阵
     * @returns {{newArr: Array, lefts: Array, tops: Array}} 返回旋转后的数组矩阵&左偏移量&上偏移量
     */
    clockwise(arr) {
        let newArr = [];
        for (let i = 0; i <= arr.length - 1; i++) {
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
     */
    checkArrWith1(arr, callback) {
        for (let i = 0; i <= arr.length - 1; i++) {
            for (let j = 0; j <= arr.length - 1; j++) {
                if (arr[i][j] === 1) {
                    callback.call(this, i + this.curTop, j + this.curLeft);
                }
            }
        }
    }

    /**
     * 根据数组矩阵画出当前方块
     * @param i
     * @param j
     */
    draw(i, j) {
        let activeModel = document.createElement('div');
        activeModel.className = 'activityModel';
        //控制方块出现在画布顶端中间
        activeModel.style.top = `${i * this.BLOCK_SIZE}px`;
        activeModel.style.left = `${j * this.BLOCK_SIZE}px`;
        //添加方块
        document.body.appendChild(activeModel);
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
     * 判断是否可以移动
     * @param arr 需要判断的矩阵数组
     * @param deform 是否需要形变
     * @param move
     * @returns {{canMoveRight: boolean, canMoveLeft: boolean, canMoveDown: boolean}}
     */
    canMove(arr, deform = false, move = {
        canMoveRight: true,
        canMoveDown: true,
        canMoveLeft: true
    }) {
        this.checkArrWith1(arr, function (i, j) {
            let {highest, leftmost, rightmost} = this.getInterval(j * this.BLOCK_SIZE, i * this.BLOCK_SIZE);
            if (deform) {
                if (this.BLOCK_SIZE * (j + 1) > rightmost) {
                    move.canMoveRight = false;
                }
                if (this.BLOCK_SIZE * (i + 1) > highest) {
                    move.canMoveDown = false;
                }
                if (this.BLOCK_SIZE * (j - 1) < leftmost) {
                    move.canMoveLeft = false;
                }
            } else {
                if (this.BLOCK_SIZE * (j + 1) >= rightmost) {
                    move.canMoveRight = false;
                }
                if (this.BLOCK_SIZE * (i + 1) >= highest) {
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
                                v.style.left = `${parseInt(v.style.left) - 20}px`;
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
                                v.style.left = `${parseInt(v.style.left) + 20}px`;
                            }
                            this.curLeft++;
                        } else {
                            console.log('can not move right');
                        }
                        break;
                    //down
                    case 40:
                        canMoveDown = this.canMove(this.arr).canMoveDown;
                        if (canMoveDown) {
                            for (let v of activeModel) {
                                v.style.top = `${parseInt(v.style.top) + 20}px`;
                            }
                            this.curTop++;
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
        this.checkArrWith1(this.arr, this.draw);
        let activeModel = document.querySelectorAll('.activityModel');
        const fallDown = setTimeout(function loop() {
            let canMoveDown = this.canMove(this.arr).canMoveDown;
            if (canMoveDown) {
                for (let v of activeModel) {
                    v.style.top = `${parseInt(v.style.top) + this.BLOCK_SIZE}px`;
                }
                this.curTop++;
                setTimeout(loop.bind(this), 600);
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
                    }
                }
                init();
                clearTimeout(fallDown);
            }
        }.bind(this), 600);
    }
}
/**
 * 初始化数据
 */
const init = ()=> {
    //传入Block的变量
    const params = {
        arr: __arr__,
        siteSize: __siteSize__,
        BLOCK_SIZE: __BLOCK_SIZE__,
        curLeft: __curLeft__,
        curTop: __curTop__
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
    //方块矩阵数组
    let arr = [[1, 0], [1, 0], [1, 1]];
    window.__arr__ = arr;
    window.__siteSize__ = siteSize;
    window.__BLOCK_SIZE__ = BLOCK_SIZE;
    window.__curLeft__ = curLeft;
    window.__curTop__ = curTop;
    init();
};
