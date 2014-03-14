var app = angular.module('myApp', []);
//var myDataRef = new Firebase('https://freightload1.firebaseio.com');
var myDataRef = new Firebase('https://truckdat1.firebaseio.com');
var nameArr = [];
var descArr = [];
var pickuplocArr = [];
var dropofflocArr = [];
var dateArr = [];
var i=0;

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/edit/:contactId', {
      templateUrl: 'partial_edit.html',
      controller: "ContactEditCtrl"
    });

    $routeProvider.when('/list', {
      templateUrl: 'partial_list.html',
      controller: "ContactListCtrl"
    });

    $routeProvider.when('/order/:orderId', {
      templateUrl: 'partial_order.html',
      controller: "OrderEditCtrl"
    });

    $routeProvider.when('/order', {
      templateUrl: 'partial_orderlist.html',
      controller: "OrderListCtrl"
    });


$routeProvider.when('/qoutes/:qoutesId', {
      templateUrl: 'partial_qoutes.html',
      controller: "QoutesEditCtrl"
    });

    $routeProvider.when('/qoutes', {
      templateUrl: 'partial_qouteslist.html',
      controller: "qoutesListCtrl"
    });



    $routeProvider.otherwise({
      redirectTo: '/list'
    });
  }
]);

app.directive('contactWidget', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'template_contact.html',
    scope: {
      contact: '='
    }
  };
});

app.directive('orderWidget', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'template_order.html',
    scope: {
      order: '='
    }
  };
});

app.controller("ContactCtrl", function ContactCtrl($scope) {

  myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    console.log(message);

    var respStr = JSON.stringify(message);
    var respJSONobj = JSON.parse(respStr);
    var res = JSON.stringify(respJSONobj.object);

    //console.log(message['name']);
    
    console.log("Carriage Details: " + res);
    var obj = JSON.parse(res);
    
    //console.log(obj.name);
    
    nameArr[i]=obj.name;
    descArr[i]=obj.description;
    pickuplocArr[i]=obj.pickuplocation;
    dropofflocArr[i]=obj.dropofflocation;
    dateArr[i]=obj.Date;
    
    console.log(nameArr.length);
    console.log("name : "+nameArr[i]);
    i++;
    
    $scope.contacts.push({"name": obj.name,
      "description": obj.description,
      "pickuplocation": obj.pickuplocation,
      "dropofflocation": obj.dropofflocation,
      "date": obj.Date});
      
      
    /*$scope.contacts=[{"name": obj.name,
      "description": obj.description,
      "pickuplocation": obj.pickuplocation,
      "dropofflocation": obj.dropofflocation,
      "date": obj.Date}];*/

  });
      
  $scope.contacts = [];
  /*      {"name":"Mudassar Ali",
            "description":"Pick up chairs move to home",
            "pickuplocation":"Wall street",
            "dropofflocation":"Broad way",
            "date":"02-2-2014"}];,
        {"name":"Jasmin alibiano",
            "description":"Car parts bring to my shop",
            "pickuplocation":"Chaina Chowk",
            "dropofflocation":"Gulberge",
            "date":"17-3-2014"},
        {"name":"Zahnara",
            "description":"Take the Bed sheets to store",
            "pickuplocation":"Model twon",
            "dropofflocation":"Green town",
            "date":"23-3-2014"
            
        }
    ];*/
});

app.controller("ContactListCtrl", function ContactListCtrl($scope) {
  $scope.mode = 'vignette';
});

app.controller("ContactEditCtrl", function ContactEditCtrl($scope, $routeParams, $location) {
  var newContact = false;
  if ($routeParams.contactId) {
    $scope.contact = $scope.contacts[$routeParams.contactId];
  } else {
    $scope.contact = {};
    newContact = true;
  }
  $scope.saveContact = function() {
    if (newContact) {
      //$scope.contacts.push($scope.contact);
      //console.log($scope.contact);

      myDataRef.push({
        object: $scope.contact
        /*name: name,
            description: desc,
            pickuplocation: pickup_loc,
            droplocation: drop_loc,
            date: date*/
      });

      console.log("inside save contact");
    }
    $location.path("/list");
  };
});

app.controller("OrderListCtrl", function OrderListCtrl($scope) {
  $scope.mode = 'vignette';
});

app.controller("OrderEditCtrl", function OrderEditCtrl($scope, $routeParams, $location, bidFactory) {
  var newOrder = false;

  function init() {
    if ($routeParams.orderId) {
      $scope.order = bidFactory.getOrder($routeParams.orderId);
    } else {
      $scope.order = {};
      newOrder = true;
    }
  }

  init();


  $scope.saveOrder = function() {
    if (newOrder) {
      bidFactory.addOrder($scope.order);
    }
    $location.path("/qoutes");
  };
});

app.factory("bidFactory", function() {
  var factory = {};

  factory.orders = [];

  factory.getOrders = function() {
    return factory.orders;
  };

  factory.getOrder = function(orderId) {
    for (var i = 0; i < factory.orders.length; i++) {
      if (factory.order[i].id === orderId) {
        return factory.order[i];
      }
    }
  };

  factory.addOrder = function(order) {
    factory.orders.push(order);
  }

  return factory;
});