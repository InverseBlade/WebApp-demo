(function (window) {

    $$(document).on('page:init', '.page[data-name="about"]', function (e) {
        //Token.message.alert("你好！")
    });

    function renderTab_1(target, render) {
        BookApp.request.post('/GuestBook/Essay/api',
            {
                page : 1
            },
            function (result) {
                result = JSON.parse(result);
                var html = '';

                if(result.err_code == 1){
                    BookApp.dialog.alert("Error: " + result.err_msg);
                    return;
                }
                for(var i=0; i<result.data.length; i++){
                    item = result.data[i];

                    if(item.nickname.trim().length != 0){
                        item.uname = item.nickname;
                    }
                    item.ltime = item.create_time;
                    item.praise_count = 38;
                    item.comments_count = 250;

                    html += render(item);
                }
                target.append(html);
            });
    }

    function renderTab_2(target, render) {
        target.html(render());
    }

    function renderTab_3(target, render) {
        target.html(render());
    }

    function mainTabController(target, template, button) {
        var ifload = false;
        var touchTime = new Date().getTime();
        var render = Template7.compile(template.html());

        function loadPageContent() {
            if (ifload) return;
            BookApp.preloader.show();
            ifload = true;

            window.setTimeout(function () {
                switch (target.attr('id')) {
                    case 'tab-1':
                        renderTab_1(target, render);break;
                    case 'tab-2':
                        renderTab_2(target, render);break;
                    case 'tab-3':
                        renderTab_3(target, render);break;
                }

                BookApp.preloader.hide();
                ifload = false;
            }, 250);
        }

        button.on('click', function (e) {
            if (new Date().getTime() - touchTime < 250) {
                target.html('');
                loadPageContent();
            } else {
                touchTime = new Date().getTime();
                if ('' == target.html().trim()) {
                    loadPageContent();
                }
            }
        });
        if(target.attr('id') == 'tab-1'){
            loadPageContent();
        }
    }

    for(var i=1; i<=3; i++){
        mainTabController(
            $$('.page-content#tab-' + i),
            $$('script#tab-' + i + '-template'),
            $$('a[href="#tab-' + i + '"]')
        );
    }

})(window);