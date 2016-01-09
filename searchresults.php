<?php include "header.php"; ?>        
        <div id="page-wrapper" ng-controller="ResultsCtrl">
            <div class="row">
                <div class="col-lg-12">
                    <h3 class="page-header">{{search_text}}</h3>
                </div>
                <div class="col-lg-12" style="text-align: right;" ng-if="tweet.msg=='success'">
                    <span class="fa fa-arrow-up fa-fw" style="color: blue;margin-right:40px;" title="Positive">{{tweet.positive}}</span>
                    <span class="fa fa-arrow-down fa-fw" style="color: red;margin-right:40px;" title="Negative">{{tweet.negative}}</span>
                    <span style="color: grey;" title="Neutral">{{tweet.neutral}}</span>
                </div>
                <!-- /.col-lg-12 -->
            </div>
            <!-- /.row -->
            <div class="row" ng-if="tweet.msg=='success'" style="margin-bottom: 20px;"><div class="col-lg-12" >About {{tweet.tweetcount}} results</div></div>
            <div class="row" ng-show="loading">
                <div class="col-lg-12" style="text-align: center; margin-top: 100px; opacity:0.8">
                    <img src="images/82.GIF"/>
                </div>
            </div>
            <div class="row" id="result_div">
                <div class="col-lg-12" ng-repeat="i in tweet.list">
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            {{i.UserName}}
                            <span style="float: right;font-size: 10px;font-style: italic;">{{i.created_at.split('T')[0]}} {{i.created_at.split('T')[1].split(':')[0]}}:{{i.created_at.split('T')[1].split(':')[1]}}</span>
                        </div>
                        <div class="panel-body">
                            <p ng-if="i.lang=='en'">{{i.text_en}}</p>
                            <p ng-if="i.lang=='de'">{{i.text_de}}</p>
                            <p ng-if="i.lang=='ru'">{{i.text_ru}}</p>
                            <p ng-if="i.lang=='fr'">{{i.text_fr}}</p>
                        </div>
                        <div class="panel-footer">
                            <div><a href="javascript:void(0)" style="margin-right: 10px;" ng-if="i.tweet_hashtags" ng-repeat="j in i.tweet_hashtags" ng-click="search(j,2)">#{{j}}</a></div>
                            <div><a href="javascript:void(0)" style="margin-right: 10px;" ng-if="i.tags" ng-repeat="j in i.tags" ng-click="search(j,3)">{{j}}</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" id="chart_div" style="display: none;">
                <div class="col-lg-12" id="container" style="min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto"></div>
            </div>
            <div class="row" id="map_div" style="display: none;">
                <div class="col-lg-12" id="google_map" style="height: 500px;"></div>
            </div>
        </div>
