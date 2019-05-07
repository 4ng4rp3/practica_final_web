class player {
    constructor(matter, playerNumber, shapes) {
        this.playerNumber = playerNumber;
        this.gameMatter = matter;
        this.velocidad = 5;
        this.fuerza = 10;
        this.nombre = "Dummy Name";
        this.fragmentos = 0;
        this.artefactos = 0;
        this.edulcorantes = 0;
        this.imanes = 0;

        this.ficha = this.gameMatter.add.sprite(600, 200, 'sheet', 'ficha2.png', {shape: shapes.ficha2});
        this.ficha.setFixedRotation();
        this.ficha.setDepth(2);
        //this.ficha.

        //fragmentos, teleportadores, artefactos, edulcorantes, imanes magicos,
        //fuerza, velocidad, nombre
    }

    moverDerecha(boolean){
        if (boolean) this.ficha.setVelocityX(this.velocidad);
        //else this.ficha.setVelocityX(0);
    }
    moverIzquierda(boolean){
        if (boolean) this.ficha.setVelocityX(- this.velocidad);
        else this.ficha.setVelocityX(0);
    }
    moverArriba(boolean){
        if (boolean) this.ficha.setVelocityY(- this.velocidad);
        else this.ficha.setVelocityY(0);
    }
    moverAbajo(boolean){
        if (boolean) this.ficha.setVelocityY(this.velocidad);
        //else this.ficha.setVelocityY(0);
    }

    añadirColisionArtefactos(artefacto, originalThis){
        //Funcion que a traves del gameObject del artefacto y el this de la escena crea una colision,
        //la colision suma 1 al numero de artefactos y destruye el artefacto

        originalThis.matterCollision.addOnCollideStart({
            objectA: this.ficha,
            objectB: artefacto,
            callback: function(eventData) {
                // Esta funcion sera invocada cuando el jugador colisione con el artefacto

                const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                // bodyA & bodyB are the Matter bodies of the player and artifact respectively
                // gameObjectA & gameObjectB are the player and artifact respectively
                // pair is the raw Matter pair data

                this.artefactos += 1;
                gameObjectB.destroy();
            },
            context: this // Context to apply to the callback function
        });
    }
    añadirColisionCofres(cofre, originalThis){
        //Funcion que a traves del gameObject del cofre y el this de la escena crea una colision,
        //la colision genera de forma aleatoria un objeto {fragmento, edulcorante, iman magico}

        originalThis.matterCollision.addOnCollideStart({
            objectA: this.ficha,
            objectB: cofre,
            callback: function(eventData) {
                // Esta funcion sera invocada cuando el jugador colisione con el artefacto

                const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                // bodyA & bodyB are the Matter bodies of the player and the chest respectively
                // gameObjectA & gameObjectB are the player and the chest respectively
                // pair is the raw Matter pair data

                //Generar uno de los objetos
                gameObjectB.destroy();
            },
            context: this // Context to apply to the callback function
        });
    }

    //GETTERS
    getNombre()
    {
        return this.nombre;
    }
    getFragmentos()
    {
        return this.fragmentos;
    }
    getArtefactos()
    {
        return this.artefactos;
    }
    getEdulcorantes()
    {
        return this.edulcorantes;
    }
    getImanes()
    {
        return this.imanes;
    }

    //SETTERS
    getNombre(nombre)
    {
        this.nombre = nombre;
    }
    getFragmentos(cantidad)
    {
        this.fragmentos = cantidad;
    }
    getArtefactos(cantidad)
    {
        this.artefactos = cantidad;
    }
    getEdulcorantes(cantidad)
    {
        this.edulcorantes = cantidad;
    }
    getImanes(cantidad)
    {
        this.imanes = cantidad;
    }
}
export { player };