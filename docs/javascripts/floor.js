
var ContentType = 'application/json, text/plain, */*';
var module = angular.module("dashboard");

module.controller("floorCtrl", ['$rootScope','$scope','$log','$uibModal','$timeout','$sce','SharedService',
    function($rootScope,$scope,$log, $uibModal,$timeout,$sce,SharedService){

        $scope.loading = false;
        $scope.loadingStatus = "hogehoge";
        $scope.noData = true;
        $scope.noAppData = true;
        $scope.noFloorData = true;
        $scope.file = '';
        $scope.floor = {MAP_IMAGE_NAME:'',MAP_IMAGE:'',MAP_IMAGE_ID:''};
        $scope.MAP_IMAGE = '';


        $scope.selectFile = function () {
            var elements = document.getElementById("hidden__csv__button");
            elements.click();
        }
        $scope.srcUrl = '';
        $scope.mapImgSrc = '';
        //変化を監視して画像読み込み＋表示を実行
        $scope.$watch("file",function(file){

            //画像ファイルじゃなければ何もしない
            if(!file || !file.type.match("image.*")){
                if (file){
                    $scope.error_message = '画像ファイルを選択してください。';
                }
                return;
            }
            if (file.size > 1000 * 1000 * 2){
                $scope.error_message = '2M以下のサイズにしてください。';
                return;
            }
            //new FileReader API
            var reader = new FileReader();

            //callback
            reader.onload = function(){
                $scope.$apply(function(){
                    $scope.srcUrl = file.name;
                    $scope.MAP_IMAGE = reader.result;
                    $scope.mapImgSrc = {'background-image':'url('+$scope.MAP_IMAGE+')'};
                    saveObjects();
                });
            };

            //read as url(reader.result = url)
            reader.readAsDataURL(file);

            $scope.error_message = '';

        });


        $scope.updateFloor = function () {
            if ($scope.floor.name == '' || $scope.srcUrl == '') {
                $scope.error_message = '正しく入力してください';
                return;
            } else {
                $scope.loading = true;

                SharedService.updateFloors($scope.subscription,userName,pass,$scope.floor.MAP_IMAGE_NAME,$scope.floor.MAP_IMAGE_ID,$scope.MAP_IMAGE).
                then(function (success) {
                    if(success.data.response == 'success'){
                        reloadFloor();
                    } else {
                        if (success.data.type == 'not permission') {
                            $scope.error_message = '権限エラー：再ログインしてください';
                        } else {
                            $scope.error_message = success.data.type;
                        }
                        $scope.noData = true;
                    }
                    $scope.loading = false;
                },function (error) {
                    $scope.loading = false;
                });
            }
        }
        var droppedObjects = [
            {ID:'001'},
            {ID:'002'},
            {ID:'003'},
            {ID:'004'},
            {ID:'005'},
            {ID:'006'},
            {ID:'007'},
            {ID:'008'},
            {ID:'009'},
            {ID:'010'},
            {ID:'011'},
            {ID:'012'},
            {ID:'013'},
            {ID:'014'},
            {ID:'015'},
            {ID:'016'},
            {ID:'017'},
            {ID:'018'},
            {ID:'019'},
            {ID:'020'},
            {ID:'021'},
            {ID:'022'},
            {ID:'023'},
            {ID:'024'},
            {ID:'025'},
            {ID:'026'}]


        $scope.droppedObjects2 = [];
        $scope.droppedObjects1 = [];
        var saveObjects = function () {
            window.localStorage.setItem('beacon_object', JSON.stringify($scope.droppedObjects1));
            window.localStorage.setItem('beacon_object2', JSON.stringify($scope.droppedObjects2));

            window.localStorage.setItem('beacon_image', JSON.stringify($scope.mapImgSrc));

        }

        var loadObjects = function () {
            var obj = window.localStorage.getItem('beacon_object');
            if (!obj){
                $scope.droppedObjects1 = droppedObjects;
            } else {
                $scope.droppedObjects1 = JSON.parse(obj);
            }

            var obj2 = window.localStorage.getItem('beacon_object2');
            if (obj2){
                $scope.droppedObjects2 = JSON.parse(obj2);
            }

            var img = window.localStorage.getItem('beacon_image');
            if (img){
                $scope.mapImgSrc = JSON.parse(img);
            }
        }

        loadObjects();




        $scope.selectBeacon = function (obj) {
            $scope.selectedBeacon = ' (X:' + obj.X + ' Y:' + obj.Y + ')';
        }


        // Beacon List Drag & Drop

        $scope.onDropComplete1=function(data,evt){
            var index = $scope.droppedObjects1.indexOf(data);
            if (index == -1) {
                data.style = {};
                data.X = 0;
                data.Y = 0;
                $scope.droppedObjects1.push(data);
            }
            saveObjects();
        }
        $scope.onDragSuccess1=function(data,evt){
            var index = $scope.droppedObjects1.indexOf(data);
            if (index > -1) {
                $scope.droppedObjects1.splice(index, 1);
            }
        }
        $scope.onDragSuccess2=function(data,evt){
            var index = $scope.droppedObjects2.indexOf(data);
            if (index > -1) {
                $scope.droppedObjects2.splice(index, 1);
            }
        }
        $scope.onDropComplete2=function(data,evt){
            var index = $scope.droppedObjects2.indexOf(data);
            if (index == -1) {
                // 要素の位置を取得する
                var element = document.getElementById( "beacon-drop-map" ) ;
                var rect = element.getBoundingClientRect() ;

                // 座標を計算する
                var positionX = rect.left;	// 要素のX座標
                var positionY = rect.top;	// 要素のY座標

                var X = evt.event.clientX - positionX - 25;
                var Y = evt.event.clientY - positionY -25;

                data.style = {'left':X + "px",'top':Y + "px"};
                data.X = X;
                data.Y = Y;

                $scope.droppedObjects2.push(data);
            }
            saveObjects();
        }


    }]);
//directive
module.directive('fileModel',function($parse){
    return{
        restrict: 'A',
        link: function(scope,element,attrs){
            var model = $parse(attrs.fileModel);
            element.bind('change',function(){
                scope.$apply(function(){
                    model.assign(scope,element[0].files[0]);
                });
            });
        }
    };
});
