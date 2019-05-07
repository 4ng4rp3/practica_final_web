class time {
    constructor() {
        this.time = 0;
    }
    getTime(){
        return this.time;
    }
    sumar(valor){
        this.time += valor;
    }
}
export { time };