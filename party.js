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
        let lifeValue = 0;
        //ダメージ計算
        lifeValue = Math.floor(enemy.HP - (Power * (1 + getRandomInt(9) * 0.1)
            - enemy.difence / 8));
        if (lifeValue <= 0) {
            lifeValue = 0;
        }
        enemy.HP = lifeValue;
        //敵キャラ点滅処理
        blinkManage(enemy).then(() => {
            if (enemy.HP <= 0) {
                enemy.deleteImage();
            } else {
                enemy.drawImage();
            }
        });

        console.log("life:" + lifeValue);
        return true;
    }

    masic(enemy, masicKind) {
        if (enemy.HP <= 0) {
            return false;
        }
        let lifeValue = 0;

        if (masicKind == "care") {
            //回復量計算
            lifeValue = Math.floor(enemy.HP + (this.masicOffence) * (1 + getRandomInt(9) * 0.1));
            enemy.HP = lifeValue;

            doMemberMasicPerform(masicKind);
        } else {
            //ダメージ計算
            lifeValue = Math.floor(enemy.HP - (this.masicOffence) * (1.5 + getRandomInt(9) * 0.1)
                - enemy.masicDifence / 8);
            if (lifeValue <= 0) {
                lifeValue = 0;
            }
            enemy.HP = lifeValue;

            //敵キャラ演出処理
            doMasicPerform(enemy, masicKind,canMasicSpelling).then(() => {
                //敵キャラ点滅処理
                blinkManage(enemy).then(() => {
                    if (enemy.HP <= 0) {
                        enemy.deleteImage();
                    } else {
                        enemy.drawImage();
                    }
                });
            });
        }
        console.log("life:" + lifeValue);
        return true;
    }

    diffend() {
        this.isDiffending = true;
        this.difence = this.difence * 2;
    }

    defendReleace() {
        this.isDiffending = false;
        this.difence = this.difence / 2;
    }
}

class Warrier extends Human {

    constructor() {
        super();
        this.HP = 150 + getRandomInt(100);
        this.MP = 8;
        this.Power = 50 + getRandomInt(20);
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


class Wizard extends Human {

    constructor() {
        super();
        this.HP = 80 + getRandomInt(50);
        this.MP = 80 + getRandomInt(50);
        this.Power = 10 + getRandomInt(10);
        this.masicOffence = 60;
        this.quickness = 30 + getRandomInt(10);
        this.difence = 35 + getRandomInt(10);
        this.masicDifence = 50 + getRandomInt(30);
        this.Level = 5 + getRandomInt(5);
        this.isDiffending = false;
        this.name = "メンバー" + getRandomInt(100);
        this.job = "魔術師";
    }
    attack(enemy) {
        return super.attack(enemy, this.Power);
    }
}



let getNewPartyMember = function () {
    let partyMembarList = [];
    partyMembarList.push(new Warrier());
    partyMembarList.push(new Warrier());
    partyMembarList.push(new Wizard());

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


let isMemberPerformOK = true;
let doMemberMasicPerform = function (masicKind,canMasicSpelling) {
    if (!isMemberPerformOK) {
        //完了前に連続実行された場合は実行しない
        return new Promise((resolve, reject) => {
            isMemberPerformOK = true;
            resolve();
        });
    }
    ///演出処理開始
    drawMemberPerform(masicKind);
    isMemberPerformOK = false;
    return new Promise((resolve, reject) => {
        setTimeout(
            function () {
                //演出削除処理
                drawMemberProperty(partyMember);
                ctx.strokeRect(10, 10, 420, 120);
                ctx.fillText('HP', 40, 40);
                ctx.fillText('MP', 40, 60);
                ctx.fillText('LV', 40, 80);
                ctx.fillText('名前', 40, 100);
                ctx.fillText('職業', 40, 120);
        
                ctx.stroke();
                isMemberPerformOK = true;
                resolve();
            },
            400
        );
    });

}

//画像表示
function drawMemberPerform(masicKind) {

    const img = new Image();
    if(masicKind == "care"){
        img.src = "care.png";
    }
    img.onload = () => ctx.drawImage(img, 10, 10, 420, 120);
}

//モンスター側演出処理
let isPerformOK = true;
let doMasicPerform = function (enemy, masicKind) {
    if (!isPerformOK) {
        //完了前に連続実行された場合は実行しない
        return new Promise((resolve, reject) => {
            isPerformOK = true;
            resolve();
        });
    }
    //演出処理開始
    drawEnemyPerform(enemy, masicKind);
    isPerformOK = false;
    return new Promise((resolve, reject) => {
        setTimeout(
            function () {
                //演出削除処理
                deletePerform(enemy)
                isPerformOK = true;
                resolve();
            },
            400
        );
    });
}

//画像表示
function drawEnemyPerform(enemy, masicKind) {

    const img = new Image();
    if(masicKind == "fire"){
        img.src = "fire.png";
    }else if(masicKind == "apaman"){
        img.src = "apaman.png";
    }    
    img.onload = () => ctx.drawImage(img, enemy.posX, enemy.posY, enemy.sizeX, enemy.sizeY);
}



//演出削除＋モンスター再描画
function deletePerform(enemy) {
    enemy.deleteImage();
    enemy.drawImage();
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

let doOK = true;
let blinkManage = function (enemy) {
    if (!doOK) {
        //完了前に連続実行された場合は実行しない
        return new Promise((resolve, reject) => {
            doOKDisp = true;
            resolve();
        });
    }
    startTimer(enemy);
    doOK = false;
    return new Promise((resolve, reject) => {
        setTimeout(
            function () {
                stopTimer();
                doOK = true;
                resolve();
            },
            200
        );
    });
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


