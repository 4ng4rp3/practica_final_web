import { time } from './time'

const SEGUNDOS_NECESARIOS = 3;
class derrumbe {
    constructor(matter, shapes, position) {
        this.gameMatter = matter;
        this.segundosRestantes = SEGUNDOS_NECESARIOS;
        this.previousTime = -1;
        this.derrumbeSprite = matter.add.sprite(position[0], position[1], 'sheet', 'pedres.png', {shape: shapes.pedres});
        this.derrumbeSprite.setScale(0.3);
        this.derrumbeSprite.setDepth(1);

    }
    getSegundosRestantes(){
        return this.segundosRestantes;
    }
    cavar(time){
        //Funcion que permite al jugador cavar, el derrumbe desaparecera cuando el jugador colisione durante
        //los SEGUNDOS_NECESARIOS
        if(time.getTime() - this.previousTime >= 1){
            this.previousTime = time.getTime();
            this.segundosRestantes -= 1;
            //Los segundos necesarios han ocurrido por tanto el jugador ha removido el derrumbe
            if(this.segundosRestantes == 0){
                this.derrumbeSprite.destroy();
            }
        }
    }
}
export { derrumbe };