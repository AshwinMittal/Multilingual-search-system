<?php include "header.php"; ?>        
        <div ng-controller="SearchCtrl">
            <div class="row" style="margin: 0;">
                <div class="col-lg-3"></div>
                <div class="col-lg-6" style="margin-top: 100px;text-align: center;">
                    <h1><img src="images/logo2.png" style="width: 60%;"/></h1>
                    <form role="form" name="search-form" ng-submit="search()" >
                        <div class="form-group input-group">
                            <input type="text" id="search_text" class="form-control" style="height: 50px;" placeholder="Are you...?">
                            <span class="input-group-btn">
                                <button class="btn btn-default" type="button" style="height: 50px;width: 50px;" ng-click="search()">
                                    <i class="fa fa-search"></i>
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
                <div class="col-lg-3"></div>
            </div>    
        </div>
<script>
$('#search_text').focus();
irapp.controller('SearchCtrl', function($scope, $http, $window){
    $scope.search = function(){    
        if($("#search_text").val()==""){
            $('#search_text').focus();
            }else{                
                $window.location.href = 'searchresults.php?q='+encodeURIComponent($("#search_text").val()); 
        }
    };
});
</script>
<?php include "footer.php"; ?>          
