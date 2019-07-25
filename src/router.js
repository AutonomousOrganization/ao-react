import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './components/Home'
import Dash from './components/Dash'
// Member components
import Members from './components/Members'
import Wiki from './components/Wiki'
import Bounties from './components/Bounties'
import Onboarding from './components/Onboarding'

// Invoice components
import Invoices from './components/Invoices'

import Manage from './components/Manage'
import Auth from './components/Auth'

import MemberCalendar from './components/MemberCalendar'
import TaskCalendar from './components/TaskCalendar'
import List from './components/EventsList'

import MyPage from './components/MyPage'
import Nodes from './components/Nodes'
import Pinboard from './components/Pinboard'
import Deck from './components/Deck'

import Archive from './components/Deck/Archive'

Vue.use(VueRouter)

const routes =[{
  path: '/',
  component: Pinboard,
  meta: { title: "DCTRL" }
},{
  path: '/channels',
  component: Nodes,
  meta: { title: "lightning" }
},{
  path: '/auth',
  component: Auth,
  meta: { title: "authorize" }
},{
  path: '/history',
  component: List,
  meta: { title: "history" }
},{
  path: '/deck',
  component: Deck,
  meta: { title: "deck" }
},{
  path: '/invoices',
  component: Invoices,
  meta: { title: "invoices" }
},{
  path: '/invoices/*',
  component: Invoices,
  meta: { title: "invoices" }
},{
  path: '/account',
  component: MyPage,
  meta: { title: "account @ DCTRL" }
},{
  path: '/calendar/*',
  component: MemberCalendar,
  meta: { title: "calendar @ DCTRL" }
},{
  path: '/members',
  component: Members,
  meta: { title: "members @ DCTRL" }
},{
  path: '/task/*',
  component: TaskCalendar,
  meta: { title: "card" }
},{
  path: '/dash',
  component: Dash,
  meta: { title: "dashboard" }
},{
  path: '/bounties',
  component: Bounties,
  meta: { title: "bounties" }
},{
  path:'/manage',
  component: Manage,
  meta: { title: "manage" }
},{
  path:'/onboarding',
  component: Onboarding,
  meta: { title: "onboarding @ DCTRL" }
},{
  path:'/wiki',
  component: Wiki,
  meta: { title: "wiki @ DCTRL" }
},{
  path:'/archive',
  component: Archive,
  meta: { title: "sunken ship" }
}
]

const router = new VueRouter({
  routes
})

router.afterEach((to, from, next) => {
  if(to.meta.title == 'card') return
  Vue.nextTick( () => {
      document.title = to.meta.title ? to.meta.title : 'ao';
  })
})

// this one may make the browser history better
// router.afterEach((to, from) => {
//   Vue.nextTick( () => {
//     document.title = to.meta.title ? to.meta.title : 'default title';
//   });
// })

export default router
