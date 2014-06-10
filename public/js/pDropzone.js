
app.directive('pDropzone', function() {
    Dropzone.autoDiscover = false;
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            console.log('scope.files');
            console.log(scope.files);

            scope.$watch('files', function(newValue, oldValue) {
                console.log('watch files');
                console.log(oldValue);
                console.log(newValue);
                if (this.dropzone) {
                    this.dropzone.files = scope.files;
                }
            }.bind(this));

            this.dropzone = new Dropzone(el[0], {
                url: './upload/',
                thumbnailHeight: 300,
                thumbnailWidth: null,
                autoQueue: false,
                init: function() {

                    this.files = scope.files;

                },

                success: function(err, result) {
                },

                thumbnail: function(file, dataUrl) {
                    scope.thumbnail({file: file, dataUrl: dataUrl});
                    file.thumbnails = {
                        miniature: {
                            path: dataUrl,
                            size: {
                                width: file.width,
                                height: file.height
                            }
                        }
                    };
                    scope.$apply();
                },

                addedfile: function(file) {
                    scope.added({file: file});
                    console.log('added file:');
                    console.log(file);
                    var extensionId = "boknicagoipdeompcgnhjdalnbenclik";
                    chrome.runtime.sendMessage(extensionId, { message: "version" },
                        function (reply) {

                                alert(reply);
                        }
                    );
                },

                uploadprogress: function(file, total) {
                    console.log('total');
                    console.log(file.upload.progress);
                    scope.$apply();
                },

                totaluploadprogress: function(total, totalBytes, totalBytesSent) {
                    scope.progress = total;
                    scope.$apply();
                },

                clickable: '.upload'
            });
        }.bind(this),
        scope: {

            // Files
            files: '=',
            // Event
            thumbnail: '&',
            added: '&',
            progress: '='


        }
    }
});