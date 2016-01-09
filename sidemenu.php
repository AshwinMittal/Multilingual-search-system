        <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0" ng-controller="ResultsCtrl">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="index.php"><img src="images/logo_text.png" style="width: 300px;position: absolute;z-index: 1000;"/></a>
            </div>
            <!-- /.navbar-header -->
            <ul class="nav navbar-top-links navbar-right" ng-show="tweet.status">
                <li class="dropdown" title="See tweets on map" ng-hide="show_map"  ng-click="showmap()">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">
                        <i class="fa fa-globe fa-fw"></i>
                    </a>
                </li>
                <li class="dropdown" title="See tweets as grid" ng-show="show_map" style="margin-right: 0;"  ng-click="showmap()">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">
                        <i class="fa fa-tasks fa-fw"></i>
                    </a>
                </li>
                <li class="dropdown" title="Document Analysis on Language" style="margin-right: 0;"  ng-click="showchart()">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">
                        <i class="fa fa-bar-chart-o fa-fw"></i>
                    </a>
                </li>
            </ul>
            <div class="navbar-default sidebar" role="navigation">
                <div class="sidebar-nav navbar-collapse">
                    <ul class="nav" id="side-menu">
                        <li class="sidebar-search">
                            <form role="form" name="search-form" ng-submit="search('text-box')" >
                                <div class="input-group custom-search-form">
                                    <input type="text" id="search_text" class="form-control" placeholder="Search...">
                                    <span class="input-group-btn">
                                        <button class="btn btn-default" type="button" ng-click="search('text-box')">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </span>
                                </div>
                                <!-- /input-group -->
                            </form>                            
                        </li>
                        <li ng-show="tweet.status">
                            <a href="#"><i class="fa fa-language fa-fw"></i> Languages<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level">
                                <li ng-repeat="facet in tweet.facets_lang">
                                    <a href="javascript:void(0)" ng-click="filter('lang',facet.name)">{{facet.name}} ({{facet.count}})</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
                        <li ng-show="tweet.status">
                            <a href="#"><i class="fa fa-user fa-fw"></i> Users<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level">
                                <li ng-repeat="facet in tweet.facets_user">
                                    <a ng-repeat="(key, value) in facet" href="javascript:void(0)" ng-click="filter('UserName',key)">{{key}} ({{value}})</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
                        <li ng-show="tweet.status">
                            <a href="#"><i class="fa fa-tags fa-fw"></i> Tweet hashtags<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level">
                                <li ng-repeat="facet in tweet.facets_hashtags">
                                    <a ng-repeat="(key, value) in facet" href="javascript:void(0)" ng-click="filter('tweet_hashtags',key)">{{key}} ({{value}})</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
                        <li ng-show="tweet.status">
                            <a href="#"><i class="fa fa-globe fa-fw"></i> Location<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level">
                                <li ng-repeat="facet in tweet.facets_location">
                                    <a ng-repeat="(key, value) in facet" href="javascript:void(0)" ng-click="filter('location',key)">{{key}} ({{value}})</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
                    </ul>
                </div>
                <!-- /.sidebar-collapse -->
            </div>
            <!-- /.navbar-static-side -->
        </nav>
<script>
irapp.controller('SearchCtrl', function($scope, $http, $window){
    $scope.login_user = function(){
        
        if($("#search_text").val()==""){
            $('#search_text').focus();
            }else{
            $http.post('solarium/examples/2.1.1-query-params.php?q='+$("#search_text").val(), {cache: false})
              .success(function(data){
                if(data.status == "True"){
                    $window.location.href = 'home.php'; 
                }else{
                    $("#responsemsg").html(data.msg);
                }                        
              }); 
        }
    };
});
</script>
<?php include "footer.php"; ?>         