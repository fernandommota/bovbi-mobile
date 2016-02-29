/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

angular.module("bovBiMobile", [])
    .filter('percentage', ['$filter', function($filter) {
        return function(input, decimals) {
            return $filter('number')(input * 100, decimals) + '%';
        };
    }])
    .directive('loading', ['$http', function($http) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                scope.isLoading = function() {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function(v) {
                    if (v) {
                        elm.show();
                    } else {
                        elm.hide();
                    }
                });
            }
        };
    }]);

angular.module("bovBiMobile").controller("bovBiMobileCtrl", function($scope, $http) {
    $scope.app = "bovBiMobile";

    var testInternet = function() {
        $scope.internet = false;
        var start = new Date().getTime();
        ts =  new Date().getTime();
        $http.get("https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js?"+ts).success(function(data) {
            //console.log('true');
            $scope.internet = true; //'green';

            var end = new Date().getTime();
            $scope.latency = (end-start) + "ms";
        }).error(function(data, status) {
            //console.log('false');
            $scope.internet = false; //'red';

            $scope.latency = "Erro ao medir!";
        });
    };

    var testService = function() {
        var ts = new Date().getTime();
        var url = "http://52.72.218.37/pentaho/content/common-ui/resources/themes/images/puc-login-logo.png?"+ts;
        var img = new Image();
        img.src = url;
        $scope.service = false;

        img.onload = function()
        {
            // If the server is up, do this.
            //console.log("Server is up!");
            $scope.service = true;
            $scope.$apply();
        }

        img.onerror = function()
        {
            // If the server is down, do that.
            //console.log("Server is down!");
            $scope.service = false;
            $scope.$apply();
        }
    };

    testInternet();
    testService();

});