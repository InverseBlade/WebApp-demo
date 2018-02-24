(function (window) {

    $$(document).on('page:init', '.page[data-name="about"]', function (e) {
        //Token.message.alert("你好！")
    });

    (function () {
        var ifload = false;
        var touchTime = new Date().getTime();
        var render_tab2 = Template7.compile($$('script#tab-2-template').html());

        function loadPageContent() {
            if(ifload) return;
            BookApp.preloader.show();
            ifload = true;

            window.setTimeout(function () {
                $$('.page-content#tab-2').html(render_tab2());

                BookApp.preloader.hide();
                ifload = false;
            }, 500);
        }

        $$('a[href="#tab-2"]').on('click', function (e) {
            if(new Date().getTime() - touchTime < 250){
                $$('.page-content#tab-2').html('');
                loadPageContent();
            }else{
                touchTime = new Date().getTime();
                if('' == $$('.page-content#tab-2').html().trim()){
                    loadPageContent();
                }
            }
        });

    })();

})(window);