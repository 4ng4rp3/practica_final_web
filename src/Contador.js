import ee from '@/ee';
import Vue from 'vue';
import template from '@/templates/contador.html';

let Contador = Vue.component('Contador', {
    template: template,
    data: function () {
        return {
            count: 0
        }
    },
    mounted() {
        ee.on("colision",() => this.count++);
    }
});

export default Contador;