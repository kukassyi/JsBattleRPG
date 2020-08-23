
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
                monsters[i], "attack", "", pm));
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
let canMasicSpelling=true;
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
                ctx.clearRect(160, 310, 400, 140);
                pringMessage(allBattleTurn[turnCounter].member.name + "は逃げ出した");
                //メンバーの平均素早さとモンスターの平均素早さで判定する
                let monsterQuick = 0;
                for (let i = 0; i < monsters.length; i++) {
                    monsterQuick = monsterQuick + monsters[i].quickness;
                }
                let avgMonQuick = monsterQuick / monsters.length;

                let playerQuick = 0;
                for (let i = 0; i < partyMember.length; i++) {
                    playerQuick = playerQuick + partyMember[i].quickness;
                }
                let avgPlayerQuick = playerQuick / partyMember.length;

                let isSuccess = false;
                //判定
                if ((avgPlayerQuick - avgMonQuick) >= 0) {
                    //素早さが勝った時
                    if (getRandomInt(10) > 2) {
                        isSuccess = true;//7割り成功
                    }
                } else {
                    //素早さが負けた時
                    if (getRandomInt(10) > 6) {
                        isSuccess = true;//3割り成功
                    }
                }
                //判定結果
                if (isSuccess) {
                    return 3;
                } else {
                    //ふるぼっこ
                    ctx.clearRect(160, 310, 400, 140);
                    pringMessage("しかし回り込まれてしまった");
                    let commandMonsters = [];
                    commandMonsters = setMonsterCommands();
                    //攻撃スレッドにモンスター分だけ追加して攻撃を受ける
                    Array.prototype.splice.apply(allBattleTurn, [turnCounter + 1, 0]
                        .concat(commandMonsters));
                }
                break;
            case "diffend":
                allBattleTurn[turnCounter].member.diffend();
                pringMessage(allBattleTurn[turnCounter].member.name + "は防御している");
                break;
            case "masic":
                if(canMasicSpelling){
                    pringMessage(allBattleTurn[turnCounter].member.name + "は" + 
                    COMMAND_MASIC_NAME[COMMAND_MASIC_KIND.indexOf(allBattleTurn[turnCounter].masicKind)]
                    + "を唱えた");
                    //MPを減らす
                    allBattleTurn[turnCounter].member.MP = allBattleTurn[turnCounter].member.MP
                    - MASIC_PROPERTY_USEMP[COMMAND_MASIC_KIND.indexOf(allBattleTurn[turnCounter].masicKind)];
                }   
                
                let beforHP = allBattleTurn[turnCounter].target.HP;
                allBattleTurn[turnCounter].member.masic(
                    allBattleTurn[turnCounter].target,
                    allBattleTurn[turnCounter].masicKind,canMasicSpelling);
                let damage = beforHP - allBattleTurn[turnCounter].target.HP;

                if(beforHP>0 && damage>=0){
                    pringMessage(allBattleTurn[turnCounter].target.name + "に" + damage + "のダメージ");
                }else if(damage < 0){
                    damage = -1 * damage;
                    pringMessage(allBattleTurn[turnCounter].target.name + "が" + damage + "だけ回復");

                }
                drawMemberProperty(partyMember);
                canMasicSpelling=false;
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
            } else if (winOrLose == 3) {
                return new EndBattleState("escape");
            }
            ++turnCounter;

            //ターン終了処理
            if (allBattleTurn.length <= turnCounter) {
                onCommandInput = true;
                canMasicSpelling=true;
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