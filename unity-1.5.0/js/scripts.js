app.controller('MatrixController', ["$scope", "$http", function ($scope, $http) {

    $scope.show_form = true;
    $http({
        method: 'GET',
        url: "https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/_api/Lists/getbytitle('Articles')/items?$top=3&$orderby=Created desc",
        dataType: 'json',
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            "Accept": "application/json; odata=verbose"
        }
    }).then(function (res) {
        $scope.rows = res.data.d.results;

    }, function (error) {
        console.log("error when fetching data from sharepoint list")
    });


    $http({
        method: 'GET',
        url: "https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/_api/Web/CurrentUser",
        dataType: 'json',
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            "Accept": "application/json; odata=verbose"
        }
    }).then(function (res) {
        $scope.user = res.data.d.Title;

    }, function (error) {
        console.log("error when fetching data from sharepoint list")
    });

    function getFormDigestValue() {
        return $http({
            url: "https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/_api/contextinfo",
            withCredentials: true,
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json; odata=verbose"
            },
        }).then(function (res) {
            // console.log(res);
            var digest = res.data.FormDigestValue || res.data.d.GetContextWebInformation.FormDigestValue;
            return digest;
        })
    }


    //feedback submission

    $scope.submit_feedback = function (dat) {
        // console.log("feedback submitted");
        // console.log(dat);

        d = {
            __metadata: {
                type: 'SP.Data.FeedbacksListItem',
            }
        }

        d["name"] = $scope.user
        d["feedback"] = dat["feedback"]
        console.log(d);

        getFormDigestValue().then(function (FormDigestValue) {
            console.log(FormDigestValue);
            return $http({
                method: 'POST',
                url: "https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/_api/Lists/getbytitle('Feedbacks')/items",
                headers: {
                    accept: 'application/json; odata=verbose',
                    "content-type": 'application/json; odata=verbose',
                    "X-RequestDigest": FormDigestValue
                },
                data: d
            }).then(
                function onSuccess(response) {
                    console.log('A feedback has been received')
                    $scope.feedback_submitted = true;
                    $scope.show_form = false;

                },
                function onError(error) {
                    console.error('An error occur while trying to sending feedback')
                }
            )
        });

    }



}]);

app.controller('cop_controller', ["$scope", "$http", "$stateParams", function ($scope, $http, $stateParams) {
    cop_filter = "?$filter= state eq" + $stateParams.cop

    cop = $stateParams.cop
    $http({
        method: 'GET',
        url: "https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/_api/Lists/getbytitle('Interest_Networks')/items",
        dataType: 'json',
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            "Accept": "application/json; odata=verbose"
        }
    }).then(function (res) {
        rows = res.data.d.results;

        $scope.data = rows.filter(function (item) {
            return item.state == cop
        });

        $scope.cop_name = $scope.data[0].Network
        $scope.yammer = $scope.data[0].yammer


    }, function (error) {
        console.log("error when fetching data from sharepoint list")
    });

}]);

app.controller('event_controller', ["$scope", "$http", "$stateParams", function ($scope, $http, $stateParams) {

    // console.log("event_controller has been summoned")
    $http({
        method: 'GET',
        url: "https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/_api/Lists/getbytitle('Events')/items",
        dataType: 'json',
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            "Accept": "application/json; odata=verbose"
        }
    }).then(function (res) {
        rows = res.data.d.results;
        // date = rows[0].Event_Date;

        function eventdate(date){
            n = date.substring(8)
            m = parseInt(n) + 1
            depan = date.substring(0, 8)
            modified = depan + m
            return modified
        }

        var data_array = []; 

        angular.forEach(rows, function (value) {
            var event = []
            // event.Event_Date = value["Event_Date"].substring(0, 10);
            eventdate(value["Event_Date"].substring(0, 10));
            event.Event_Date = modified
            event.Title = value["Title"]
            event.Description = value["Description"]
            event.Event_Link = value["Event_Link"]
            event.Event_Type = value["Event_Type"]
            event.OData__x0054_ag1 = value["OData__x0054_ag1"]
            event.OData__x0054_ag2 = value["OData__x0054_ag2"]
            event.OData__x0054_ag3 = value["OData__x0054_ag3"]
            event.Thumbnail = value["Thumbnail"]
            event.color = value["color"]
            event.Description = value["Description"]
            data_array.push(event)

        });

        console.log(data_array)

        $scope.rows = data_array;

        // $scope.data = rows.filter(function(item) {
        //     return item.state == cop
        // });

        // $scope.cop_name = $scope.data[0].Network
        // console.log($scope.cop_name)

    }, function (error) {
        console.log("error when fetching data from sharepoint list")
    });

}]);

app.controller('resources_controller', ["$scope", "$http", "$stateParams", function ($scope, $http) {

    // console.log("resources_controller has been summoned")
    $http({
        method: 'GET',
        url: "https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/_api/Lists/getbytitle('Resources')/items?$orderby=Priority",
        dataType: 'json',
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            "Accept": "application/json; odata=verbose"
        }
    }).then(function (res) {
        rows = res.data.d.results;
        $scope.rows = rows
        // console.log(rows)

        var auto_array = [];
        var data_array = [];
        var cloud_array = [];
        var other_array = [];

        angular.forEach(rows, function (value) {
            if (value["Training_Type"] == "Automation") {
                auto_array.push(value)

            }
            else if (value["Training_Type"] == "Analytics") {
                data_array.push(value)
            }
            else if (value["Training_Type"] == "Cloud") {
                cloud_array.push(value)
            }
            else {
                other_array.push(value)
            }
        });

        $scope.automation = auto_array
        $scope.analytics = data_array
        $scope.cloud = cloud_array
        $scope.others = other_array

    }, function (error) {
        console.log("error when fetching data from sharepoint list")
    });

}]);

app.controller('about_controller', ["$scope", "$http", "$stateParams", function ($scope, $http) {
    $scope.show_form = true;

    $http({
        method: 'GET',
        url: "https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/_api/Web/CurrentUser",
        dataType: 'json',
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            "Accept": "application/json; odata=verbose"
        }
    }).then(function (res) {
        $scope.user = res.data.d.Title;

    }, function (error) {
        console.log("error when fetching data from sharepoint list")
    });

    function getFormDigestValue() {
        return $http({
            url: "https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/_api/contextinfo",
            withCredentials: true,
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json; odata=verbose"
            },
        }).then(function (res) {
            // console.log(res);
            var digest = res.data.FormDigestValue || res.data.d.GetContextWebInformation.FormDigestValue;
            return digest;
        })
    }


    //feedback submission

    $scope.submit_feedback = function (dat) {
        // console.log("feedback submitted");
        // console.log(dat);

        d = {
            __metadata: {
                type: 'SP.Data.FeedbacksListItem',
            }
        }

        d["name"] = $scope.user
        d["feedback"] = dat["feedback"]
        console.log(d);

        getFormDigestValue().then(function (FormDigestValue) {
            console.log(FormDigestValue);
            return $http({
                method: 'POST',
                url: "https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/_api/Lists/getbytitle('Feedbacks')/items",
                headers: {
                    accept: 'application/json; odata=verbose',
                    "content-type": 'application/json; odata=verbose',
                    "X-RequestDigest": FormDigestValue
                },
                data: d
            }).then(
                function onSuccess(response) {
                    console.log('A feedback has been received')
                    $scope.feedback_submitted = true;
                    $scope.show_form = false;

                },
                function onError(error) {
                    console.error('An error occur while trying to sending feedback')
                }
            )
        });

    }

}]);