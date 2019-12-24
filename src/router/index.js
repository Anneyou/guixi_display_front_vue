import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Building from '@/components/Building'
import Unit from '@/components/Unit'
import Company from '@/components/Company'
import Enterprise from '@/components/Enterprise'
import Authorized from '@/components/Authorized'
import guixiVue from './config'

Vue.use(Router)

Vue.prototype.baseUrl = guixiVue.baseUrl

Vue.prototype.baseCompany = guixiVue.baseCompany

Vue.prototype.baseDescription = guixiVue.baseDescription

export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'Home',
      path: '/guixi_app/home',
      component: Home
    },
    {
      name: 'Building',
      path: '/guixi_app/building',
      component: Building
    },
    {
      name: 'Unit',
      path: '/guixi_app/unit',
      component: Unit
    },
    {
      name: 'Company',
      path: '/guixi_app/company',
      component: Company
    },
    {
      name: 'Authorized',
      path: '/guixi_app/authorized',
      component: Authorized
    },
    {
      name: 'Enterprise',
      path: '/guixi_app/enterprise',
      component: Enterprise
    }
  ]
})
