(function (window) {

    function render_mainPage() {
        target = $$('.view-main').find('.components-list');
        render = Template7.compile($$('script#tab-1-template').html());
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
    render_mainPage();

    $$('.view-main').find('a.tab-1').addClass('tab-link-active');
    $$('a.tab-link').on('click', function (e) {
        $this = $$(this);
        var obj, target;

        if($this.hasClass('tab-link-active')) return;

        if($this.hasClass('tab-1')){
            target = '.view#tab-1';
        }else if($this.hasClass('tab-2')){
            target = '.view#tab-2';
        }else{
            target = '.view#tab-3';
        }
        obj = BookApp.tab.show(target);
        $$(obj.newTabEl).find('a.' + $this.attr('class').split(" ")[1]).addClass('tab-link-active');
        $$(obj.oldTabEl).find('a.tab-link-active').removeClass('tab-link-active');
    });
    
    $$('.popup-publish').on('popup:opened', function (e) {
        $$(this).find('textarea').focus();
    });

    $$('a.publish-button').on('click', function (e) {
        var target = $$('div.popup').find('textarea.essay-publish');
        var content = target.val();

        if(content.length == 0 || content == ''){
            Token.message.alert("留言不能为空！");
            return;
        }
        var topic = 'all test';
        BookApp.request.post('/GuestBook/essay/add',
            {
                topic : topic,
                content : content
            },
            function (result) {
                result = JSON.parse(result);

                if(result.err_code == 1){
                    Token.message.alert("发送失败！");
                    return;
                }
                $$('.view-main').find('.components-list').html('');
                render_mainPage();
                Token.message.alert("留言发布成功！", function () {
                    target.val('');
                    BookApp.popup.close('.popup');
                });
            });
    });

})(window);



















