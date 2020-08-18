
const MONSTER_SIZE_X_SM = 40
const MONSTER_SIZE_X_MD = 60
const MONSTER_SIZE_X_LG = 80

const MONSTER_SIZE_Y_SM = 40
const MONSTER_SIZE_Y_MD = 60
const MONSTER_SIZE_Y_LG = 80

const MONSTER_POSITION_BASE_X = 0
const MONSTER_POSITION_BASE_Y = 200

const MONSTER_BETWEEN_SPACE = 5;

//モンスタークラス
class Monster {

  drawImage() {
    ctx.drawImage(this.img, this.posX, this.posY, this.sizeX, this.sizeY)
  }

  deleteImage() {
    ctx.clearRect(this.posX, this.posY, this.sizeX, this.sizeY);
  }


  attack(enemy, Power) {
    if (enemy.HP <= 0) {
      console.log(enemy.HP);
      return false;
    }

    let lifeValue = Math.floor(enemy.HP - (Power * (1 + getRandomInt(9) * 0.1)
      - enemy.difence / 8));

    //画面点滅処理
    blinkManageDisp();
    canvas.style.backgroundColor = 'black';
    if (lifeValue <= 0) {
      lifeValue = 0;

    }
    enemy.HP = lifeValue;

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

class Monument extends Monster {
  constructor(posX) {
    super()
    //画面表示
    const img = new Image()
    img.src = "http://mwhidesp.konjiki.jp/a121-150/monument.png"
    this.img = img
    this.posX = posX
    this.posY = MONSTER_POSITION_BASE_Y
    this.sizeX = MONSTER_SIZE_X_MD
    this.sizeY = MONSTER_SIZE_Y_MD
    img.onload = () => this.drawImage()
    //ステータス
    this.HP = 30;
    this.MP = 10;
    this.Power = 45;
    this.masicOffence = 10;
    this.quickness = 27;
    this.difence = 60;
    this.masicDifence = 5;
    this.Level = 5;
    this.isDiffending = false;
    this.name = "モニュメント";
    this.job = "monster";
  }
  attack(enemy) {
    return super.attack(enemy, this.Power);
  }

}

class Browney extends Monster {
  constructor(posX) {
    super()
    //画面表示
    const img = new Image()
    img.src = "http://mwhidesp.konjiki.jp/a121-150/browney.png"
    this.img = img
    this.posX = posX
    this.posY = MONSTER_POSITION_BASE_Y
    this.sizeX = MONSTER_SIZE_X_MD
    this.sizeY = MONSTER_SIZE_Y_MD
    img.onload = () => this.drawImage()
    //ステータス
    this.HP = 25;
    this.MP = 30;
    this.Power = 33;
    this.masicOffence = 50;
    this.quickness = 40;
    this.difence = 50;
    this.masicDifence = 15;
    this.Level = 6;
    this.isDiffending = false;
    this.name = "ブラウニー";
    this.job = "monster";
  }
  attack(enemy) {
    return super.attack(enemy, this.Power);
  }

}


class DevilInsect extends Monster {
  constructor(posX) {
    super()
    //画面表示
    const img = new Image()
    img.src = "http://mwhidesp.konjiki.jp/a121-150/devil-insect.png"
    this.img = img
    this.posX = posX
    this.posY = MONSTER_POSITION_BASE_Y
    this.sizeX = MONSTER_SIZE_X_LG
    this.sizeY = MONSTER_SIZE_Y_LG
    img.onload = () => this.drawImage()
    //ステータス
    this.HP = 270;
    this.MP = 60;
    this.Power = 67;
    this.masicOffence = 35;
    this.quickness = 80;
    this.difence = 80;
    this.masicDifence = 39;
    this.Level = 8;
    this.isDiffending = false;
    this.name = "魔界虫";
    this.job = "monster";
  }
  attack(enemy) {
    return super.attack(enemy, this.Power);
  }

}

class Fog extends Monster {
  constructor(posX) {
    super()
    //画面表示
    const img = new Image()
    img.src = "http://mwhidesp.konjiki.jp/a121-150/fog.png"
    this.img = img
    this.posX = posX
    this.posY = MONSTER_POSITION_BASE_Y
    this.sizeX = MONSTER_SIZE_X_LG
    this.sizeY = MONSTER_SIZE_Y_LG
    img.onload = () => this.drawImage()
    //ステータス
    this.HP = 40;
    this.MP = 50;
    this.Power = 40;
    this.masicOffence = 60;
    this.quickness = 56;
    this.difence = 20;
    this.masicDifence = 45;
    this.Level = 5;
    this.isDiffending = false;
    this.name = "フォグ";
    this.job = "monster";
  }

  attack(enemy) {
    return super.attack(enemy, this.Power);
  }

}

class Satellite extends Monster {
  constructor(posX) {
    super()
    //画面表示
    const img = new Image()
    img.src = "http://mwhidesp.konjiki.jp/a121-150/satellite.png"
    this.img = img
    this.posX = posX
    this.posY = MONSTER_POSITION_BASE_Y
    this.sizeX = MONSTER_SIZE_X_LG
    this.sizeY = MONSTER_SIZE_Y_LG
    img.onload = () => this.drawImage()
    //ステータス
    this.HP = 30;
    this.MP = 40;
    this.Power = 30;
    this.masicOffence = 20;
    this.quickness = 60;
    this.difence = 48;
    this.masicDifence = 30;
    this.Level = 4;
    this.isDiffending = false;
    this.name = "サテライト";
    this.job = "monster";
  }

  attack(enemy) {
    return super.attack(enemy, this.Power);
  }
}

//モンスター表示
const appierMonster = function () {
  let monsterNum = getRandomInt(5);
  let monsters = [];
  let posX = 0;
  for (let i = 0; i <= monsterNum; i++) {
    let instance = getMonsterInstance(getRandomInt(5), posX);
    monsters.push(instance);
    posX = posX + instance.sizeX + MONSTER_BETWEEN_SPACE;

  }
  return monsters;
}

//数字に応じたインスタンスを返す
function getMonsterInstance(getMonNum, posX) {

  switch (getMonNum) {
    case 0:
      return new Monument(posX);
      break;
    case 1:
      return new Browney(posX);
      break;
    case 2:
      return new DevilInsect(posX);
      break;
    case 3:
      return new Fog(posX);
      break;
    case 4:
      return new Satellite(posX);
      break;
  }
}


//画面点滅処理
let blinkTimerDisp;
function startTimerDisp() {
    blinkTimerDisp = setInterval(function () {
      blinkDisp();
    }, 100);

}

function stopTimerDisp() {

    clearInterval(blinkTimerDisp);

}

let blinkManageDisp = function () {

   startTimerDisp();
   setTimeout(
     function () {
       stopTimerDisp();
    },
    200
  );
}

let blinkDispflg = true;
let blinkDisp = function () {
  if (blinkDispflg) {

    canvas.style.backgroundColor = 'white';
  } else {

    canvas.style.backgroundColor = 'black';
  }
  blinkDispflg = !blinkDispflg;
}

