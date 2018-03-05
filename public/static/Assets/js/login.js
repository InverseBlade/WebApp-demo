(function (window) {
    $$('form[name=login]').on('submit', function (e) {
        e.preventDefault();
        BookApp.preloader.show();

        var uname  = $$('#uname').val();
        var passwd = $$('#password').val();

        if(uname == '' || passwd == ''){
            return;
        }
        BookApp.request.post('/GuestBook/Login/login', {
            uname   : uname,
            password: passwd
        }, function (result) {
            result = JSON.parse(result);

            if(result.err_code == 1){
                BookApp.dialog.alert("用户名或密码错误！");
            }else{
                window.location.replace("/GuestBook/");
            }
            BookApp.preloader.hide();
        });
    });

    var render = Template7.compile($$('script#modify-template').html());

    var ins = BookApp.popup.create({
        content : render(),
        on : {
            opened : function () {

            },
            closed : function () {
                BookApp.views.modify.router.back();
            }
        }
    });

    $$('.modify-popup-open').on('click', function (e) {
        ins.open();
    });

    $$(document).on('page:init', '.page[data-name=signup]', function (e) {
        var p1 = false, p2 = true, p3 = false;

        $$('input[name=uname]').on('input propertychange', function (e) {
            var target = $$('#checkId');
            var val = this.value;
            if(val == ''){p1 = false; target.text(''); return;}
            BookApp.request.post('/GuestBook/Login/checkId',
                {uname: val},
                function (result) {
                 result = JSON.parse(result);

                 if(result.err_code == 1){
                     target.css('color', 'red').text('用户名已存在!');
                     p1 = false;
                 }else{
                     target.css('color', 'green').text('用户名可用!');
                     p1 = true;
                 }
            });
        });
        $$('input[name=nickname]').on('input propertychange', function (e) {
            var val = this.value;
            var target = $$('#checkNickname');
            if(val == ''){p2 = true; target.text(''); return;}
            BookApp.request.post('/GuestBook/Login/checkNickname',
                {nickname : val},
                function (result) {
                    result = JSON.parse(result);

                    if(result.err_code == 1){
                        target.css('color', 'red').text('昵称已存在!');
                        p2 = false;
                    }else{
                        target.css('color', 'green').text('昵称可用!');
                        p2 = true;
                    }
                });
        });
        $$('input[name=repassword]').on('input propertychange', function (e) {
            var val = this.value;
            if(val == ''){p3 = false; return;}
            var real = $$('input[name=password]').val();
            var target = $$('#checkPassword');
            if(val != real){
                target.css('color', 'red').text('密码不一致!');
                p3 = false;
            }else{
                target.css('color', 'green').text('密码一致!');
                p3 = true;
            }
        });
        $$('form[name=signup]').on('submit', function (e) {
            e.preventDefault();

            if(!(p1 && p2 && p3)){
                BookApp.dialog.alert("输入有误!");
                return;
            }
            data = BookApp.form.convertToData('form[name=signup]');
            BookApp.request.post('/GuestBook/Login/add', data, 
                function (result) {
                   result = JSON.parse(result);

                   if(result.err_code == 0){
                       BookApp.dialog.alert("注册成功!", "留言簿", function (e) {
                           BookApp.preloader.show("页面跳转中，请稍等...");
                           window.setTimeout(function () {
                               BookApp.preloader.hide();
                               window.location.replace("/GuestBook/");
                           }, 1000);
                       });
                   }else{
                       BookApp.dialog.alert("错误: "+result.err_msg);
                   }
                });
        });
    });

    //找回密码首页
    $$(document).on('page:init', '.page[data-name=modify-uname]',
        function (e) {
            $this = $$(this);
            $this.find('form').on('submit', function (e) {
                e.preventDefault();

                var uname = $$('div.popup').find('input[name=uname]').val();
                BookApp.request.post('/GuestBook/Login/checkId',
                    {uname : uname},
                    function (result) {
                        result = JSON.parse(result);

                        if(result.err_code == 0){
                            $this.find('#checkUname').css('color', 'red').text('用户名不存在！');
                            return;
                        }
                        BookApp.views.modify.router.navigate('/modify/?email=' + result.data + '&uname=' + uname);
                    });
            });
            $this.find('input[name=uname]').on('input propertychange', function () {
                $$(this).parent().find('#checkUname').text('');
            });
        });

    //获取验证码改密页面
    $$(document).on('page:init', '.page[data-name=modify-info]',
        function (e) {
            $this = $$(this);
            $get = BookApp.views.modify.router.currentRoute.query;
            $email = $get['email'];
            $uname = $get['uname'];

            $this.find('#t-email').text($email);

            var ifPass = false;

            $this.find('input[type=button]').on('click', function (e) {
                e.preventDefault();
                var $thi = $$(this);
                var color = $thi.css('background-color');

                BookApp.request.post('/GuestBook/Login/send',
                    {uname : $uname},
                    function (result) {
                        result = JSON.parse(result);

                        if(result.err_code == 0){
                            //BookApp.dialog.alert("发送成功！");
                        }else{
                            BookApp.dialog.alert("发送失败，请重试！错误信息：" + result.err_msg);
                            $thi.removeAttr('disabled').css('background-color', color).val("重新发送");
                        }
                    });
                $thi.attr('disabled', true).css('background-color', 'gray').val("已发送");
            });

            $this.find('input[name=repassword]').on('input propertychange', function (e) {
                var val = this.value;
                if(val == ''){ifPass=false;return;}
                var real = $this.find('input[name=password]').val();
                var target = $this.find('#checkPassword');
                if(val != real){
                    target.css('color', 'red').text('密码不一致!');
                    ifPass = false;
                }else{
                    target.css('color', 'green').text('密码一致!');
                    ifPass = true;
                }
            });

            $this.find('form').on('submit', function (e) {
                e.preventDefault();

                if(!ifPass){
                    BookApp.dialog.alert("两次密码不一致!");
                    return;
                }
                data = BookApp.form.convertToData($$(this));
                data['uname'] = $uname;

                BookApp.preloader.show();
                BookApp.request.post('/GuestBook/Login/modify',
                    data,
                    function (result) {
                        result = JSON.parse(result);
                        BookApp.preloader.hide();

                        if(result.err_code == 1){
                            BookApp.dialog.alert("修改失败: " + result.err_msg);
                            return;
                        }
                        Token.message.alert("修改成功！", function () {
                            BookApp.preloader.show();
                            window.setTimeout(function () {
                                    window.location.replace("/GuestBook/");
                                    BookApp.preloader.hide();
                            }, 1500);
                            Token.message.toast("跳转登录中，请稍等...");
                        });
                    });
            });
        });
})(window);