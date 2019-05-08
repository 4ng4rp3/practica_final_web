import {Scene} from "phaser";
import {player} from "../player";
import {time} from "../time";

var EndScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function EndScene ()
        {
            Phaser.Scene.call(this, { key: 'endscene' });
        },

    init: function (data)
    {
        console.log('init', data);

        this.test = data.test;
    },

    create: function () {
        this.add.text(10, 10, this.test, {font: '16px Courier', fill: '#00ff00'});
    }

});