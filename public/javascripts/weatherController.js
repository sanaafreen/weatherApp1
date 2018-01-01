var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('weatherController', function ($scope, $http) {
    $scope.cityNameList = [];
    $scope.temperatureList = [];
    $scope.finalData = [];
    $scope.cityName;
    $scope.showMap = true;
    $scope.lat;
    $scope.lon;
    $scope.tempList;
    $scope.averageTemp = 0;
    $scope.chart1;

    $scope.getData = function(){
        $scope.cityNameList.push($scope.cityName);
        if($scope.cityNameList.length != 0){
            $scope.showMap = false;
        }
        $scope.finalData = [];
        for(i=0;i<$scope.cityNameList.length;i++){
            $scope.city = $scope.cityNameList[i];
            $http.get('http://api.openweathermap.org/data/2.5/forecast?appid=41759783c8ef8257cd229fff2283fe50&q='+$scope.city+',us')
                .then(function(response)
                {
                    $scope.lat = response.data.city.coord.lat;
                    $scope.lon = response.data.city.coord.lon;
                    $scope.tempList = response.data.list;
                    for (i=0;i<$scope.tempList.length;i++){
                        $scope.mainTemp = $scope.tempList[i].main;
                        $scope.temperatureList.unshift($scope.mainTemp.temp);
                        $scope.average = $scope.averageTemp + $scope.mainTemp.temp;
                    }
                    var data = {};
                    data["lat"] = $scope.lat;
                    data["lon"] = $scope.lon;
                    data["tempList"] = $scope.temperatureList;
                    data["averageTemp"] = $scope.average/$scope.tempList.length;
                    $scope.finalData.unshift(data);
                });
        }
    }

    $scope.initMap = function(lat, lon) {
        var mapOptions = {
            center: new google.maps.LatLng(lat, lon),
            zoom: 8
        }
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    }

    $scope.graph = function(tempList) {
            var title = {
                text: 'Temperatures of Cities'
            };
            var subtitle = {
                text: 'Source: worldClimate.com'
            };
            var xAxis = {
                categories: ['0', '50', '75', '100', '125', '150',
                    '175', '200', '225', '250', '275', '300']
            };
            var yAxis = {
                title: {
                    text: 'Temperature (\xB0C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            };
            var tooltip = {
                valueSuffix: '\xB0C'
            }
            var legend = {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            };

            var series =  [{
                name: 'Temperature',
                data: tempList
            }
            ];

            var json = {};
            json.title = title;
            json.subtitle = subtitle;
            json.xAxis = xAxis;
            json.yAxis = yAxis;
            json.tooltip = tooltip;
            json.legend = legend;
            json.series = series;
            $('#container').highcharts(json);
    }
});