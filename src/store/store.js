import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        userName:'' || localStorage.getItem('userName'),
        rule: '' || localStorage.getItem('rule'),
        phone:'' || localStorage.getItem('phone')
    },
    mutations: {
        initUserInfo(state,info){
            state.userName = info.userName;
            state.rule = info.rules[0];
            state.phone = info.phone;
            localStorage.setItem('userName', info.userName);
            localStorage.setItem('rule', info.rules[0]);
            localStorage.setItem('phone', info.phone);
        }
    },
    getters: {
        userName: (state) => state.userName,
        rule: (state) => state.rule,
        phone: (state) => state.phone,
    }
});

export default store