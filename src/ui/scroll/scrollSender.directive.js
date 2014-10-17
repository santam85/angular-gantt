'use strict';
gantt.directive('ganttScrollSender', ['$timeout', 'debounce', function($timeout,debounce) {
    // Updates the element which are registered for the horizontal or vertical scroll event

    return {
        restrict: 'A',
        require: '^ganttScrollManager',
        controller: ['$scope', '$element', 'jquery', function($scope, $element) {
            var el = $element[0];
            var updateListeners = function() {
                var i, l;

                for (i = 0, l = $scope.scrollManager.vertical.length; i < l; i++) {
                    var vElement = $scope.scrollManager.vertical[i];
                    if (vElement.style.top !== -el.scrollTop) {
                        vElement.style.top = -el.scrollTop + 'px';
                        vElement.style.height = el.scrollHeight + 'px';
                    }
                }

                for (i = 0, l = $scope.scrollManager.horizontal.length; i < l; i++) {
                    var hElement = $scope.scrollManager.horizontal[i];
                    if (hElement.style.left !== -el.scrollLeft) {
                        hElement.style.left = -el.scrollLeft + 'px';
                        hElement.style.width = el.scrollWidth + 'px';
                    }
                }
            };

            $element.bind('scroll', updateListeners);

            $scope.$watch('gantt.width', function(newValue) {
                if (newValue === 0) {
                    $timeout(function() {
                        updateListeners();
                    }, 0, true);
                }
            });

            $scope.$watch(function() {
              return $scope.scrollManager.vertical.map(function(scroller){
                return angular.element(scroller).children().length;
              }).reduce(function(a,b){
                return a+b;
              });
            }, debounce(function() {
              $timeout(function() {
                updateListeners();
              }, 0, true);
            },5));

        }]
    };
}]);
