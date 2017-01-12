/**
 * Created by llan on 2017/1/11.
 */
const block = function (params = {
    arr: [[1, 0], [1, 0], [1, 1]],
    curLeft: 0,
    curTop: 0,
    BLOCK_SIZE: 20
}) {
    //方块矩阵
    let arr = params.arr,
        curLeft = params.curLeft,
        curTop = params.curTop;
    //方块大小
    const BLOCK_SIZE = params.BLOCK_SIZE;
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
                //记录转变后的矩阵
                arr = newArr;
                for (let i in lefts) {
                    // activityModels[i].style.left = `calc(${lefts[i]}px + ${curLeft}px)`;
                    // activityModels[i].style.top = `calc(${tops[i]}px + ${curTop}px)`;
                    activityModels[i].style.left = `${lefts[i]}px`;
                    activityModels[i].style.top = `${tops[i]}px`;
                }
                break;
            //left
            case 37:
                for (let v of activityModels) {
                    v.style.left = `calc(${v.style.left } - ${BLOCK_SIZE}px)`;
                }
                curLeft--;
                break;
            //top
            case 38:
                for (let v of activityModels) {
                    v.style.top = `calc(${v.style.top } - ${BLOCK_SIZE}px)`;
                }
                curTop--;
                break;
            //right
            case 39:
                for (let v of activityModels) {
                    v.style.left = `calc(${v.style.left } + ${BLOCK_SIZE}px)`;
                }
                curLeft++;
                break;
            //down
            case 40:
                for (let v of activityModels) {
                    v.style.top = `calc(${v.style.top } + ${BLOCK_SIZE}px)`;
                }
                curTop++;
                break;
            default:
                break;
        }
    };
};

(function init() {
    const params = {
        arr: [[1, 0], [1, 0], [1, 1]],
        curLeft: 2,
        curTop: 3,
        BLOCK_SIZE: 20
    };
    block(params);
})();


