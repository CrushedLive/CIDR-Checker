import Vue from 'vue';

import Octocat from '../components/octocat';

Vue.component('bc-cidr-octocat', Octocat);

import Main from '../views/main';
import Form from '../views/form';

Vue.component('bc-cidr-main', Main);
Vue.component('bc-cidr-form', Form);