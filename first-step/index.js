/**
 * Created by llan on 2017/1/23.
 */
'use strict';

class Block {
    /**
     * 键盘事件
     * 上下左右分别控制方块对应移动20px
     */
    move() {
        document.onkeydown = (e)=> {
            e.preventDefault();
            let activeModel = document.querySelector('.activityModel'),
                left = parseInt(activeModel.style.left) ? parseInt(activeModel.style.left) : 0,
                top = parseInt(activeModel.style.top) ? parseInt(activeModel.style.top) : 0;
            const key = e.keyCode;
            switch (key) {
                //left
                case 37:
                    activeModel.style.left = `${left - 20}px`;
                    break;
                //up
                case 38:
                    activeModel.style.top = `${top - 20}px`;
                    break;
                //right
                case 39:
                    activeModel.style.left = `${left + 20}px`;
                    break;
                //down
                case 40:
                    activeModel.style.top = `${top + 20}px`;
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
        document.body.appendChild(activeModel);
    }
}
/**
 * 浏览器加载初始化
 */
window.onload = ()=> {
    let block = new Block;
    block.init();
    block.move();
};
