var myApp = angular.module('myApp',['angularUtils.directives.dirPagination','ui.bootstrap']);


myApp.factory('congressService',function($http){
    
    var result = {
   callAsyncLegislators : function(){
    var promise =  $http({
  method: 'GET',
  url: './congressService.php?query=legislator'
}).then(function successCallback(response) {
   
      return response.data; 
  }, function errorCallback(response) {
    
   return response;
  });
       return promise;
},
        callAsyncCommittee : function(){
    var promise =  $http({
  method: 'GET',
  url: './congressService.php?query=committee'
}).then(function successCallback(response) {
   
      return response.data; 
  }, function errorCallback(response) {
    
   return response;
  });
       return promise;
},

 callAsyncBills : function(){
    var promise =  $http({
  method: 'GET',
  url: './congressService.php?query=bills'
}).then(function successCallback(response) {
   
      return response.data; 
  }, function errorCallback(response) {
    
   return response;
  });
       return promise;
},
         callAsyncCommitteeByLegislator : function(bgid){
    var promise =  $http({
  method: 'GET',
  url: './congressService.php?query=committee&member_ids='+bgid
}).then(function successCallback(response) {
   
      return response.data; 
  }, function errorCallback(response) {
    
   return response;
  });
       return promise;
},
         callAsyncBillsByLegislator : function(bgid){
    var promise =  $http({
  method: 'GET',
  url: './congressService.php?query=bills&sponsor_id='+bgid
}).then(function successCallback(response) {
   
      return response.data; 
  }, function errorCallback(response) {
    
   return response;
  });
       return promise;
}

}
    return result;
    
    
})

myApp.controller('mainController',  function($scope,$rootScope,congressService) {
 
 $scope.loadFlag = false;
    
    
    //local storage
     $scope.favLegis = [];
    $scope.favComm = [];
    $scope.favBill = [];
    
   console.log('exists')
    
      if (typeof(Storage) !== "undefined") {
    
         
   if(localStorage.getItem("favLegislators")){
       
        $scope.favLegis = JSON.parse(localStorage.getItem("favLegislators"));
       
   }
          
          if(localStorage.getItem("favBills")){
       
        $scope.favBill = JSON.parse(localStorage.getItem("favBills"));
      
   }
          
           if(localStorage.getItem("favCommittees")){
       
        $scope.favComm = JSON.parse(localStorage.getItem("favCommittees"));
      
   }
} 
congressService.callAsyncLegislators().then(function(data){
    console.log(data);
    $scope.legislators = data;
    $scope.loadFlag = true;
    
    
      $scope.legislators.results.forEach(function(element){
                     
                     for(var j=0;j< $scope.favLegis.length; j++)
                     if(element.bioguide_id ==  $scope.favLegis[j].bioguide_id){
                         element.favflag = true;
                     
                     }
                 });
   
});
    
    congressService.callAsyncCommittee().then(function(data){
    console.log(data);
    
   
    $scope.committees = data;
        
        
        $scope.committees.results.forEach(function(element){
                     
                     for(var j=0;j< $scope.favComm.length; j++)
                     if(element.committee_id ==  $scope.favComm[j].committee_id){
                         element.favflag = true;
                     
                     }
                 });
});
    
    congressService.callAsyncBills().then(function(data){
    console.log(data);
    
    
    $scope.bills = data;
        
        $scope.bills.results.forEach(function(element){
                     
                     for(var j=0;j< $scope.favBill.length; j++)
                     if(element.bill_id ==  $scope.favBill[j].bill_id){
                         element.favflag = true;
                     
                     }
                 });
   
});
    
    
    $scope.republic = 'http://cs-server.usc.edu:45678/hw/hw8/images/r.png';
    $scope.democratic = 'http://cs-server.usc.edu:45678/hw/hw8/images/d.png';
    $scope.houseimg = 'http://cs-server.usc.edu:45678/hw/hw8/images/h.png';
    $scope.senateimg = 'http://cs-server.usc.edu:45678/hw/hw8/images/s.svg';
    
   
    
});


