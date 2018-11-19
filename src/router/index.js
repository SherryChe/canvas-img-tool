import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import SVG from '@/components/svg';
import Index from '@/page/index.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
        path:'/svg',
        name:'svg',
        component:SVG
    },
      {
          path: '/index',
          name: 'index',
          component: Index,
      }
  ],
});
