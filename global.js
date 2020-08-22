
//初期処理
const CANVAS_SIZE_W = 640
const CANVAS_SIZE_HW = 320 // 画面の半分の広さ(Half Width)
const CANVAS_SIZE_H = 480
const CANVAS_SIZE_HH = 240 // 画面の半分の高さ(Half Height)

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let onCommandInput = true;
let battleEnd = false;


class ContextState {
    constructor(state) {
        this.state = state;
    }
    changeState(state){
        this.state = state;
    }
    contextExcec(e){
        this.state = this.state.excecCommand(e);
    }
} 







   
    





