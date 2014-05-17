Dropzone.autoDiscover = false;

var totalSize = 0;
var sizeProgress = 0;

var params = {
    url: "./upload/",
    previewsContainer: "#mygallery",
    thumbnailHeight: 300,
    thumbnailWidth: 300,
    success: function(err, result) {
        console.log(result);
    }
};
if ($(".upload").length) {
    params.clickable = '.upload';
} else {
    params.clickable = false;
}
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
    $(".uploadprogress").css("width", current + "%");
    $(".uploadprogress").text(humanFileSize(bytes + sizeProgress) + " / " + humanFileSize(totalSize));
});

myDropzone.on("addedfile", function(file) {
    totalSize += file.size;
    console.log('total'+totalSize);
    $(".notification").html("Let's your friends fullfill this album, send them the url!");
    $(".cover").remove();
});

myDropzone.on('complete', function(file) {
    sizeProgress += file.size;
    if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
        // End of upload :)
    }
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