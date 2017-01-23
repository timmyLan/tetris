/**
 * Created by llan on 2017/1/23.
 */
'use strict';

class Block {
    constructor(params) {
        this.siteSize = params.siteSize;
        this.arr = params.arr;
        this.BLOCK_SIZE = params.BLOCK_SIZE;
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
                    callback.call(this, i, j);
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
        activeModel.style.top = `${this.siteSize.top + i * this.BLOCK_SIZE}px`;
        activeModel.style.left = `${this.siteSize.left + this.siteSize.width / 2 + j * this.BLOCK_SIZE}px`;
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
            const {canMoveRight, canMoveLeft, canMoveTop, canMoveDown} = this.canMove();
            switch (key) {
                //left
                case 37:
                    if (canMoveLeft) {
                        for (let v of activeModel) {
                            v.style.left = `${parseInt(v.style.left) - 20}px`;
                        }
                    } else {
                        console.log('can not move left');
                    }
                    break;
                //up
                case 38:
                    if (canMoveTop) {
                        for (let v of activeModel) {
                            v.style.top = `${parseInt(v.style.top) - 20}px`;
                        }
                    } else {
                        console.log('can not move top');
                    }
                    break;
                //right
                case 39:
                    if (canMoveRight) {
                        for (let v of activeModel) {
                            v.style.left = `${parseInt(v.style.left) + 20}px`;
                        }
                    } else {
                        console.log('can not move right');
                    }
                    break;
                //down
                case 40:
                    if (canMoveDown) {
                        for (let v of activeModel) {
                            v.style.top = `${parseInt(v.style.top) + 20}px`;
                        }
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
    //方块矩阵数组
    const arr = [[1, 0], [1, 0], [1, 1]];
    //方块大小
    const BLOCK_SIZE = 20;
    //传入Block的变量
    const params = {
        arr: arr,
        siteSize: siteSize,
        BLOCK_SIZE: BLOCK_SIZE
    };
    //新建Block
    let block = new Block(params);
    block.init();
    block.move();
};