myApp.controller('legislatorController',  function($scope,$rootScope,congressService) {
 
 $scope.states = ["Alabama" ,"Montana","Alaska","Nebraska" ,"Arizona" ,"Nevada"  ,
"Arkansas" ,"New Hampshire" ,"California","New Jersey","Colorado","New Mexico" ,"Connecticut"  ,"New York","Delaware",
"North Carolina" ,"District Of Columbia","North Dakota","Florida"  ,"Ohio"  ,"Georgia" ,"Oklahoma"  ,"Hawaii","Oregon" ,
"Idaho","Pennsylvania","Illinois"  ,"Rhode Island" ,
"Indiana","South Carolina"  ,"Iowa"  ,"South Dakota","Kansas" ,"Tennessee"  ,
"Kentucky","Texas"  ,"Louisiana"  ,"Utah" ,"Maine" ,"Vermont" ,"Maryland","Virginia",
"Massachusetts","Washington","Michigan"  ,"West Virginia" ,"Minnesota"  ,"Wisconsin"  ,
"Mississippi"  ,"Wyoming","Missouri"  ];
  
$scope.currentPage1 =1;
   $scope.currentPage2 =1;
    $scope.currentPage3 =1;
    $scope.pageSize =10;
        
    $scope.selectedState = null;
    $rootScope.$on("nextCarousel", function(event,item){
        
           $scope.next(item);
        });
    $scope.next= function(item){
        
        congressService.callAsyncCommitteeByLegislator(item.bioguide_id).then(function(data){
   
    $scope.itemCommittees = data;
            console.log($scope.itemCommittees);
});
        
        congressService.callAsyncBillsByLegislator(item.bioguide_id).then(function(data){
   
    $scope.itemBills = data;
            console.log($scope.itemBills);
});
   
        
    
        $('#legisCarousel').carousel(1);
        $scope.itemDetails = item;
        $scope.displayPicURL = "https://theunitedstates.io/images/congress/original/" + item.bioguide_id+'.jpg';
    //    $scope.progressPercent = 20;
        var now = moment().format('YYYY-MM-DD');
var a = moment(item.term_start);
var b = moment(item.term_end);
var x = moment(now);
   
$scope.progressPercent  = Math.round(x.diff(a)*100/b.diff(a));
       
    }
    
    $scope.prev= function(){
        
        $('#legisCarousel').carousel('prev');
       
    }
    
    $scope.addFav = function(){
        
         if (typeof(Storage) !== "undefined") {
             
             if($scope.itemDetails.favflag){
                 
                 $scope.itemDetails.favflag = false;
                 console.log('not set- remove')
                 $scope.$parent.legislators.results.forEach(function(element){
                     
                     
                     if(element.bioguide_id == $scope.itemDetails.bioguide_id){
                         element.favflag = false;
                     
                     }
                 });
                 
                 for (var i = 0; i < $scope.$parent.favLegis.length; i++) {
                if ($scope.$parent.favLegis[i].bioguide_id == $scope.itemDetails.bioguide_id) {
                        $scope.$parent.favLegis.splice(i, 1);
                        break;
                            }
                        }
                 
                 
              localStorage.setItem("favLegislators", JSON.stringify($scope.$parent.favLegis));
                 
             }
             else{
                 
                $scope.itemDetails.favflag = true;
                 $scope.$parent.legislators.results.forEach(function(element){
                     
                     
                     if(element.bioguide_id == $scope.itemDetails.bioguide_id){
                         element.favflag = true;
                     
                     }
                 });
                 
                 $scope.$parent.favLegis.push($scope.itemDetails)
              localStorage.setItem("favLegislators", JSON.stringify($scope.$parent.favLegis));
             }
             
             
             
             
             
    // Retrieve
   console.log(localStorage.getItem("favLegislators"));
             
   
} else {
    
    alert('Cannot Add Favorites, Browser does not support Local Storage')
    
}
        
    }
   
    
});

myApp.controller('billsController',  function($scope,$rootScope,congressService) {
 
 
$scope.currentPage1 =1;
    $scope.currentPage2 =1;
    $scope.pageSize =10;
    
    
    $rootScope.$on("nextBillCarousel", function(event,item){
        
        console.log('hi...')
        
           $scope.next(item);
        });
    
    
    $scope.next= function(item){
        
        console.log(item);
        $scope.itemBill = item;
     $('#billCarousel').carousel(1);
    
    }
    
    $scope.prev= function(){
        
        $('#billCarousel').carousel('prev');
       
    }
    
    
    
    
    
     $scope.addFav = function(){
        
         if (typeof(Storage) !== "undefined") {
             
             if($scope.itemBill.favflag){
                 
                 $scope.itemBill.favflag = false;
                 console.log('not set- remove')
                 $scope.$parent.bills.results.forEach(function(element){
                     
                     
                     if(element.bill_id == $scope.itemBill.bill_id){
                         element.favflag = false;
                     
                     }
                 });
                 
                 for (var i = 0; i < $scope.$parent.favBill.length; i++) {
                if ($scope.$parent.favBill[i].bill_id == $scope.itemBill.bill_id) {
                        $scope.$parent.favBill.splice(i, 1);
                        break;
                            }
                        }
                 
                 
              localStorage.setItem("favBills", JSON.stringify($scope.$parent.favBill));
                 
             }
             else{
                 
                $scope.itemBill.favflag = true;
                 $scope.$parent.bills.results.forEach(function(element){
                     
                     
                     if(element.bill_id == $scope.itemBill.bill_id){
                         element.favflag = true;
                     
                     }
                 });
                 
                 $scope.$parent.favBill.push($scope.itemBill)
              localStorage.setItem("favBills", JSON.stringify($scope.$parent.favBill));
             }
             
             
             
             
             
    // Retrieve
   console.log(localStorage.getItem("favBills"));
             
   
} else {
    
    alert('Cannot Add Favorites, Browser does not support Local Storage')
    
}
        
    }
    
    
    
    
 
});

