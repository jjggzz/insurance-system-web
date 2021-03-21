import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login/login'
import Main from './components/main/main'
import User from './components/main/user/user'
import Insurance from './components/main/insurance/insurance'
import Policy from './components/main/policy/policy'
import Home from './components/main/home'

Vue.use(Router);

export default new Router({
  routes: [
      {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
          {
              path: 'home',
              name: 'home',
              component: Home
          },
          {
              path: 'user',
              name: 'user',
              component: User
          },
          {
              path: 'insurance',
              name: 'insurance',
              component: Insurance
          },
          {
              path: 'policy',
              name: 'policy',
              component: Policy
          }
      ]
    }
  ]
})
