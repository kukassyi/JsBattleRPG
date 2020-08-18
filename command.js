
const COMMAND_ARROW_DEFAULT_START_X = 15;
const COMMAND_ARROW_DEFAULT_START_Y = 325;
const COMMAND_ARROW_DEFAULT_END_X = 35;
const COMMAND_ARROW_DEFAULT_END_Y = 325;
const COMMAND_KIND = ["attack", "escape", "diffend"];
const COMMAND_NAME = ["たたかう", "にげる", "ぼうぎょ"];
//上下移動は30ずつ

const ENEMY_ARROW_DEFAULT_START_X = 0;//使わない
const ENEMY_ARROW_DEFAULT_START_Y = MONSTER_POSITION_BASE_Y - 30;
const ENEMY_ARROW_DEFAULT_END_X = 20;//使わない
const ENEMY_ARROW_DEFAULT_END_Y = MONSTER_POSITION_BASE_Y - 10;



class DrawCommandRect {

    drawImage(monsterDefPosX) {

        //色を指定する
        ctx.strokeStyle = 'rgb(255,255,255)'; //枠線の色は白
        //左から200上から80の位置に、幅100高さ50の四角の枠線を描く
        ctx.strokeRect(10, 300, 130, 160);

        ctx.font = '10pt Arial';
        ctx.font = 'bolder';
        ctx.fillStyle = 'rgba(255, 255, 255)';
        ctx.fillText(COMMAND_NAME[0], 40, 330);
        ctx.fillText(COMMAND_NAME[1], 40, 360);
        ctx.fillText(COMMAND_NAME[2], 40, 390);
        ctx.beginPath();

        ctx.arrow(COMMAND_ARROW_DEFAULT_START_X,
            COMMAND_ARROW_DEFAULT_START_Y,
            COMMAND_ARROW_DEFAULT_END_X,
            COMMAND_ARROW_DEFAULT_END_Y,
            [0, 3, -10, 3, -10, 7]);

        ctx.arrow(monsterDefPosX,
            ENEMY_ARROW_DEFAULT_START_Y,
            monsterDefPosX,
            ENEMY_ARROW_DEFAULT_END_Y,
            [0, 3, -10, 3, -10, 7]);

        // ctx.moveTo(monsterDefPosX, ENEMY_ARROW_DEFAULT_START_Y);
        // ctx.lineTo(monsterDefPosX-5, ENEMY_ARROW_DEFAULT_START_Y-10);
        // ctx.lineTo(monsterDefPosX+5, ENEMY_ARROW_DEFAULT_START_Y-10);

        ctx.stroke();

    }
}

class Command {
    constructor(member, commandKind, target) {
        this.member = member;
        this.commandKind = commandKind;
        this.target = target;
    }
}

let taisyou = 0;
let command = 0;
let membernum = 0;
let dethNum = 0;

let selectedCommands = [];
let setCommandFunc = function (e) {
    if (e.key === "ArrowLeft") {
        if (0 < taisyou) {
            console.log(taisyou);
            taisyou -= 1
            //斃されたモンスターを除外する
            while (!setEnemyArrowImg(monsters[taisyou])) {
                if (0 >= taisyou) {
                    //左端が選択された場合は右端に遷移
                    taisyou = monsters.length - 1;
                } else {
                    taisyou -= 1;
                }
            }
        }
    }
    if (e.key === "ArrowUp") {
        if (0 < command) {
            command -= 1
            setCommandArrowImg(command);
        }
    }
    if (e.key === "ArrowRight") {

        if (monsters.length - 1 > taisyou) {
            taisyou += 1
            while (!setEnemyArrowImg(monsters[taisyou])) {
                if (monsters.length - 1 <= taisyou) {
                    //左端が選択された場合は右端に遷移
                    taisyou = 0;
                } else {
                    taisyou += 1;
                }
            }
        }
    }
    if (e.key === "ArrowDown") {
        if (COMMAND_KIND.length - 1 > command) {
            command += 1
            setCommandArrowImg(command);
        }
    }
    if (e.key === "Enter") {

        //死んでるモンスターは選択しない
        if (monsters[taisyou].HP > 0) {
            //生きているメンバーのみ戦闘に加わる
            if (partyMember[membernum].HP > 0) {
                selectedCommands.push(new Command(partyMember[membernum],
                    COMMAND_KIND[command], monsters[taisyou]));

                pringMessage(partyMember[membernum].name + "が"
                + monsters[taisyou].name + "に" + COMMAND_NAME[command] );
            }
            //今入力している人の順番をカウントアップ
            ++membernum;
            //死者を数える
            let dethNum = 0;
            for (let i = 0; i < partyMember.length; i++) {
                if (partyMember[i].HP <= 0) {
                    ++dethNum;
                }
            }
            console.log("dethNum::" + dethNum);
            console.log("membernum::" + membernum);
            //生きている人分コマンド入力が終わったら終了
            if (membernum >= 3 - dethNum) {
                //コマンド入力状態を戦闘状態に変更
                onCommandInput = false;
                membernum = 0;//コマンド入力メンバー順序をクリア
                //矢印クリア
                ctx.clearRect(20, ENEMY_ARROW_DEFAULT_START_Y - 10, CANVAS_SIZE_W, 35);
                ctx.clearRect(COMMAND_ARROW_DEFAULT_START_X - 2,
                    COMMAND_ARROW_DEFAULT_START_Y - 10, 23, 140);
            }
        }
    }
    if (e.keyCode == 32) {
        //↓テスト用
        // mon.attack(partyMember[1]);
        // drawMemberProperty(partyMember);
        //↑テスト用
    }
}

let setEnemyArrowImg = function (setMonster) {

    if (setMonster.HP <= 0) {
        return false;
    }

    ctx.clearRect(20, ENEMY_ARROW_DEFAULT_START_Y - 10, CANVAS_SIZE_W, 35);

    ctx.beginPath();
    ctx.arrow(setMonster.posX + setMonster.sizeX / 2,
        ENEMY_ARROW_DEFAULT_START_Y,
        setMonster.posX + setMonster.sizeX / 2,
        ENEMY_ARROW_DEFAULT_END_Y,
        [0, 3, -10, 3, -10, 7]);
    ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(setMonster.posX, ENEMY_ARROW_DEFAULT_START_Y);
    // ctx.lineTo(setMonster.posX-5, ENEMY_ARROW_DEFAULT_START_Y-10);
    // ctx.lineTo(setMonster.posX+5, ENEMY_ARROW_DEFAULT_START_Y-10);
    ctx.stroke();
    return true;
}

let setCommandArrowImg = function (command) {
    if (command < 0 || command > COMMAND_KIND.length - 1) {
        return false;
    }
    ctx.clearRect(COMMAND_ARROW_DEFAULT_START_X - 2,
        COMMAND_ARROW_DEFAULT_START_Y - 10,
        23,
        140);
    ctx.beginPath();
    ctx.arrow(COMMAND_ARROW_DEFAULT_START_X,
        COMMAND_ARROW_DEFAULT_START_Y + command * 30,
        COMMAND_ARROW_DEFAULT_START_X + 20,
        COMMAND_ARROW_DEFAULT_START_Y + command * 30,
        [0, 3, -10, 3, -10, 7]);
    ctx.stroke();
}



