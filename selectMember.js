
let memberCommandDraw = function () {
    //**消す処理
    ctx.clearRect(10, 300, 130, 160);

    //**追記する処理
    //色を指定する
    ctx.strokeStyle = 'rgb(255,255,255)'; //枠線の色は白
    //左から200上から80の位置に、幅100高さ50の四角の枠線を描く
    ctx.strokeRect(10, 300, 130, 160);

    //コマンド記述
    ctx.font = '10pt Arial';
    ctx.font = 'bolder';
    ctx.fillStyle = 'rgba(255, 255, 255)';
    ctx.fillText(partyMember[0].name, 40, 330);
    ctx.fillText(partyMember[1].name, 40, 360);
    ctx.fillText(partyMember[2].name, 40, 390);

    ctx.beginPath();

    ctx.arrow(COMMAND_ARROW_DEFAULT_START_X,
        COMMAND_ARROW_DEFAULT_START_Y,
        COMMAND_ARROW_DEFAULT_END_X,
        COMMAND_ARROW_DEFAULT_END_Y,
        [0, 3, -10, 3, -10, 7]);

    ctx.stroke();
}


class MemberCommand extends ContextState {
    constructor() {
        super();
        this.selectMember = 0;
        memberCommandDraw();
    }

    excecCommand(e) {
        if (e.key === "Enter") {
            selectedCommands.push(new Command(partyMember[membernum],
                COMMAND_KIND[command], "care", partyMember[this.selectMember]));

            pringMessage(partyMember[membernum].name + "が"
                + partyMember[this.selectMember].name + "に"
                + "ケア");

            ++membernum;
            if (membernum >= partyMember.length) {
                membernum = 0;//コマンド入力メンバー順序をクリア
                //矢印クリア
                ctx.clearRect(20, ENEMY_ARROW_DEFAULT_START_Y - 10, CANVAS_SIZE_W, 35);
                ctx.clearRect(COMMAND_ARROW_DEFAULT_START_X - 2,
                    COMMAND_ARROW_DEFAULT_START_Y - 10, 23, 140);
                return new BattleState();
            } else {
                return new CommandState();
            }

        }
        if (e.key === "ArrowUp") {
            if (0 < this.selectMember) {
                this.selectMember -= 1
                setCommandArrowImg(this.selectMember);
            }
        }
        if (e.key === "ArrowDown") {
            if (COMMAND_MASIC_KIND.length - 1 > this.selectMember) {
                this.selectMember += 1
                setCommandArrowImg(this.selectMember);
            }
        }
        return this;
    }
}