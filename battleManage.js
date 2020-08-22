
//モンスターの攻撃対象を決める
let setMonsterCommands = function () {
    let commandMonsters = [];
    //コマンドとターゲットを決める 
    for (let i = 0; i < monsters.length; i++) {
        if (monsters[i].HP > 0) {
            let pm = partyMember[getRandomInt(3)];;
            while (pm.HP <= 0) {
                pm = partyMember[getRandomInt(3)];
            }

            commandMonsters.push(new Command(
                monsters[i], "attack", pm));
        }
    }

    return commandMonsters;
}

//敵味方全部の戦闘順序を決定する
let allBattleTurn = [];
let setBattleTurn = function () {

    let commandMonsters = setMonsterCommands();
    allBattleTurn = [];

    for (let i = 0; i < selectedCommands.length; i++) {
        if (selectedCommands[i].member.HP > 0) {
            allBattleTurn.push(selectedCommands[i]);
        }

    }
    for (let i = 0; i < commandMonsters.length; i++) {
        allBattleTurn.push(commandMonsters[i]);
    }

    allBattleTurn.sort(function (a, b) {
        if (a.member.quickness > b.member.quickness) return -1;
        if (a.member.quickness < b.member.quickness) return 1;
        return 0;
    }
    );

    return allBattleTurn;
}

//戦闘実行
let excecMainBattle = function () {

    console.log(allBattleTurn);
    console.log(turnCounter);

    //自分がHP>0のときに実行
    if (allBattleTurn[turnCounter].member.HP > 0) {

        switch (allBattleTurn[turnCounter].commandKind) {
            case "attack":
                //相手がHP<=0なら何もしない
                if (allBattleTurn[turnCounter].target.HP > 0) {
                    let beforHP = allBattleTurn[turnCounter].target.HP;

                    allBattleTurn[turnCounter].member.attack(
                        allBattleTurn[turnCounter].target,
                        allBattleTurn[turnCounter].member.Power);

                    //TODO パーティーメンバーが攻撃を受けた時のみ更新するように判別式追加
                    drawMemberProperty(partyMember);

                    let damage = beforHP - allBattleTurn[turnCounter].target.HP;
                    console.log("damage:::" + damage);

                    pringMessage(allBattleTurn[turnCounter].member.name + "が"
                        + allBattleTurn[turnCounter].target.name + "をこうげき");

                    pringMessage(allBattleTurn[turnCounter].target.name + "に" + damage + "のダメージ");

                    //攻撃対象を倒したかチェック
                    if (allBattleTurn[turnCounter].target.HP <= 0) {
                        if (allBattleTurn[turnCounter].target.job == "monster") {
                            pringMessage(allBattleTurn[turnCounter].target.name + "を倒した");
                        } else {
                            pringMessage(allBattleTurn[turnCounter].target.name + "は死んでしまった");
                        }
                    }
                } else {
                    pringMessage(allBattleTurn[turnCounter].target.name + "は死んでいる");
                }
                break;
            case "escape":

                break;
            case "diffend":
                allBattleTurn[turnCounter].member.diffend();
                pringMessage(allBattleTurn[turnCounter].member.name + "は防御している");
                break;
        }
        //戦闘終了チェック
        //モンスターのHPが全員０の場合は終了
        let isExtinctionMonster = true;
        for (let i = 0; i < monsters.length; i++) {
            if (monsters[i].HP > 0) {
                isExtinctionMonster = false;
                break;
            }
        }
        //終了処理
        if (isExtinctionMonster) {
            battleEnd = true;
            return 1;
        }
        //メンバーのHPが全員０の場合は終了
        let isExtinctionParty = true;
        for (let i = 0; i < partyMember.length; i++) {
            if (partyMember[i].HP > 0) {
                isExtinctionParty = false;
                break;
            }
        }
        //終了処理
        if (isExtinctionParty) {
            battleEnd = true;
            return 2;
        }
    }
    return 0;
}

//最初に呼び出され、戦闘の順序決めと実行
let turnCounter = 0;

class BattleState extends ContextState {
    excecCommand(e) {

        if (e.key === "Enter") {

            if (turnCounter == 0) {
                allBattleTurn = setBattleTurn();
            }

            let winOrLose = excecMainBattle();
            if (winOrLose == 1) {
                return new EndBattleState("win");
            } else if (winOrLose == 2) {
                return new EndBattleState("lose");
            }
            ++turnCounter;

            //ターン終了処理
            if (allBattleTurn.length <= turnCounter) {
                onCommandInput = true;
                turnCounter = 0;
                selectedCommands = [];
                command = 0;
                //防御の場合は防御を解く
                allBattleTurn.filter(o => o.member.isDiffending == true)
                    .forEach(o => o.member.difence = o.member.difence / 2);
                allBattleTurn.filter(o => o.member.isDiffending == true)
                    .forEach(o => o.member.isDiffending = false);

                //敵の矢印位置を合わせる
                for (let i = 0; i < monsters.length; i++) {
                    if (monsters[i].HP > 0) {
                        drawCommandRect.drawImage(monsters[i].posX + monsters[i].sizeX / 2);
                        taisyou = i;
                        break;
                    }
                }

                return new CommandState();
            }

        }
        return this;
    }

}