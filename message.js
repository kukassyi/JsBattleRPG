
class DrawMessageRect {
    drawFlame() {
        //色を指定する
        ctx.strokeStyle = 'rgb(255,255,255)'; //枠線の色は白
        //左から200上から80の位置に、幅130高さ160の四角の枠線を描く
        ctx.strokeRect(155, 300, 450, 160);

        ctx.font = '10pt Arial';
        ctx.font = 'bolder';
        ctx.fillStyle = 'rgba(255, 255, 255)';
        ctx.stroke();
    }
}

let messageDipsList = [];
let pringMessage = function(message){
    if(messageDipsList.length >=7){
        messageDipsList.shift();
    }

    messageDipsList.push(message);

    ctx.clearRect(160, 310, 400, 140);

    for(let i=0;i< messageDipsList.length;i++){
        ctx.fillText(messageDipsList[i], 165, 325 + i* 20);
    }
    
}
//メッセージの消去
let crearMessage = function(){
    messageDipsList=[];
    ctx.clearRect(160, 310, 400, 140);
}

