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

                    if(item.nickname.trim().length == 0){
                        item.uname = '匿名用户';
                    }else{
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

    //留言管理页面
    var loaded = false;
    var hash;
    var ttarget;

    $$(document).on('page:init', '.page[data-name=essay-manage]', function (e) {
        target = $$(this).find('.components-list');
        render = Template7.compile($$('script#written-template').html());

        function render_page(callback) {
            BookApp.request.post('/GuestBook/User/written',
                {
                    page : 1,
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

                        item.uname = nickName;
                        item.ltime = item.create_time;
                        item.praise_count = 38;
                        item.comments_count = 250;

                        if(item.status == 1){
                            item.isDelete = "删除";
                        }else{
                            item.isDelete = "还原";
                        }

                        html += render(item);
                    }
                    target.append(html);
                    if(callback) callback();
                });
        }

        render_page(function () {
            $$('a.item-delete').on('click', function (e) {
                var $this = $$(this);
                var hash = $this.parent().attr('data-hash');
                var status = 2;

                if($this.html() == '还原'){
                    status = 1;
                }else{
                    status = 2;
                }

                BookApp.request.post('/GuestBook/essay/delete',
                    {
                        hash : hash,
                        status : status
                    },
                    function (result) {
                        result = JSON.parse(result);

                        if(result.err_code == 1){
                            BookApp.dialog.alert("Error: " + result.err_msg);
                            return;
                        }
                        var notice;
                        if(status == 1){
                            $this.html('删除');
                            notice = "成功还原!";
                        } else {
                            $this.html('还原');
                            notice = "成功删除!";
                        }
                        Token.message.alert(notice);
                    });
            });

            $$('a.popup-open[data-popup=".popup-edit"]').on('click', function (e) {
                //alert("ggggg");
                ttarget = $$(this).parents('div.card');
                hash = $$(this).parent().attr('data-hash');
                $$('div.popup-edit').find('textarea').val(ttarget.find('p#essay-content').html());
            });

            //编辑留言
            if(loaded) return;
            loaded = true;
            $this_popup = $$('div.popup-edit');

            $this_popup.find('a.edit-button').on('click', function (e) {
                var content = $this_popup.find('textarea.essay-edit').val();

                if(content.length == 0 || content.trim() == ''){
                    Token.message.alert('内容不能为空！');
                    return;
                }
                BookApp.request.post('/GuestBook/essay/modify',
                    {
                        content : content,
                        hash : hash
                    },
                    function (result) {
                        result = JSON.parse(result);

                        if(result.err_code == 1){
                            Token.message.alert('修改失败: ' + result.err_msg);
                            return;
                        }
                        ttarget.find('p#essay-content').html(content);
                        Token.message.alert('修改成功!', function () {
                            BookApp.popup.close('div.popup-edit');
                        });
                    });
            });
        });
    });

})(window);



















