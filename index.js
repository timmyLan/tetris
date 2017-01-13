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
const block = function (params) {
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
    const getHighest = function (curLeft) {
        let inactiveModel = document.querySelectorAll('.inactiveModel');
        if (inactiveModel.length === 0) {
            return siteSize.top + siteSize.height;
        } else {
            let tops = [];
            for (let v of inactiveModel) {
                let {left, top} = window.getComputedStyle(v);
                if (left === curLeft) {
                    tops.push(top);
                }
            }
            if (tops.length === 0) {
                return siteSize.top + siteSize.height;
            }
            tops = Array.from(tops, top => parseInt(top.replace('px', '')));
            return Math.min(...tops);
        }
    };
    /**
     * 判断当前方块是否能移动||变形
     * @param arr 将要判断的方块
     * @param speed 方块下落速度
     * @param deform 是否需要变形
     * @param canMove
     * @returns {{canMoveRight: boolean, canMoveDown: boolean, canMoveTop: boolean, canMoveLeft: boolean}}
     */
    const canMove = function (arr, speed = 1, deform = false, canMove = {
        canMoveRight: true,
        canMoveDown: true,
        canMoveLeft: true
    }) {
        checkArrWith1(arr, function (i, j) {
            if (deform) {
                let highest = getHighest(`${j * BLOCK_SIZE}px`);
                if (siteSize.width + siteSize.left - BLOCK_SIZE * (j + 1) < 0) {
                    canMove.canMoveRight = false;
                }
                if (BLOCK_SIZE * (i + speed) > highest) {
                    canMove.canMoveDown = false;
                }
            } else {
                let highest = getHighest(`${j * BLOCK_SIZE}px`);
                if (siteSize.width + siteSize.left - BLOCK_SIZE * (j + 1) <= 0) {
                    canMove.canMoveRight = false;
                }
                if (BLOCK_SIZE * (i + speed) >= highest) {
                    canMove.canMoveDown = false;
                }
                if (j * BLOCK_SIZE <= siteSize.left) {
                    canMove.canMoveLeft = false;
                }
            }
        });
        return canMove;
    };
    //画出当前方块
    checkArrWith1(arr, draw);
    //记录当前方块
    let activityModels = document.querySelectorAll('.activityModel');
    /**
     * 方块自由下落
     * @type {number}
     */
    const fallDown = setInterval(function () {
        let moveDown = canMove(arr).canMoveDown;
        if (moveDown) {
            for (let v of activityModels) {
                v.style.top = `calc(${v.style.top} + ${BLOCK_SIZE}px)`;
            }
            curTop++;
        } else {
            for (let i = 0; i < activityModels.length; i++) {
                activityModels[i].className = 'inactiveModel'
            }
            init();
            clearInterval(fallDown);
        }
    }, 600);
    /**
     * 键盘事件
     * @param e
     */
    document.onkeydown = function (e) {
        const key = e.keyCode;
        switch (key) {
            //space
            case 32:
                const speed = 3;
                let moveDown = canMove(arr, speed).canMoveDown;
                if (moveDown) {
                    for (let v of activityModels) {
                        v.style.top = `calc(${v.style.top} + ${speed} * ${BLOCK_SIZE}px)`;
                    }
                    curTop += speed;
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
                let {newArr, lefts, tops}= clockwise(arr);
                let {canMoveRight, canMoveDown} = canMove(newArr, 1, true);
                if (canMoveRight && canMoveDown) {
                    //记录转变后的矩阵
                    arr = newArr;
                    for (let i in lefts) {
                        activityModels[i].style.left = `${lefts[i]}px`;
                        activityModels[i].style.top = `${tops[i]}px`;
                    }
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
            default:
                break;
        }
    };
};
/**
 * init
 */
const init = function () {
    const site = document.querySelector('.site');
    let {width, height, top, left} = window.getComputedStyle(site);
    let siteSize = {};
    siteSize.width = parseInt(width.replace('px', ''));
    siteSize.height = parseInt(height.replace('px', ''));
    siteSize.top = parseInt(top.replace('px', ''));
    siteSize.left = parseInt(left.replace('px', ''));
    const BlOCK_SIZE = 20,
        curLeft = parseInt((siteSize.left + siteSize.width / 2 - BlOCK_SIZE) / BlOCK_SIZE),
        curTop = parseInt(siteSize.top / BlOCK_SIZE);
    const random = Math.floor(Math.random() * arrs.length);
    const params = {
        arr: arrs[random],
        curLeft: curLeft,
        curTop: curTop,
        BLOCK_SIZE: BlOCK_SIZE,
        siteSize: siteSize
    };
    block(params);
};

window.onload = init;


