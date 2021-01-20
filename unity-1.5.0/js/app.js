var app = angular.module("ktdc", ['ngRoute', 'ui.router', 'ui.router.state.events'])

app.config(function ($stateProvider) {
  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "templates/home.html",
      controller: "MatrixController"
    })
    .state("cop", {
      url: "/interest_network/:cop",
      templateUrl: "templates/interest_network.html",
      controller: "cop_controller"
    })
    .state("events", {
      url: "/events",
      templateUrl: "templates/events.html",
      controller: "event_controller"
    })
    .state("resources", {
      url: "/resources",
      templateUrl: "templates/resources.html",
      controller: "resources_controller"
    })
    .state("about", {
      url: "/about",
      templateUrl: "templates/about_ktdc.html",
      controller: "about_controller"
    })
    // .state("/", {
    //   templateUrl: "templates/home.html",
    //   controller: "MatrixController"
    // })
    // .when("/interest_network/:cop", {
    //   templateUrl: "templates/interest_network.html",
    //   controller: "cop_controller"
    // })
});