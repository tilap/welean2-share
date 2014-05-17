Dropzone.autoDiscover = false;

var totalSize = 0;
var sizeProgress = 0;

var templatefile = $("#templatefiles script").first();
var params = {
    url: "./upload/",
    previewsContainer: "#mygallery",
    thumbnailHeight: 300,
    thumbnailWidth: 300,
    success: function(err, result) {
        console.log(result);
    },
    previewTemplate: templatefile.text(),
    clickable: '.upload'
};

var myDropzone = new Dropzone(document.body, params);

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
    var current = Math.round(100 * ((bytes + sizeProgress) / totalSize));
    console.log(current);
    $(".allprogress").css("width", current + "%");
    $(".uploadprogress").text(humanFileSize(bytes + sizeProgress) + " / " + humanFileSize(totalSize));
});

var current = 0;
myDropzone.on("addedfile", function(file) {
    totalSize += file.size;
    console.log('total'+totalSize);
    $(".notification").html("Let's your friends fullfill this album, send them the url!");
    $(".home-cover").remove();
    var imageloaded = new imagesLoaded( ".dz-processing img");
    $(".dz-processing img").css('opacity', 0);
    /*
    imageloaded.on( 'done', function( instance ) {
        console.log('DONE  - all images have been successfully loaded');
        if (current != 0) {
            clearTimeout(current);
        }
        current = setTimeout(function() {
            $(".dz-processing img").css('opacity', 1);
            initGrid();
        }, 1000);
    });
*/
});

myDropzone.on('complete', function(file) {
    console.log('arguments', arguments);
    sizeProgress += file.size;
    if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
        // End of upload :)
    }
});

myDropzone.on('error', function(file, err, xhr){
    errorMsg = "Error while loading file " + file.name;
    if(xhr && xhr.statusText){
        errorMsg += ' (' + xhr.statusText + ')';
        console.log(xhr);
    }
    $('.top-right').notify({
        message: { text: errorMsg },
        type : 'danger'
    }).show();
    console.log(file, err, xhr);
});

/*
$("#mygallery").justifiedGallery({
    rowHeight : 300,
    fixedHeight : true,
    lastRow: 'nojustify'
});
*/


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
