class DrawRect {

    drawImage() {

        ctx.fillRect(200, 300, 10, 10);

        //色を指定する
        ctx.strokeStyle = 'rgb(255,255,255)'; //枠線の色は白
        //左から200上から80の位置に、幅100高さ50の四角の枠線を描く
        ctx.strokeRect(10, 10, 420, 120);

        ctx.font = '10pt Arial';
        ctx.font = 'bolder';
        ctx.fillStyle = 'rgba(255, 255, 255)';
        ctx.fillText('HP', 40, 40);
        ctx.fillText('MP', 40, 60);
        ctx.fillText('LV', 40, 80);
        ctx.fillText('名前', 40, 100);
        ctx.fillText('職業', 40, 120);

        ctx.fill();
    }
}


class Human {

    attack(enemy, Power) {
        if (enemy.HP <= 0) {
            console.log(enemy.HP);
            return false;
        }

        //ダメージ計算
        let lifeValue = Math.floor(enemy.HP - (Power * (1 + getRandomInt(9) * 0.1)
                                                    -enemy.difence/8));

        //敵キャラ点滅処理
         blinkManage(enemy);

        console.log("life:" + lifeValue);
        if (lifeValue <= 0) {
            lifeValue = 0;
            //非同期処理待ち
            setTimeout(
                function () {
                    enemy.deleteImage();
                },
                400
            );

        } else {
            //非同期処理待ち
            setTimeout(
                function () {
                    enemy.drawImage();
                },
                400
            );
        }
        enemy.HP = lifeValue;
        return true;
    }

    masic() { }

    diffend() { 
        this.isDiffending = true;
        this.difence = this.difence*2;
    }

    defendReleace(){
        this.isDiffending = false;
        this.difence = this.difence/2;
    }

    
    escape(){}

    item() { }

}

class Warrier extends Human {

    constructor() {
        super();
        this.HP = 150 + getRandomInt(100);
        this.MP = 10;
        this.Power = 20 + getRandomInt(20);
        this.masicOffence = 10;
        this.quickness = 50 + getRandomInt(10);
        this.difence = 55 + getRandomInt(20);
        this.masicDifence = 35;
        this.Level = 5 + getRandomInt(5);
        this.isDiffending = false;
        this.name = "メンバー" + getRandomInt(100);
        this.job = "戦士";
    }
    attack(enemy) {
        return super.attack(enemy, this.Power);
    }
}

let getNewPartyMember = function () {
    let partyMembarList = [];
    partyMembarList.push(new Warrier);
    partyMembarList.push(new Warrier);
    partyMembarList.push(new Warrier);

    return partyMembarList;
}

let drawMemberProperty = function (partyMembarList) {
    ctx.clearRect(80, 20, 300, 100);
    for (let i = 0; i < partyMembarList.length; i++) {

        ctx.fillText(partyMembarList[i].HP, 100 + i * 100, 40);
        ctx.fillText(partyMembarList[i].MP, 100 + i * 100, 60);
        ctx.fillText(partyMembarList[i].Level, 100 + i * 100, 80);
        ctx.fillText(partyMembarList[i].name, 100 + i * 100, 100);
        ctx.fillText(partyMembarList[i].job, 100 + i * 100, 120);
    }

}

//敵キャラ点滅処理
let blinkTimer;
function startTimer(enemy) {
    blinkTimer = setInterval(function () {
        blink(enemy);
    }, 100);
}

function stopTimer() {
    clearInterval(blinkTimer);
}

let blinkManage = function (enemy) {
     startTimer(enemy);
    setTimeout(
        function () {
            stopTimer();
        },
        200
    );
}

let blinkflg = true;
let blink = function (enemy) {
    if (blinkflg) {

        enemy.deleteImage();
    } else {

        enemy.drawImage();
    }
    blinkflg = !blinkflg;
}


