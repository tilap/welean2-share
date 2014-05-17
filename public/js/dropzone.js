Dropzone.autoDiscover = false;

        var myDropzone = new Dropzone(document.body, {
            url: "./upload/",
            clickable: '.upload'
        });

        var template = '<a href="{{{ url }}}"><img alt="{{{ url }}}" src="{{{ url }}}" /></a>';

        myDropzone.on("success", function(file, response) {
            var output = Mustache.render(template, {url : response.path});
            //$('#mygallery').append(output);
        });

        myDropzone.on("queuecomplete", function() {
            //$("#mygallery").justifiedGallery();
        });

        myDropzone.on("uploadprogress", function(hop, percentage, bytes) {
            $(".uploadprogress").show();
            $(".uploadprogress").css("width", percentage + "%");
            $(".uploadprogress").text(humanFileSize(bytes));
            console.log('hop');
            console.log(arguments);
        });


        $("#mygallery").justifiedGallery({
            rowHeight : 300,
            fixedHeight : true
        });



function humanFileSize(bytes) {
    var si = 1024;
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' B';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
};