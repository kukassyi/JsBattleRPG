



//モンスターオブジェクトを作成する
let monsters = appierMonster();

//中心に位置を修正
for(let i=0;i<monsters.length;i++){
    monsters[i].posX = monsters[i].posX + 
        (CANVAS_SIZE_W - (monsters[monsters.length-1].posX + 
            monsters[monsters.length-1].sizeX))/2;
}

//パーティー側の描写
//外枠と固定値
let drawRect = new DrawRect();
drawRect.drawImage();
//パーティーメンバーの生成
let partyMember = getNewPartyMember();
drawMemberProperty(partyMember);
//コマンドの描写
let drawCommandRect = new DrawCommandRect();
drawCommandRect.drawImage(monsters[0].posX + monsters[0].sizeX/2);

let drawMessageRect = new DrawMessageRect();
drawMessageRect.drawFlame();

//StateパータンのState+Contextのインスタンス化、最初はコマンド入力モード
let newContextInstance = new ContextState(new CommandState());

//Stateパターンでエンター押下時の処理を分岐する
window.addEventListener("keydown", (e) => {

    newContextInstance.contextExcec(e);
    
});