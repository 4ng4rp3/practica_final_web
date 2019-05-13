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