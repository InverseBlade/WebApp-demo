//ajax页面跳转的根路径
var PATH = '/static/Assets/pages/';

var routes = [
    {
        path : '/about/',
        url  : 'index/about.html'
    },

    {
        path : '/signup/',
        url  : 'login/signup.html'
    },

    {
        path : '/modify/',
        url  : 'login/modify.html'
    },

    {
        path : '/essay_manage/',
        url  : 'index/essay_manage.html'
    },

    {
        path : '/essay_edit',
        url  : 'index/essay_edit.html'
    }
];

for(var i in routes){
    routes[i].url = PATH + routes[i].url;
}