/**
 * Created by llan on 2017/1/11.
 */

//形状数组
const arrs = [
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
    //田
    [[1, 1], [1, 1]],
    //T
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]]
];
/**
 * 方块
 * @param params
 */
const block = function (params = {
    arr: [[1, 0], [1, 0], [1, 1]],
    curLeft: 0,
    curTop: 0,
    BLOCK_SIZE: 20,
    siteSize: {
        width: 200,
        height: 360,
        top: 200,
        left: 200
    }
}) {
    //方块矩阵
    let arr = params.arr,
        curLeft = params.curLeft,
        curTop = params.curTop;
    //方块大小
    const BLOCK_SIZE = params.BLOCK_SIZE;
    //当前画布大小
    const siteSize = params.siteSize;
    /**
     * 画当前方块
     * @param i
     * @param j
     */
    const draw = function (i, j) {
        let left = j * BLOCK_SIZE;
        let top = i * BLOCK_SIZE;
        let model = document.createElement('div');
        model.className = 'activityModel';
        model.style.left = `${left}px`;
        model.style.top = `${top}px`;
        document.body.appendChild(model);
    };
    /**
     * 顺时针旋转矩阵
     * @param arr 需要旋转的矩阵
     * @returns {{newArr: Array, lefts: Array, tops: Array}}
     */
    const clockwise = function (arr) {
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
        checkArrWith1(newArr, function (i, j) {
            lefts.push(j * BLOCK_SIZE);
            tops.push(i * BLOCK_SIZE);
        });
        return {
            newArr: newArr,
            lefts: lefts,
            tops: tops
        };
    };
    /**
     * 判断数组中值为1的下标
     * @param arr 需要判断的数组
     * @param callback 需要执行的回调函数
     */
    const checkArrWith1 = function (arr, callback) {
        for (let i = 0; i <= arr.length - 1; i++) {
            for (let j = 0; j <= arr[0].length - 1; j++) {
                if (arr[i][j] === 1) {
                    callback(i + curTop, j + curLeft);
                }
            }
        }
    };
    /**
     * 判断当前方块是否能移动||变形
     * @param arr 将要判断的方块
     * @param deform 是否需要变形
     * @param canMove
     * @returns {{canMoveRight: boolean, canMoveDown: boolean, canMoveTop: boolean, canMoveLeft: boolean}}
     */
    const canMove = function (arr, deform = false, canMove = {
        canMoveRight: true,
        canMoveDown: true,
        canMoveTop: true,
        canMoveLeft: true
    }) {
        checkArrWith1(arr, function (i, j) {
            if (deform) {
                if (siteSize.width + siteSize.left - BLOCK_SIZE * (j + 1) < 0) {
                    canMove.canMoveRight = false;
                }
                if (siteSize.height + siteSize.top - BLOCK_SIZE * (i + 1) < 0) {
                    canMove.canMoveDown = false;
                }
            } else {
                if (siteSize.width + siteSize.left - BLOCK_SIZE * (j + 1) <= 0) {
                    canMove.canMoveRight = false;
                }
                if (siteSize.height + siteSize.top - BLOCK_SIZE * (i + 1) <= 0) {
                    canMove.canMoveDown = false;
                }
                if (j * BLOCK_SIZE <= siteSize.left) {
                    canMove.canMoveLeft = false;
                }
                if (i * BLOCK_SIZE <= siteSize.top) {
                    canMove.canMoveTop = false;
                }
            }
        });
        return canMove;
    };
    //画出当前方块
    checkArrWith1(arr, draw);
    //记录当前方块
    let activityModels = document.getElementsByClassName('activityModel');
    /**
     * 键盘事件
     * @param e
     */
    document.onkeydown = function (e) {
        const key = e.keyCode;
        switch (key) {
            //space
            case 32:
                let {newArr, lefts, tops}= clockwise(arr);
                let {canMoveRight, canMoveDown} = canMove(newArr, true);
                if (canMoveRight && canMoveDown) {
                    //记录转变后的矩阵
                    arr = newArr;
                    for (let i in lefts) {
                        activityModels[i].style.left = `${lefts[i]}px`;
                        activityModels[i].style.top = `${tops[i]}px`;
                    }
                }
                break;
            //left
            case 37:
                let moveLeft = canMove(arr).canMoveLeft;
                if (moveLeft) {
                    for (let v of activityModels) {
                        v.style.left = `calc(${v.style.left} - ${BLOCK_SIZE}px)`;
                    }
                    curLeft--;
                }
                break;
            //top
            case 38:
                let moveTop = canMove(arr).canMoveTop;
                if (moveTop) {
                    for (let v of activityModels) {
                        v.style.top = `calc(${v.style.top} - ${BLOCK_SIZE}px)`;
                    }
                    curTop--;
                }
                break;
            //right
            case 39:
                let moveRight = canMove(arr).canMoveRight;
                if (moveRight) {
                    for (let v of activityModels) {
                        v.style.left = `calc(${v.style.left} + ${BLOCK_SIZE}px)`;
                    }
                    curLeft++;
                }
                break;
            //down
            case 40:
                let moveDown = canMove(arr).canMoveDown;
                if (moveDown) {
                    for (let v of activityModels) {
                        v.style.top = `calc(${v.style.top} + ${BLOCK_SIZE}px)`;
                    }
                    curTop++;
                }
                break;
            default:
                break;
        }
    };
};
/**
 * init
 */
(function init() {
    const site = document.getElementsByClassName('site')[0];
    let {width, height, top, left} = window.getComputedStyle(site);
    let siteSize = {};
    siteSize.width = parseInt(width.replace('px', ''));
    siteSize.height = parseInt(height.replace('px', ''));
    siteSize.top = parseInt(top.replace('px', ''));
    siteSize.left = parseInt(left.replace('px', ''));
    const params = {
        arr: arrs[11],
        curLeft: 14,
        curTop: 10,
        BLOCK_SIZE: 20,
        siteSize: siteSize
    };
    block(params);
})();


