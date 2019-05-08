class time {
    constructor() {
        this.time = 58;
    }
    getTime(){
        return this.time;
    }
    sumar(valor){
        this.time += valor;
    }
}
export { time };