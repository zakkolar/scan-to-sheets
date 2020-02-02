import Vue from "vue";
import Sidebar from "./components/Sidebar.vue";

import Vuex from 'vuex'
import {RowScanner} from "../RowScanner";

Vue.use(Vuex)

RowScanner.setGoogle(google);

new Vue({
    render: h=>h(Sidebar),
}).$mount('#sidebar')
