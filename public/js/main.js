var app = angular.module('picanoo', ['justifydiv']);

app.controller("AppCtrl", ['$scope', function($scope) {
    $scope.medias = [];
    $scope.isnew = true;

    $scope.setData  = function(data) {
        console.log(data);
        $scope.isnew = data.isnew;
        $scope.error = data.error;
        $scope.medias = data.files;
        return;
    }

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
      templateUrl: '/media.html',
      scope: {
        media: '='
      },
    };
})