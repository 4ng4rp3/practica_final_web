import { derrumbe } from './derrumbe'

const VELOCIDAD_NORMAL = 5;
const VELOCIDAD_EDULCORANTE = 10;
const NUMERO_ARTEFACTOS_IMAN = 3;
const NUMERO_MINIMO_FRAGMENTOS_TIENDA = 4;

class player {
    constructor(matter, playerNumber, shapes, nombre, time) {
        this.playerNumber = playerNumber;
        this.gameMatter = matter;
        this.shapes = shapes;
        this.velocidad = VELOCIDAD_NORMAL;
        this.nombre = nombre;
        this.fragmentos = 0;
        this.artefactos = 0;
        this.edulcorantes = 0;
        this.edulcoranteActivado = false;
        this.imanes = 0;
        this.prevTimeEdulcorante = -1;
        this.prevTimeIman = -1;
        this.time = time;
        this.horaSalida = 0;

        this.haSalido = false;

        this.generarFicha();
    }

    generarFicha(){
        //Funcion que genera la ficha del matter, elige segun si es el jugador 1 o 2 una ficha al azar

        let random = this.getRandomArbitrary(0,3);
        switch(random) {
            case 0: {
                if(this.playerNumber == 1) this.ficha = this.gameMatter.add.sprite(600, 200, 'sheet', 'verde_hormiga.png', {shape: this.shapes.verde_hormiga});
                else this.ficha = this.gameMatter.add.sprite(600, 200, 'sheet', 'azul_hormiga.png', {shape: this.shapes.azul_hormiga});
                break;
            }
            case 1: {
                if(this.playerNumber == 1) this.ficha = this.gameMatter.add.sprite(600, 200, 'sheet', 'verde_oso.png', {shape: this.shapes.verde_oso});
                else this.ficha = this.gameMatter.add.sprite(600, 200, 'sheet', 'azul_oso.png', {shape: this.shapes.azul_oso});
                break;
            }
            case 2: {
                if(this.playerNumber == 1) this.ficha = this.gameMatter.add.sprite(600, 200, 'sheet', 'verde_topo.png', {shape: this.shapes.verde_topo});
                else this.ficha = this.gameMatter.add.sprite(600, 200, 'sheet', 'azul_topo.png', {shape: this.shapes.azul_topo});
                break;
            }
        }
        //this.ficha = this.gameMatter.add.sprite(600, 200, 'sheet', 'ficha2.png', {shape: shapes.ficha2});
        this.ficha.setFixedRotation();
        this.ficha.setDepth(2);
    }

    actualizarEfectoEdulcorante(time){
        if(time - this.prevTimeEdulcorante >= 3 && this.edulcoranteActivado){
            this.velocidad = VELOCIDAD_NORMAL;
            this.edulcoranteActivado = false;
        }
    }

    usarEdulcorante(time){
        if(time - this.prevTimeEdulcorante >= 0.3 && !this.edulcoranteActivado) {
            if (this.edulcorantes > 0) {
                this.prevTimeEdulcorante = time;
                this.edulcorantes--;
                this.velocidad = VELOCIDAD_EDULCORANTE;
                this.edulcoranteActivado = true;
            }
        }
    }

    usarIman(time, player){
        if(time - this.prevTimeIman >= 0.3) {
            if (this.imanes > 0 && player.getArtefactos() >= NUMERO_ARTEFACTOS_IMAN) {
                this.prevTimeIman = time;
                this.imanes--;

                //Sumar al jugador actual los artefactos
                this.artefactos += 3;
                //Restar al otro jugador los artefactos
                player.setArtefactos(player.getArtefactos()-3);
            }
        }
    }

    moverDerecha(boolean){
        if (boolean && !this.haSalido) this.ficha.setVelocityX(this.velocidad);
        //else this.ficha.setVelocityX(0);
    }

    moverIzquierda(boolean){
        if (boolean && !this.haSalido) this.ficha.setVelocityX(- this.velocidad);
        else if(!this.haSalido) this.ficha.setVelocityX(0);
    }

    moverArriba(boolean){
        if (boolean && !this.haSalido) this.ficha.setVelocityY(- this.velocidad);
        else if(!this.haSalido) this.ficha.setVelocityY(0);
    }

    moverAbajo(boolean){
        if (boolean && !this.haSalido) this.ficha.setVelocityY(this.velocidad);
        //else this.ficha.setVelocityY(0);
    }

    añadirColisionArtefactos(artefacto, originalThis, pos, spawnsOcupados){
        //Funcion que a traves del gameObject del artefacto y el this de la escena crea una colision,
        //la colision suma 1 al numero de artefactos y destruye el artefacto

        if(!this.haSalido) {
            originalThis.matterCollision.addOnCollideStart({
                objectA: this.ficha,
                objectB: artefacto,
                callback: function (eventData) {
                    // Esta funcion sera invocada cuando el jugador colisione con el artefacto

                    const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                    // bodyA & bodyB are the Matter bodies of the player and artifact respectively
                    // gameObjectA & gameObjectB are the player and artifact respectively
                    // pair is the raw Matter pair data

                    this.artefactos += 1;
                    gameObjectB.destroy();

                    //Poner la posicion del spawn a disponible
                    spawnsOcupados[pos] = false;
                },
                context: this // Context to apply to the callback function
            });
        }
    }