<script>
irapp.controller('ResultsCtrl', function($scope, $http, $window){
	var Center = new google.maps.LatLng(0.0, 0.0);
	var totalMarkers;
	var loaded = 0;
    var map;        
    $scope.loading = true;
    $scope.show_map = false;
    $scope.show_chart = false;
    var fq = '';
    var fqval = '';
    var search_text = getUrlVars()["q"];    
    <?php if(isset($_REQUEST['fq'])){ ?>
        var fq = getUrlVars()["fq"]; 
        var fqval = getUrlVars()["fqval"];         
    <?php } ?>    
    
    $scope.search_text = decodeURIComponent(search_text);
    $scope.search = function(param1, param2){
        //console.log(search_text);
        if($("#search_text").val()=="" && param1=="text-box"){
            $('#search_text').focus();
        }else{  
            var link = 'solarium/examples/api_solarium.php?q='+search_text;
            if(param2==2){
                $window.location.href = 'searchresults.php?q='+encodeURIComponent("#"+param1); 
            } 
            if(param2==3){
                $window.location.href = 'searchresults.php?q='+encodeURIComponent(param1); 
            }           
            if(param1=='text-box' && $("#search_text").val()!=""){
                $window.location.href = 'searchresults.php?q='+encodeURIComponent($("#search_text").val()); 
            }  
            if(fq!=''){
                link = 'solarium/examples/api_solarium.php?q='+search_text+'&fq='+fq+'&fqval='+encodeURIComponent(fqval);
            } 
            console.log(link); 
            //console.log('solarium/examples/2.1.1-query-params.php?q='+search_text);
            $http.post(link, {cache: false})
              .success(function(data){
                //console.log(data);
                if(data.msg == "success"){
                    //console.log(data);
                    $scope.tweet = data;
                    $scope.loading = false;
                    $scope.makechart(data);
                    //show_onmap(data);
                }else{
                    //$("#responsemsg").html(data.msg);
                }                        
            }); 
        }
    };
    $scope.search(search_text, 1);
    $scope.filter = function(field, value){
        <?php if(isset($_REQUEST['fq'])){ ?>
            fq += '~'+field; 
            fqval += '~'+value; 
            field = fq; value = fqval;            
        <?php } ?>
        $window.location.href = 'searchresults.php?q='+search_text+'&fq='+field+'&fqval='+value; 
    }; 
    
    $scope.makechart = function(tweets_data){
        $('#container').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Tweet distribution based on Languages'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Percentage Tweets',
                colorByPoint: true,
                data: (function() {
                    // generate an array of random data
                    var data = [],i;
                    for (i = 0; i < tweets_data.facets_lang.length; i++) {
                        data.push({
                            name: tweets_data.facets_lang[i]["name"],
                            y: parseFloat(tweets_data.facets_lang[i]["percentage"])
                        });
                    }
                    return data;
                })()
            }]
        });
    };    
    $scope.showmap = function(){
        $("#result_div").css("display", "none");
        if($('#map_div').css('display') == 'none'){
            $("#result_div").css("display", "none");
            $("#map_div").css("display", "block");            
        }else{
            $("#result_div").css("display", "block");
            $("#map_div").css("display", "none");   
        }
        /*
        if($scope.show_map==false){
            $scope.show_map = true;
            //show_onmap(data);
        }else{
            $scope.show_map = false;
        } */
    };  
    
    $scope.showchart = function(){
        $("#map_div").css("display", "none");   
        if($('#chart_div').css('display') == 'none'){
            $("#result_div").css("display", "none");
            $("#chart_div").css("display", "block");            
        }else{
            $("#result_div").css("display", "block");
            $("#chart_div").css("display", "none");   
        }
    };  
    
    $scope.show_onmap = function(data){   
        var res = data;
		var markersArray = new Array();
		var marker;
		var latlngbounds = new google.maps.LatLngBounds;
		totalMarkers = res.tweetcount;
		for (var i = 0; i < totalMarkers; i++) {
			var contentString = "";
			var myOptions = {
				content: contentString,
				disableAutoPan: false,
				alignBottom: true,
				maxWidth: 0,
				pixelOffset: new google.maps.Size(-70, -20),
				zIndex: null,
				boxStyle: {
					background: "#FFFFFF",
					width: "265px",
					height: "auto"
				},
				closeBoxMargin: "10px 2px 2px 2px",
				closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
				infoBoxClearance: new google.maps.Size(1, 1),
				isHidden: false,
				pane: "floatPane",
				enableEventPropagation: false,
				disableAutoPan: true
			};
			otherLatlng = new google.maps.LatLng(res.list[i].Lat, res.list[i].Lng);
			var imageURL = "images/map-icon.png";
			var image = {
				url: imageURL,
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(5, 5.5)
			};
			marker = new google.maps.Marker({
				position: otherLatlng,
				map: map,
				zIndex: 20,
				icon: image,
				title: "Click for info",
			});
			latlngbounds.extend(otherLatlng);
			var ib = new InfoBox(myOptions);
			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
				    var lang = res.list[i].lang;
				    var text = res.list[i].text_+lang; 
					//var Big_thumb_Path = res.list[i].Image_Path;
					var contentString = '<div style="background:#FFFFFF;width:100%;max-height: 320px;overflow-y: auto;"><table style="background:#FFFFFF;width:93%;"><tr><td colspan="2" style="text-align:center;font-size:10px;color:#000;padding-left:10px;padding-top:10px;">' + text + '</td></tr><tr><td  style="text-align:center;font-size:12px;color:#000000;padding-top:3px;">' + res.list[i].text + '<br /><span style="color:red;font-size:11px;font-weight:bold;">&yen; ' + res.list[i].Price + '</span></td></tr></table><br/>';
					var currentLat = res.list[i].Lat;
					var currentLon = res.list[i].Lng;
					var foundMoreThanOneAtSameSpot = 0;
					var contentString1 = "<table style='margin: 10px 0px 10px 10px;width: 90%;'>";
					for (var g = 0; g < totalMarkers; g++) {
						if (g != i) {
							if ((currentLat == res.list[g].Lat) && (currentLon == res.list[g].Lng)) {
								contentString1 = contentString1 + '<tr><td style="text-align: left;width: 70%;position:relative;top:-21px;">' + res.list[g].text + '<br /></td></tr>';
								foundMoreThanOneAtSameSpot++;
							}
						}
					}
					if (foundMoreThanOneAtSameSpot > 0) {
						contentString = contentString + '<table style="text-align: center;"><tr><td style="padding-top:4px;padding-left:10px;font-size:12px;margin-bottom:10px;"><b>More Dogs Found</b></td></tr></table>' + contentString1;
					}
					contentString = contentString + '</table></div><table class="table_tooltip"><tr><td></td></tr></table>';
					ib.close();
					ib.setContent(contentString);
					ib.open(map, marker);
				}
			})(marker, i));
			markersArray.push(marker);
		}
		if (totalMarkers > 1) {
			map.fitBounds(latlngbounds);
			map.setOptions({
				minZoom: 2,
				maxZoom: 9
			});
		} else if (totalMarkers == 1) {
			map.panTo(otherLatlng);
			map.setOptions({
				minZoom: 2,
				maxZoom: 9
			});
		} else {
			map.setCenter(Center);
			map.setZoom(6);
			map.setOptions({
				minZoom: 2,
				maxZoom: 9
			});
		}   
    };                 
function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++){
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
} 
function initmap(){
    var mapOptions = {
		zoom: 3,
		scrollwheel: false,
		center: Center,
		disableDefaultUI: true,
		panControl: true,
		zoomControl: true
	};
	map = new google.maps.Map(document.getElementById('google_map'), mapOptions);
} 
initmap();  
});
</script>
<?php include "footer.php"; ?> 