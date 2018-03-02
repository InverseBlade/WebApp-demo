(function (window) {

    (function () {
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
    })();

    $$('.view-main').find('a.tab-1').addClass('tab-link-active');
    $$('a.tab-link').on('click', function (e) {
        $this = $$(this);

        if($this.hasClass('tab-link-active')) return;

        if($this.hasClass('tab-1')){
            obj = BookApp.tab.show('.view#tab-1');
            $$(obj.newTabEl).find('a.tab-1').addClass('tab-link-active');
            $$(obj.oldTabEl).find('a.tab-link-active').removeClass('tab-link-active');
        }else if($this.hasClass('tab-2')){
            obj = BookApp.tab.show('.view#tab-2');
            $$(obj.newTabEl).find('a.tab-2').addClass('tab-link-active');
            $$(obj.oldTabEl).find('a.tab-link-active').removeClass('tab-link-active');
        }else{
            obj = BookApp.tab.show('.view#tab-3');
            $$(obj.newTabEl).find('a.tab-3').addClass('tab-link-active');
            $$(obj.oldTabEl).find('a.tab-link-active').removeClass('tab-link-active');
        }
    });

})(window);