
//TODO　本来はメンバーのプロパティで持つべき
//TODO  魔法もクラス化する
const COMMAND_MASIC_KIND = ["fire", "apaman", "care", "back"];
const COMMAND_MASIC_NAME = ["ファイア", "アパマン", "ケア", "戻る"];
const MASIC_PROPERTY_USEMP = [20, 50, 10, 0];

let masicCommandDraw = function () {
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
    ctx.fillText(COMMAND_MASIC_NAME[0], 40, 330);
    ctx.fillText(COMMAND_MASIC_NAME[1], 40, 360);
    ctx.fillText(COMMAND_MASIC_NAME[2], 40, 390);
    ctx.fillText(COMMAND_MASIC_NAME[3], 40, 420);

    ctx.beginPath();

    ctx.arrow(COMMAND_ARROW_DEFAULT_START_X,
        COMMAND_ARROW_DEFAULT_START_Y,
        COMMAND_ARROW_DEFAULT_END_X,
        COMMAND_ARROW_DEFAULT_END_Y,
        [0, 3, -10, 3, -10, 7]);

    ctx.stroke();

}



class MasicCommand extends ContextState {

    constructor() {
        super();
        this.selectMasic = 0;
        masicCommandDraw();
    }

    excecCommand(e) {

        if (e.key === "Enter") {
            if (COMMAND_MASIC_KIND[this.selectMasic] == "back") {
                return new CommandState();
            }

            //選択した魔法の消費MPを比較する
            if ((partyMember[membernum].MP - MASIC_PROPERTY_USEMP[this.selectMasic]) >= 0) {
                //魔法により処理を分ける
                //TODO 本来は移譲を使って魔法クラスで処理をする
                if (COMMAND_MASIC_KIND[this.selectMasic] == "fire") {
                    selectedCommands.push(new Command(partyMember[membernum],
                        COMMAND_KIND[command], "fire", monsters[taisyou]));

                    pringMessage(partyMember[membernum].name + "が"
                        + monsters[taisyou].name + "に"
                        + COMMAND_MASIC_NAME[this.selectMasic]);

                } else if (COMMAND_MASIC_KIND[this.selectMasic] == "apaman") {
                    for (let i = 0; i < monsters.length; i++) {
                        //全部のモンスターが対象
                        selectedCommands.push(new Command(partyMember[membernum],
                            COMMAND_KIND[command], "apaman", monsters[i]));
                    }
                    pringMessage(partyMember[membernum].name + "は" +
                        COMMAND_MASIC_NAME[this.selectMasic] + "を選択");
                } else if (COMMAND_MASIC_KIND[this.selectMasic] == "care") {
                    return new MemberCommand();
                }
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
            } else {
                console.log("partyMember[membernum]::" + partyMember[membernum].HP);
                console.log("MASIC_PROPERTY_USEMP[this.selectMasic]::" + MASIC_PROPERTY_USEMP[this.selectMasic]);
                pringMessage("MPが足りません");
            }
        }
        if (e.key === "ArrowUp") {
            if (0 < this.selectMasic) {
                this.selectMasic -= 1
                setCommandArrowImg(this.selectMasic);
            }
        }
        if (e.key === "ArrowDown") {
            if (COMMAND_MASIC_KIND.length - 1 > this.selectMasic) {
                this.selectMasic += 1
                setCommandArrowImg(this.selectMasic);
            }
        }
        return this;
    }
}