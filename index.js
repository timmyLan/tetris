/**
 * Created by llan on 2017/1/11.
 */
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
    //历史最高得分
    const highestScore = params.highestScore;
    //方块下落速度
    const delay = params.delay;
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
     * 获取边界
     * @param curLeft 当前方块left
     * @param curTop 当前方块top
     * @returns {*} 返回左右下边界
     */
    const getInterval = function (curLeft, curTop) {
        let inactiveModel = document.querySelectorAll('.inactiveModel');
        if (inactiveModel.length === 0) {
            return {
                highest: siteSize.top + siteSize.height,
                leftmost: siteSize.left - BLOCK_SIZE,
                rightmost: siteSize.left + siteSize.width
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
                highest = siteSize.top + siteSize.height;
            } else {
                tops = Array.from(tops, top => parseInt(top.replace('px', '')));
                highest = Math.min(...tops);
            }
            if (lefts.length === 0) {
                leftmost = siteSize.left - BLOCK_SIZE;
            } else {
                lefts = Array.from(lefts, left => parseInt(left.replace('px', '')));
                leftmost = Math.max(...lefts);
            }
            if (rights.length === 0) {
                rightmost = siteSize.left + siteSize.width
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
    /**
     * 判断当前方块是否能移动||变形
     * @param arr 将要判断的方块
     * @param deform 是否需要变形
     * @param displacement 位移
     * @param move
     * @returns
     */
    const canMove = function (arr, displacement = 1, deform = false, move = {
        canMoveRight: true,
        canMoveDown: true,
        canMoveLeft: true,
        moveDownDivide: []
    }) {
        checkArrWith1(arr, function (i, j) {
            let {highest, leftmost, rightmost} = getInterval(`${j * BLOCK_SIZE}px`, `${i * BLOCK_SIZE}px`);
            if (deform) {
                if (BLOCK_SIZE * (j + 1) > rightmost) {
                    move.canMoveRight = false;
                }
                if (BLOCK_SIZE * (i + displacement) > highest) {
                    move.canMoveDown = false;
                    move.moveDownDivide.push(highest - BLOCK_SIZE * (i + 1));
                }
                if (BLOCK_SIZE * (j - 1) < leftmost) {
                    move.canMoveLeft = false;
                }
            } else {
                if (BLOCK_SIZE * (j + 1) >= rightmost) {
                    move.canMoveRight = false;
                }
                if (BLOCK_SIZE * (i + displacement) >= highest) {
                    move.canMoveDown = false;
                    move.moveDownDivide.push(highest - BLOCK_SIZE * (i + 1));
                }
                if (BLOCK_SIZE * (j - 1) <= leftmost) {
                    move.canMoveLeft = false;
                }
            }
        });
        return move;
    };
    /**
     * 消除砖块
     * @param window 用于取得元素最终样式
     * @returns {Array} 返回每一行的元素数组,个数,高度
     */
    const eliminate = function (window) {
        let res = [],
            inactiveModels = [...document.querySelectorAll('.inactiveModel')];
        inactiveModels.sort(function (a, b) {
            return parseInt(window.getComputedStyle(a).top.replace('px', '')) - parseInt(window.getComputedStyle(b).top.replace('px', ''));
        });
        for (let i = 0; i < inactiveModels.length;) {
            let count = 0,
                models = [];
            for (let j = 0; j < inactiveModels.length; j++) {
                if (window.getComputedStyle(inactiveModels[i]).top === window.getComputedStyle(inactiveModels[j]).top) {
                    count++;
                    models.push(inactiveModels[j]);
                }
            }
            res.push({
                models: models,
                count: count,
                top: parseInt(window.getComputedStyle(inactiveModels[i]).top.replace('px', ''))
            });
            i += count;
        }
        return res;
    };
    /**
     * 当灰色砖块高于画布高偏移量,游戏结束
     * @returns {boolean}
     */
    const gameOver = function () {
        const inactiveModels = document.querySelectorAll('.inactiveModel');
        let tops = [];
        for (let v of inactiveModels) {
            tops.push(parseInt(window.getComputedStyle(v).top.replace('px', '')));
        }
        return Math.min(...tops) <= siteSize.top;
    };
    const fill = function (curTop, curLeft) {
        let model = document.createElement('div');
        model.className = 'inactiveModel';
        model.style.left = `${curLeft}px`;
        model.style.top = `${curTop}px`;
        document.body.appendChild(model);
    };
    //画出当前方块
    checkArrWith1(arr, draw);
    //记录当前方块
    let activityModels = document.querySelectorAll('.activityModel');
    /**
     * 方块自由下落
     * @type {number}
     */
    const fallDown = setTimeout(function () {
        let moveDown = canMove(arr).canMoveDown;
        if (moveDown) {
            for (let v of activityModels) {
                v.style.top = `calc(${v.style.top} + ${BLOCK_SIZE}px)`;
            }
            curTop++;
            setTimeout(arguments.callee, delay / window.__level__);
        } else {
            for (let i = 0; i < activityModels.length; i++) {
                activityModels[i].className = 'inactiveModel'
            }
            let res = eliminate(window);
            for (let i = 0; i < res.length; i++) {
                let {count, models, top} = res[i];
                if (count === parseInt(siteSize.width / BLOCK_SIZE)) {
                    for (let j = 0; j < models.length; j++) {
                        document.body.removeChild(models[j]);
                    }
                    let inactiveModels = document.querySelectorAll('.inactiveModel');
                    for (let v of inactiveModels) {
                        if (parseInt(window.getComputedStyle(v).top.replace('px', '')) < top) {
                            v.style.top = `calc(${window.getComputedStyle(v).top} + ${BLOCK_SIZE}px)`;
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
            if (!gameOver()) {
                init();
            } else {
                console.log('Game over~');
                let curTop = siteSize.height + siteSize.top - BLOCK_SIZE,
                    curLeft = siteSize.width + siteSize.left - BLOCK_SIZE;
                let fillId = setInterval(function () {
                    fill(curTop, curLeft);
                    curLeft -= BLOCK_SIZE;
                    if (curLeft < siteSize.left) {
                        curLeft = siteSize.width + siteSize.left - BLOCK_SIZE;
                        curTop -= BLOCK_SIZE;
                    }
                    if (curTop < siteSize.top) {
                        clearInterval(fillId);
                        let restart = document.querySelector('.restart');
                        restart.style.display = 'block';
                        restart.onclick = function (event) {
                            event.preventDefault();
                            restart.style.display = 'none';
                            let inactiveModels = [...document.querySelectorAll('.inactiveModel')];
                            if (inactiveModels.length > 0) {
                                for (let v of inactiveModels) {
                                    document.body.removeChild(v);
                                }
                            }
                            if (highestScore < window.__score__) {
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
                            init();
                        }
                    }
                }, 30);
            }
            clearTimeout(fallDown);
        }
    }, delay / window.__level__);
    /**
     * 键盘事件
     * @param e
     */
    document.onkeydown = function (e) {
        const key = e.keyCode;
        let move,
            canMoveLeft,
            canMoveRight,
            canMoveDown,
            moveDownDivide;
        switch (key) {
            //space
            case 32:
                let displacement = 2;
                move = canMove(arr, displacement);
                canMoveDown = move.canMoveDown;
                if (canMoveDown) {
                    for (let v of activityModels) {
                        v.style.top = `calc(${v.style.top} + ${displacement} * ${BLOCK_SIZE}px)`;
                    }
                    curTop += displacement;
                } else {
                    moveDownDivide = Math.min(...move.moveDownDivide);
                    if (moveDownDivide >= BLOCK_SIZE) {
                        for (let v of activityModels) {
                            v.style.top = `calc(${v.style.top} + ${BLOCK_SIZE}px)`;
                        }
                        curTop++;
                    }
                }
                break;
            //left
            case 37:
                canMoveLeft = canMove(arr).canMoveLeft;
                if (canMoveLeft) {
                    for (let v of activityModels) {
                        v.style.left = `calc(${v.style.left} - ${BLOCK_SIZE}px)`;
                    }
                    curLeft--;
                }
                break;
            //top
            case 38:
                let {newArr, lefts, tops}= clockwise(arr);
                move = canMove(newArr, 1, true);
                canMoveDown = move.canMoveDown;
                canMoveRight = move.canMoveRight;
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
                canMoveRight = canMove(arr).canMoveRight;
                if (canMoveRight) {
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
    const BlOCK_SIZE = 20,
        curLeft = parseInt((__siteSize__.left + __siteSize__.width / 2 - BlOCK_SIZE) / BlOCK_SIZE),
        curTop = parseInt(__siteSize__.top / BlOCK_SIZE),
        random = Math.floor(Math.random() * __arrs__.length),
        delay = 600,
        params = {
            arr: __arrs__[random],
            curLeft: curLeft,
            curTop: curTop,
            BLOCK_SIZE: BlOCK_SIZE,
            siteSize: __siteSize__,
            highestScore: __highestScore__,
            delay: delay
        };
    block(params);
};

window.onload = function () {
    const site = document.querySelector('.site');
    let {width, height, top, left} = window.getComputedStyle(site);
    let siteSize = {};
    siteSize.width = parseInt(width.replace('px', ''));
    siteSize.height = parseInt(height.replace('px', ''));
    siteSize.top = parseInt(top.replace('px', ''));
    siteSize.left = parseInt(left.replace('px', ''));
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
    //画布大小
    window.__siteSize__ = siteSize;
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
        [[1, 0], [1, 1], [1, 0]]
    ];
    init();
};


