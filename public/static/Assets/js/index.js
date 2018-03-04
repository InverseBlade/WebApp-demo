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

})(window);