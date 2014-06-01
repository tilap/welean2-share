var app = angular.module('picanoo', ['justifydiv']);

app.controller("AppCtrl", ['$scope', function($scope) {
    $scope.medias = [];
    $scope.files = [];
    $scope.isnew = true;

    $scope.setData  = function(data) {
        console.log(data);
        $scope.isnew = data.isnew;
        $scope.error = data.error;
        $scope.medias = data.files;
        return;
    }


    $scope.thumbnail = function(file, dataUrl) {
        console.log('thumbnail');
        console.log(arguments);
    }

    $scope.added = function(file) {
        $scope.medias.push({hello: 'test'

        });
        $scope.$apply();
        console.log($scope.medias);
        console.log('added');
        console.log(arguments);
    }.bind(this);

    for (var i = 0; i < 6 ; i++) {
        $scope.medias.push({id: i, height: 100, width: Math.round(Math.random()*300)});
    }
    var app = this;
}]);

app.directive('medias', function() {
    return {
        link: function(scope, element, attr, ctrl) {
            if (scope.setData) {
                var data = (element[0].innerHTML);
                scope.setData(angular.fromJson(data));
            } else {
                console.log("Scope has no setData");
            }
        }
    }
});

app.directive('pMedia', function() {
    return {
      template: '<div class="dj-child-container dz-preview thumbnail dz-image-preview ">\
    <div class="dz-details">\
        <div class="dz-filename">\
            <span data-dz-name>{{media.name}}</span>\
        </div>\
        <a  rel="slideshow" href="{{media.thumbnails.slideshow.path}}">\
            <img class="dj-child" width="{{media.thumbnails.miniature.size.width}}" \
            height="{{media.thumbnails.miniature.size.height}}" data-dz-thumbnail \
            alt="{{media.name}}" src="{{media.thumbnails.miniature.path}}" />\
        </a>\
    </div>\
    <div class="dz-progress" data-dz-uploadprogress><span class="dz-upload"></span></div>\
</div>',
      scope: {
        media: '='
      },
    };
});

app.directive('pSlideshow', function() {
    return {
        link: function(scope, element, attr, ctrl) {

            $(element).find('a').fancybox({
                helpers : {
                    overlay : {
                        css : {
                            'background' : 'rgba(0, 0, 0, 0.8)'
                        }
                    }
                },
                padding : 0,
            });

        }
    }
});