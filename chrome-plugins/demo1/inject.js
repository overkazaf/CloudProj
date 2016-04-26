(function($) {
    $(window).on('load', function (){
        
        var nav = window.navigator;

        nav.__defineGetter__('vendorSub', function () {
            return 'hack by John';
        });

        console.log('123');
        console.log(nav);


        setTimeout(function (){
            $('#wrapper').find('#link-signin').html('John')

            $('#wrapper').find('')
            console.log($('#wrapper').html());
        }, 3000);
    })
    
})(jQuery);

