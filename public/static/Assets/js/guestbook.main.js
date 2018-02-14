//Dom7
var $$ = Framework7.Dom7;

//Theme
var theme = 'ios';

// /初始化Framework7
var BookApp = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: '留言簿',
    // App id
    id: 'com.app.guestbook',
    // Enable swipe panel
    panel: {
        //swipe: 'left',
    },
    theme: theme,
    // Add default routes
    routes: routes
    // ... other parameters
});

var mainView = BookApp.views.create('.view-main');

//定义Token对象
var Token = {
    message: {
        alert: function (text, callback) {
            if(callback){
                BookApp.dialog.alert(text, "留言簿", callback);
            }else{
                BookApp.dialog.alert(text);
            }
        },
        toast: function (text, position) {
            position === undefined? (position='bottom') : 1;
            BookApp.toast.create({
                text: text,
                position: position,
                closeTimeout: 1500
            }).open();
        }
    }
};