    añadirColisionCofres(cofre, originalThis, pos, spawnsOcupados){
        //Funcion que a traves del gameObject del cofre y el this de la escena crea una colision,
        //la colision genera de forma aleatoria un objeto {fragmento, edulcorante, iman magico}

        if(!this.haSalido) {
            originalThis.matterCollision.addOnCollideStart({
                objectA: this.ficha,
                objectB: cofre,
                callback: function (eventData) {
                    // Esta funcion sera invocada cuando el jugador colisione con el artefacto

                    const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                    // bodyA & bodyB are the Matter bodies of the player and the chest respectively
                    // gameObjectA & gameObjectB are the player and the chest respectively
                    // pair is the raw Matter pair data

                    //Generar uno de los objetos
                    let random = this.getRandomArbitrary(0, 10);
                    //60% de ser un fragmento
                    if (random <= 5) this.fragmentos += 1;

                    //20% de ser un edulcorante
                    else if (random >= 6 && random <= 7) this.edulcorantes += 1;

                    //20% de ser un iman magico
                    else if (random >= 8 && random <= 9) this.imanes += 1;

                    gameObjectB.destroy();

                    //Poner la posicion del spawn a disponible
                    spawnsOcupados[pos] = false;
                },
                context: this // Context to apply to the callback function
            });
        }
    }

    añadirColisionTienda(tienda, originalThis){
        //Funcion que a traves del gameObject de la tienda y el this de la escena crea una colision,
        //la colision genera comprueba si el jugador tiene al menos NUMERO_MINIMO_FRAGMENTOS_TIENDA y los
        //cambia por un fragmento

        if(!this.haSalido) {
            originalThis.matterCollision.addOnCollideStart({
                objectA: this.ficha,
                objectB: tienda,
                callback: function (eventData) {
                    // Esta funcion sera invocada cuando el jugador colisione con la tienda

                    const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                    // bodyA & bodyB are the Matter bodies of the player and the shop respectively
                    // gameObjectA & gameObjectB are the player and the shop respectively
                    // pair is the raw Matter pair data

                    let artefactosConseguidos = Math.trunc(this.fragmentos / NUMERO_MINIMO_FRAGMENTOS_TIENDA);
                    this.fragmentos -= artefactosConseguidos * NUMERO_MINIMO_FRAGMENTOS_TIENDA;
                    this.artefactos += artefactosConseguidos;
                },
                context: this // Context to apply to the callback function
            });
        }
    }

    añadirColisionEscalera(escalera, originalThis){
        //Funcion que a traves del gameObject de la escalera y el this de la escena crea una colision,
        //la colision hace que el jugador salga de la cueva y se ponga a true el booleano "haSalido" y
        //destruye la ficha

        if(!this.haSalido) {
            originalThis.matterCollision.addOnCollideStart({
                objectA: this.ficha,
                objectB: escalera,
                callback: function (eventData) {
                    // Esta funcion sera invocada cuando el jugador colisione con la tienda

                    const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                    // bodyA & bodyB are the Matter bodies of the player and the stairs respectively
                    // gameObjectA & gameObjectB are the player and the stairs respectively
                    // pair is the raw Matter pair data

                    this.haSalido = true;
                    this.horaSalida = this.time.getTime();
                    this.ficha.destroy();
                },
                context: this // Context to apply to the callback function
            });
        }
    }

    añadirColisionDerrumbe(derrumbe, originalThis, pos, spawnsOcupados, time){
        //Funcion que a traves del gameObject del derrumbe y el this de la escena crea una colision,
        //la colision gestiona el derrumbe

        if(!this.haSalido) {
            originalThis.matterCollision.addOnCollideStart({
                objectA: this.ficha,
                objectB: derrumbe.derrumbeSprite,
                callback: function (eventData) {
                    // Esta funcion sera invocada cuando el jugador colisione con el derrumbe

                    const {bodyA, bodyB, gameObjectA, gameObjectB, pair} = eventData;
                    // bodyA & bodyB are the Matter bodies of the player and the chest respectively
                    // gameObjectA & gameObjectB are the player and the chest respectively
                    // pair is the raw Matter pair data

                    derrumbe.cavar(time);
                    //gameObjectB.destroy();

                    //Poner la posicion del spawn a disponible
                    spawnsOcupados[pos] = false;
                },
                context: this // Context to apply to the callback function
            });
        }
    }

    //GETTERS
    getNombre(){
        return this.nombre;
    }

    getFragmentos(){
        return this.fragmentos;
    }

    getArtefactos(){
        return this.artefactos;
    }

    getEdulcorantes(){
        return this.edulcorantes;
    }

    getImanes(){
        return this.imanes;
    }

    getEdulcoranteActivado(){
        return this.edulcoranteActivado;
    }

    getSalido(){
        return this.haSalido;
    }
    getHoraSalida(){
        return this.horaSalida;
    }

    //SETTERS
    setNombre(nombre){
        this.nombre = nombre;
    }

    setFragmentos(cantidad){
        this.fragmentos = cantidad;
    }

    setArtefactos(cantidad){
        this.artefactos = cantidad;
    }

    setEdulcorantes(cantidad){
        this.edulcorantes = cantidad;
    }

    setImanes(cantidad){
        this.imanes = cantidad;
    }


    //FUNCIONES
    getRandomArbitrary(min, max){
        return Math.trunc(Math.random() * (max - min) + min);
    }
}
export { player };