angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
    $scope.center = {
        lat: 39.916527,
        lng: 116.397128
    };

    $scope.markers = [{
        lat: 1,
        lng: 1
    }];

    $scope.circles = [{
        lat: 1,
        lng: 1
    }]

})

.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