myApp.controller('committeesController',  function($scope,$rootScope,congressService) {
 
 
$scope.currentPage1 =1;
    $scope.currentPage2 =1;
    $scope.currentPage3 =1;
    $scope.pageSize =10;
    

     $scope.addFav = function(item){
        
         if (typeof(Storage) !== "undefined") {
             
             if(item.favflag){
                 
                item.favflag = false;
                 console.log('not set- remove')
                 $scope.$parent.committees.results.forEach(function(element){
                     
                     
                     if(element.committee_id == item.committee_id){
                         element.favflag = false;
                          console.log('found');
                     
                     }
                 });
                 
                 for (var i = 0; i < $scope.$parent.favComm.length; i++) {
                if ($scope.$parent.favComm[i].committee_id == item.committee_id) {
                        $scope.$parent.favComm.splice(i, 1);
                     console.log('found');
                        break;
                            }
                        }
                 
                 
              localStorage.setItem("favCommittees", JSON.stringify($scope.$parent.favComm));
                 
             }
             else{
                 
                item.favflag = true;
                 $scope.$parent.committees.results.forEach(function(element){
                     
                     
                     if(element.committee_id == item.committee_id){
                         element.favflag = true;
                     console.log('found');
                     }
                 });
                 
                 $scope.$parent.favComm.push(item)
              localStorage.setItem("favCommittees", JSON.stringify($scope.$parent.favComm));
             }
             
             
             
             
             
    // Retrieve
   console.log(localStorage.getItem("favCommittees"));
             
   
} else {
    
    alert('Cannot Add Favorites, Browser does not support Local Storage')
    
}
        
    }
    
 
});

myApp.controller('favController',  function($scope,$rootScope,congressService) {
 

$scope.currentPage =1;
    $scope.pageSize =10;

    $scope.favlegislators = JSON.parse(localStorage.getItem("favLegislators"));
    console.log('local--',$scope.favlegislators);
    
    $scope.removeFavLegis = function(item){
        
                 $scope.$parent.legislators.results.forEach(function(element){
                     
                     
                     if(element.bioguide_id == item.bioguide_id){
                         element.favflag = false;
                     
                     }
                 });
                 
                 for (var i = 0; i < $scope.$parent.favLegis.length; i++) {
                if ($scope.$parent.favLegis[i].bioguide_id == item.bioguide_id) {
                        $scope.$parent.favLegis.splice(i, 1);
                        break;
                            }
                        }
                 
                
              localStorage.setItem("favLegislators", JSON.stringify($scope.$parent.favLegis));
        
    }
    
     $scope.removeFavBills = function(item){
        
                 $scope.$parent.bills.results.forEach(function(element){
                     
                     
                     if(element.bill_id == item.bill_id){
                         element.favflag = false;
                     
                     }
                 });
                 
                 for (var i = 0; i < $scope.$parent.favBill.length; i++) {
                if ($scope.$parent.favBill[i].bill_id == item.bill_id) {
                        $scope.$parent.favBill.splice(i, 1);
                        break;
                            }
                        }
                 
                
              localStorage.setItem("favBills", JSON.stringify($scope.$parent.favBill));
        
    }
    
    $scope.nextLegis = function(item){
        console.log('next-->');
       
      $('#legis-1').click();
        
        $rootScope.$emit('nextCarousel', item);
    }
 
    $scope.nextBill = function(item){
        console.log('next-->');
       
        $('#bill-1').click();
        
        $rootScope.$emit('nextBillCarousel', item);
    }
    
    
    
     $scope.removeFavComm = function(item){
        
                 $scope.$parent.committees.results.forEach(function(element){
                     
                     
                     if(element.committee_id == item.committee_id){
                         element.favflag = false;
                     
                     }
                 });
                 
                 for (var i = 0; i < $scope.$parent.favComm.length; i++) {
                if ($scope.$parent.favComm[i].committee_id == item.committee_id) {
                        $scope.$parent.favComm.splice(i, 1);
                        break;
                            }
                        }
                 
                
              localStorage.setItem("favCommittees", JSON.stringify($scope.$parent.favComm));
        
    }
    
    
});
