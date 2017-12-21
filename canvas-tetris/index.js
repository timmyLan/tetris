/**
 * Created by llan on 2017/2/14.
 */
window.onload = ()=> {
    let canvas = document.querySelector('#canvas'),
        ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 300, 300);
    ctx.fillRect(0, 0, 300, 300);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    let arr = [[1, 0], [1, 0], [1, 1]];
    const draw = (arr, remove = false) => {
        ctx.fillStyle = remove ? 'rgb(0,0,0)' : 'rgba(255,255,255,0.8)';
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[0].length; j++) {
                if (arr[i][j] === 1) {
                    ctx.fillRect(j * 20, i * 20, 20, 20);
                }
            }
        }
    };
    draw(arr);
    document.onkeydown = (e)=> {
        let key = e.keyCode;
        switch (key) {
            //left
            case 37:
                draw(arr, true);
                ctx.translate(-20, 0);
                draw(arr);
                console.log('left');
                break;
            //right
            case 39:
                draw(arr, true);
                ctx.translate(20, 0);
                draw(arr);
                console.log('right');
                break;
            //up
            case 38:
                draw(arr,true);
                ctx.rotate(Math.PI/2);
                draw(arr);
                console.log('up');
                break;
            default:
                break;
        }
    }
};
