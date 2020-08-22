
class EndBattleState extends ContextState {

    constructor(winOrLose) {
        super();
        this.winOrLose = winOrLose;
    }

    excecCommand(e) {
        if (this.winOrLose == "win") {
            this.endBattleWin();
        } else {
            this.endBattleLose();
        }
        return this;
    }

    endBattleLose() {
        messageDipsList = [];
        ctx.clearRect(160, 310, 400, 140);
        pringMessage("パーティは全滅しました");
    }

    endBattleWin() {
        messageDipsList = [];
        ctx.clearRect(160, 310, 400, 140);
        pringMessage("モンスターを倒した");
    }

}