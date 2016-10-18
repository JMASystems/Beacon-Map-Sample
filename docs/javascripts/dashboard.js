
var ContentType = 'application/json, text/plain, */*';
var module = angular.module("dashboard", ["ui.bootstrap","ngDraggable"]);

module.service('SharedService',['$http','$q','$rootScope','$interval',function($http,$q,$rootScope,$interval,$broadcast){
    var APP_ID = "";



}]);

module.controller("rootCtl", ['$rootScope','$scope','$log','$uibModal','$timeout','$sce','SharedService',
    function($rootScope,$scope,$log, $uibModal,$timeout,$sce,SharedService){
        $scope.users = [];
        $scope.userDetails = [];
        $scope.loading = false;
        $scope.loadingStatus = "";
        $scope.selectedUser = null;

        $scope.mainTitle = '';

        $scope.menuList = [
            {title:"フロア管理",url:'../html/floors.html',selected:false}];

        $scope.selectMenu = function (index) {
            for (var i = 0; i < $scope.menuList.length; i++){
                $scope.menuList[i].selected = false;
            }
            $scope.menuList[index].selected = true;
            $scope.mainUrl = $scope.menuList[index].url;
            $scope.mainTitle = $scope.menuList[index].title;
        }
        $scope.selectMenu(0);
        if (!$scope.secretkey) {
            $scope.mainTitle = '';
        }

        if(('localStorage' in window) && (window.localStorage !== null)) {

        } else {
            alert('このブラウザでは、保存機能は使えません。');
        }
    }]);

module.controller("DialogController", ['$scope', '$uibModalInstance',　'params',
    function($scope, $uibModalInstance, params){

        $scope.title = params.title;
        $scope.message = params.message;
        $scope.pressOK = function(){
            $uibModalInstance.close('OK');
        };
        $scope.pressCancel = function(){
            $uibModalInstance.dismiss('cancel');
        };

    }]);

module.controller("AlertController", ['$scope', '$uibModalInstance',　'params',
    function($scope, $uibModalInstance, params){

        $scope.title = params.title;
        $scope.message = params.message;
        $scope.pressAlertOK = function(){
            $uibModalInstance.close('OK');
        };


    }]);

