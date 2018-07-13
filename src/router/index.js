import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/admin',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: {
        title: '自述文件'
      },
      children: [{
          path: '/',
          redirect: '/message'
        },
        {
          path: '/message',
          component: resolve => require(['../components/page/smsManagement/cycleShortMessage.vue'], resolve),
          meta: {
            title: '周期短信'
          }
        },
        {
          path: '/acyclicMessage',
          component: resolve => require(['../components/page/smsManagement/timingMessages.vue'], resolve),
          meta: {
            title: '定时短信'
          }
        },        
        {
          path: '/transactionManagement',
          component: resolve => require(['../components/page/transactionManagement/transactionManagement.vue'], resolve),
          meta: {
            title: '事务管理'
          }
        },  
        {
          path: '/logging',
          component: resolve => require(['../components/page/systemManagement/managementLog.vue'], resolve),
          meta: {
            title: '日志列表'
          }
        }, 
        {
          path: '/role',
          component: resolve => require(['../components/page/systemManagement/authorityManagement.vue'], resolve),
          meta: {
            title: '权限管理'
          }
        },         
        {
          path: '/user',
          component: resolve => require(['../components/page/systemManagement/userManagement.vue'], resolve),
          meta: {
            title: '用户管理'
          }
        },          
        {
          path: '/managementLog',
          component: resolve => require(['../components/page/systemManagement/managementLog.vue'], resolve),
          meta: {
            title: '日志管理'
          }
        },  
        {
          path: '/authorityManagement',
          component: resolve => require(['../components/page/systemManagement/authorityManagement.vue'], resolve),
          meta: {
            title: '权限管理'
          }
        },                                
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
  ]

})
