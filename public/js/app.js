$('a.smooth').click(function(){
    var the_id = $(this).attr("href");

    $('html, body').animate({
        scrollTop:$(the_id).offset().top
    }, 'fast');
    return false;
});

 $(".dz-preview a").fancybox({
    helpers : {
        overlay : {
            css : {
                'background' : 'rgba(0, 0, 0, 0.8)'
            }
        }
    },
    padding : 0,
});
