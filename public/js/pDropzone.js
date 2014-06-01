
app.directive('pDropzone', function() {
    Dropzone.autoDiscover = false;
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, el, attrs) {
            $(el).dropzone({
                url: './upload/',
                thumbnailHeight: 300,
                init: function() {
                    this.on('success', function(file, json) {
                    });
                    this.on('addedfile', function(file) {
                        console.log(arguments);
                        //scope.thumbnail(arguments);
                        /*
                        scope.$apply(function(){
                            scope.medias.push({file: 'added'});
                        });
                        */
                    });
                    this.on('thumbnail', function(file) {
                        return false;
                    });
                    scope.files = this.files;

                },
                success: function(err, result) {
                },
                thumbnail: function(file, dataUrl) {
                    scope.thumbnail({file: file, dataUrl: dataUrl});
                },
                addedfile: function(file) {
                    scope.added({file: file});
                    scope.files = this.files;
                    console.log("this.files");
                    console.log(this.files);
                },
                clickable: '.upload'
            });
        },
        scope: {

            // Files
            files: '=',
            // Event
            thumbnail: '&',
            added: '&'


        }
    }
});