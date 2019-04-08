import Vue from 'vue';
import App from '@/App';
import Contador from '@/Contador';

Vue.config.productionTip = false;

//let EventEmitter = require('eventemitter3');

new Vue({
    el: "#app",
    components: { App, Contador }
});
