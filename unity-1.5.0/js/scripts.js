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

    var data_array = [];
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    var today = new Date();
    $scope.m = today.getMonth()
    $scope.month = monthNames[$scope.m]
    var data_rows = [];

    $http({
        method: 'GET',
        url: "https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/_api/Lists/getbytitle('KLGBC_Events')/items?$expand=AttachmentFiles",
        dataType: 'json',
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            "Accept": "application/json; odata=verbose"
        }
    }).then(function (res) {
        rows = res.data.d.results;

        function eventdate(date) {
            // n = date.substring(8)
            // m = parseInt(n)
            // depan = date.substring(0, 8)
            // modified = depan + m
            modified = new Date(date).toLocaleDateString();
            return modified
        }

        function eventdate2(date) {
            
            time = new Date(date).toLocaleTimeString();
            date = new Date(date).toLocaleDateString();

            date_time = date + " " + time
            return date_time
        }

        angular.forEach(rows, function (value) {
            var event = []
            eventdate(value["EventDate"].substring(0, 10));
            eventdate2(value["EventDate"]);
            event.Event_Date = ((value["fAllDayEvent"])?  modified : date_time)
            // event.Event_Date = modified
            event.Title = value["Title"]
            event.mon = Math.round(value["mon"])
            event.Description = value["Description"]
            event.Event_Link = value["Event_Link"]
            event.Event_Type = value["Event_Type"]
            event.OData__x0054_ag1 = value["OData__x0054_ag1"]
            event.OData__x0054_ag2 = value["OData__x0054_ag2"]
            event.OData__x0054_ag3 = value["OData__x0054_ag3"]
            event.Thumbnail = value["Thumbnail"]
            event.Color = value["Color"]
            event.Description = value["Description"]

            if (value["Attachments"]) {
                if ("results" in value["AttachmentFiles"]) {
                    if (value["AttachmentFiles"]["results"].length > 0) {
                        if ("ServerRelativeUrl" in value["AttachmentFiles"]["results"][0]) {
                            event.Icon = "https://ishareteam3.na.xom.com" + value["AttachmentFiles"]["results"][0]["ServerRelativeUrl"]
                        }
                    }
                }
            } else {
                event.Icon = "https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/ktdc/unity-1.5.0/images/emit_logo.png"
            }

            var tag1, tag2, tag3, details_button = false

            if (value["OData__x0054_ag1"]) {
                event.tag1 = true
            } else {
                event.tag1 = false
            }
            if (value["OData__x0054_ag2"]) {
                event.tag2 = true
            } else {
                event.tag2 = false
            }
            if (value["OData__x0054_ag3"]) {
                event.tag3 = true
            } else {
                event.tag3 = false
            }

            if (value["Event_Link"]) {
                // value["Event_Link"] = value["Event_URL"]
                event.details_button = true
            } else (
                event.details_button = false
            )

            data_array.push(event)

        });



        angular.forEach(data_array, function (value) {

            if (value["mon"] == $scope.m) {
                data_rows.push(value)
            }

            if (value["Description"] != null) {
                var first = value["Description"].substring(0, 5)
                if (first == "<div>") {
                    value["Description"] = value["Description"].replace("<div>", "")
                    value["Description"] = value["Description"].replace("</div>", "")
                }
            }
            if (!value["Description"]) {
                value["Description"] = "Come join us in " + value["Title"]
            }

        })
        $scope.rows = data_rows;
        console.log(data_rows)

    }, function (error) {
        console.log("error when fetching data from sharepoint list")
    });

    $scope.prev_month = function (arr) {
        data_rows = []
        $scope.m = $scope.m - 1
        $scope.month = monthNames[$scope.m]
        arr = data_array

        angular.forEach(arr, function (value) {
            if (value["mon"] == $scope.m) {
                data_rows.push(value)
            }
        });
        console.log(data_rows)
        $scope.rows = data_rows;
    }

    $scope.next_month = function (arr) {
        data_rows = []
        $scope.m = $scope.m + 1
        $scope.month = monthNames[$scope.m]
        arr = data_array

        angular.forEach(arr, function (value) {
            if (value["mon"] == $scope.m) {
                data_rows.push(value)
            }
        });
        console.log(data_rows)
        $scope.rows = data_rows;
    }

    $scope.filter_type = function () {
        console.log($scope.type)
        // data_rows = []
        
    }

}]);

app.controller('resources_controller', ["$scope", "$http", "$stateParams", function ($scope, $http) {

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
    })
        .then(function (res) {
            rows = res.data.d.results;
            $scope.rows = rows

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
