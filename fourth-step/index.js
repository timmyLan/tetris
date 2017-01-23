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
     * 判断是否可以移动
     * @returns {{canMoveRight: boolean, canMoveLeft: boolean, canMoveTop: boolean, canMoveDown: boolean}}
     */
    canMove() {
        let activeModel = document.querySelectorAll('.activityModel');
        let tops = [],
            lefts = [];
        Array.from(activeModel).forEach((v)=> {
            tops.push(parseInt(v.style.top));
            lefts.push(parseInt(v.style.left));
        });
        let top = Math.min(...tops),
            left = Math.min(...lefts),
            right = Math.max(...lefts),
            down = Math.max(...tops),
            canMoveRight = true,
            canMoveTop = true,
            canMoveDown = true,
            canMoveLeft = true;
        if (right + 20 >= this.siteSize.left + this.siteSize.width) {
            canMoveRight = false;
        }
        if (left - 20 < this.siteSize.left) {
            canMoveLeft = false;
        }
        if (top - 20 < this.siteSize.top) {
            canMoveTop = false;
        }
        if (down + 20 >= this.siteSize.top + this.siteSize.height) {
            canMoveDown = false;
        }
        return {
            canMoveRight: canMoveRight,
            canMoveLeft: canMoveLeft,
            canMoveTop: canMoveTop,
            canMoveDown: canMoveDown
        }
    }

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
                canMoveTop,
                canMoveDown;
            switch (key) {
                //left
                case 37:
                    canMoveLeft = this.canMove().canMoveLeft;
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
                    move = this.canMove();
                    canMoveDown = move.canMoveDown;
                    canMoveRight = move.canMoveRight;
                    if (canMoveRight && canMoveRight) {
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
                    canMoveRight = this.canMove().canMoveRight;
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
                    canMoveDown = this.canMove().canMoveDown;
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

    /**
     * 初始化方块
     */
    init() {
        this.checkArrWith1(this.arr, this.draw);
    }
}
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
    //当前画布中间位置
    let curLeft = parseInt((siteSize.left + siteSize.width / 2) / BLOCK_SIZE);
    let curTop = parseInt(siteSize.top / BLOCK_SIZE);
    //方块矩阵数组
    const arr = [[1, 0], [1, 0], [1, 1]];
    //传入Block的变量
    const params = {
        arr: arr,
        siteSize: siteSize,
        BLOCK_SIZE: BLOCK_SIZE,
        curLeft: curLeft,
        curTop: curTop
    };
    //新建Block
    let block = new Block(params);
    block.init();
    block.move();
};
