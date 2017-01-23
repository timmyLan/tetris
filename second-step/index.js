/**
 * Created by llan on 2017/1/23.
 */
'use strict';

class Block {
    constructor(siteSize) {
        this.siteSize = siteSize;
    }

    /**
     * 判断是否可以移动
     * @returns {{canMoveRight: boolean, canMoveLeft: boolean, canMoveTop: boolean, canMoveDown: boolean}}
     */
    canMove() {
        let activeModel = document.querySelector('.activityModel'),
            top = parseInt(activeModel.style.top),
            left = parseInt(activeModel.style.left),
            canMoveRight = true,
            canMoveTop = true,
            canMoveDown = true,
            canMoveLeft = true;
        if (left + 20 >= this.siteSize.left + this.siteSize.width) {
            canMoveRight = false;
        }
        if (left - 20 < this.siteSize.left) {
            canMoveLeft = false;
        }
        if (top - 20 < this.siteSize.top) {
            canMoveTop = false;
        }
        if (top + 20 >= this.siteSize.top + this.siteSize.height) {
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
            let activeModel = document.querySelector('.activityModel'),
                left = parseInt(activeModel.style.left) ? parseInt(activeModel.style.left) : 0,
                top = parseInt(activeModel.style.top) ? parseInt(activeModel.style.top) : 0;
            const key = e.keyCode;
            let canMoveRight,
                canMoveLeft,
                canMoveTop,
                canMoveDown;
            switch (key) {
                //left
                case 37:
                    canMoveLeft = this.canMove().canMoveLeft;
                    if (canMoveLeft) {
                        activeModel.style.left = `${left - 20}px`;
                    } else {
                        console.log('can not move left');
                    }
                    break;
                //up
                case 38:
                    canMoveTop = this.canMove().canMoveTop;
                    if (canMoveTop) {
                        activeModel.style.top = `${top - 20}px`;
                    } else {
                        console.log('can not move top');
                    }
                    break;
                //right
                case 39:
                    canMoveRight = this.canMove().canMoveRight;
                    if (canMoveRight) {
                        activeModel.style.left = `${left + 20}px`;
                    } else {
                        console.log('can not move right');
                    }
                    break;
                //down
                case 40:
                    canMoveDown = this.canMove().canMoveDown;
                    if (canMoveDown) {
                        activeModel.style.top = `${top + 20}px`;
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
        let activeModel = document.createElement('div');
        activeModel.className = 'activityModel';
        //控制方块出现在画布顶端中间
        activeModel.style.top = `${this.siteSize.top}px`;
        activeModel.style.left = `${this.siteSize.left + this.siteSize.width / 2}px`;
        //添加方块
        document.body.appendChild(activeModel);
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
    //新建Block
    let block = new Block(siteSize);
    block.init();
    block.move();
};
