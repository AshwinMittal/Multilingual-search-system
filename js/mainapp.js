var wp = angular.module('WPApp', []);  
wp.controller('WPCtrl', function($scope, $http, $window) {
    
    $scope.check_session = function(user_type){
        if(user_type == 'BREEDER'){
            $http.post("api/auth.php", {cache: false})
              .success(function(session_check) {
        		if( (session_check.status == 'True') && (session_check.User_Type=='Breeder') ) {
        			$scope.logindone = true;
        			$scope.usertype = session_check.User_Type;			
        			$scope.profilepicture = session_check.ProfilePic;
        			$scope.username = session_check.Last_Name;
        			$scope.userid = session_check.User_ID;
                    $("#mainheader").css('display','block');
                    $("#mainbody").css('display','block');
                    $scope.showfooter=true;
        		} else {
        			$scope.logindone = false;
        			$window.location.href = "home.php";
        		}
        	});
        }else if(user_type == 'USER'){
            $http.post("api/auth.php", {cache: false})
              .success(function(session_check) {
        		if( (session_check.status == 'True') && (session_check.User_Type=='User') ) {
        			$scope.logindone = true;
        			$scope.usertype = session_check.User_Type;			
        			$scope.profilepicture = session_check.ProfilePic;
        			$scope.username = session_check.Last_Name;
        			$scope.userid = session_check.User_ID;
                    $("#mainheader").css('display','block');
                    $("#mainbody").css('display','block');
                    $scope.showfooter=true;
        		} else {
        			$scope.logindone = false;
        			$window.location.href = "home.php";
        		}
        	});
        }else if(user_type == 'USER_BREEDER'){
            $http.post("api/auth.php", {cache: false})
              .success(function(session_check) {
        		if( session_check.status == 'True' ) {
        			$scope.logindone = true;
        			$scope.usertype = session_check.User_Type;			
        			$scope.profilepicture = session_check.ProfilePic;
        			$scope.username = session_check.Last_Name;
        			$scope.userid = session_check.User_ID;
                    $("#mainheader").css('display','block');
                    $scope.showbody=true;
                    $("#mainbody").css('display','block');
                    $scope.showfooter=true;
        		} else {
        			$scope.logindone = false;
        			$window.location.href = "index.php";
        		}
        	});
        }else if(user_type == 'NOLOGIN'){
            $http.post("api/auth.php", {cache: false})
              .success(function(session_check) {
        		if(session_check.status == 'True') {
  		            $window.location.href = "home.php";                    
        		} else {
        			$scope.logindone = false;
                    $("#mainheader").css('display','block');
                    $("#mainbody").css('display','block');
                    $scope.showbody=true;
                    $scope.showfooter=true;
        		}
        	});
        }else if(user_type == 'COMMON'){
            $http.post("api/auth.php", {cache: false})
              .success(function(session_check) {
        		if(session_check.status == 'True') {
  		            $scope.logindone = true;
        			$scope.usertype = session_check.User_Type; 
                    $("#mainheader").css('display','block'); 
                    $scope.profilepicture = session_check.ProfilePic;
        			$scope.username = session_check.Last_Name;
        			$scope.userid = session_check.User_ID; 
                    $("#mainbody").css('display','block');
                    $scope.showbody = true; 
                    $scope.showfooter=true;               
        		} else {
        			$scope.logindone = false;
                    $("#mainheader").css('display','block');
                    $("#mainbody").css('display','block');
                    $scope.showbody=true;
                    $scope.showfooter=true;       			
        		}
                
        	});
        }
          
    };    
	$scope.range = function(min, max, step) {
		step = step || 1;
		var input = [];
		for (var i = min; i <= max; i += step)
		input.push(i);
		return input;
	};
});
   
wp.controller('NotificationCtrl', function($scope, $http, $window, $interval) {
	getcount();
	$interval(getcount, 60000);

	function getcount() {
		$http.post("api/new_rfq_notifications1.php", {cache: false })
            .success(function(resp1) {
			var not = 0;
			if (resp1.status == 'True') {
				if ($scope.usertype == 'Breeder') {				    
					not = (resp1.New_RFQ_Count + resp1.New_App_Count);
                    //console.log("breeder notifications : "+not);
					if (not != 0) {
					   $("#breeder_notificationcount").css('display','block');
                       $("#breeder_notificationcount").html(not);
					} else {
					   $("#breeder_notificationcount").css('display','none');
					}
				} else {
					not = resp1.New_Cashback_Count;
                    //console.log("user notifications : "+not);
					if (not != 0) {
					   $("#user_notificationcount").css('display','block');
                       $("#user_notificationcount").html(not);
					} else {
					   $("#user_notificationcount").css('display','none');
					}
				}
			}
		});
		$http.post("api/rfq_msg_notifications1.php", {
			cache: false
		}).success(function(resp2) {
		      var msg = 0;
			if (resp2.status == 'True') {
			     if ($scope.usertype == 'Breeder') {	
                    msg = (resp2.New_RFQ_Msg_Count + resp2.New_App_Msg_Count);
                    //console.log("breeder messages : "+msg);
                    if (msg != 0) {
                        $("#breeder_messagecount").css('display','block');
                        $("#breeder_messagecount").html(msg);
                    } else {
                        $("#breeder_messagecount").css('display','none');
                    }
			     }else{
			         msg = (resp2.New_RFQ_Msg_Count + resp2.New_App_Msg_Count);
                     //console.log("user messages : "+msg);
                        if (msg != 0) {
                            $("#user_messagecount").css('display','block');
                            $("#user_messagecount").html(msg);
                        } else {
                            $("#user_messagecount").css('display','none');
                        }
			     }
				
			} 
		});
	}
    $scope.notificationclick_breeder = function(ev) {
		ev.stopPropagation();
		ev.preventDefault();
        $('#breeder_messagebubble').hide();
        if($('#breeder_notificationbubble').css('display')=='none'){            
            $http.post("api/new_rfq_notifications1.php", {cache: false})
            .success(function(res) {
                $("#breeder_notificationcount").css('display','none');
    			if (res.status == 'True') {
    				for (var i = 0; i < (res.RFQ_Count + res.App_Count); i++) {
    					if (res.list[i].Notify_TID == 1 && res.list[i].is_Visited == 0) {
    						document.getElementById('breeder_notifications').innerHTML += "<div style=\"background-color: #AAAAAA;\"><a href=\"rfq_messages.php?RFQ_ID=" + res.list[i].RFQ_ID + " \" ><div style=\"height: 70px;width: 60px;text-align: center;\"><img src=\"" + res.list[i].ProfilePic + "\" style=\"max-width: 50px;max-height: 50px;margin-top:10px;\"/></div><div style=\"margin-left: 70px;height: 60px;margin-top: -60px;\">" + res.list[i].Notification_Message + "</div></a></div><hr />";
    					} else if (res.list[i].Notify_TID == 1 && res.list[i].is_Visited != 0) {
    						document.getElementById('breeder_notifications').innerHTML += "<div><a href=\"rfq_messages.php?RFQ_ID=" + res.list[i].RFQ_ID + " \" ><div style=\"height: 70px;width: 60px;text-align: center;\"><img src=\"" + res.list[i].ProfilePic + "\" style=\"max-width: 50px;max-height: 50px;margin-top:10px;\"/></div><div style=\"margin-left: 70px;height: 60px;margin-top: -60px;\">" + res.list[i].Notification_Message + "</div></a></div><hr />";
    					} else if (res.list[i].Notify_TID == 2 && res.list[i].is_Visited == 0) {
    						document.getElementById('breeder_notifications').innerHTML += "<div style=\"background-color: #AAAAAA;\"><a href=\"appt_messages.php?Appointment_ID=" + res.list[i].Appointment_ID + "\" ><div style=\"height: 70px;width: 60px;text-align: center;\"><img src=\"" + res.list[i].ProfilePic + "\" style=\"max-width: 50px;max-height: 50px;margin-top:10px;\"/></div><div style=\"margin-left: 70px;height: 60px;margin-top: -60px;\">" + res.list[i].Notification_Message + "</div></a></div><hr />";
    					} else if (res.list[i].Notify_TID == 2 && res.list[i].is_Visited != 0) {
    						document.getElementById('breeder_notifications').innerHTML += "<div><a href=\"appt_messages.php?Appointment_ID=" + res.list[i].Appointment_ID + "\" ><div style=\"height: 70px;width: 60px;text-align: center;\"><img src=\"" + res.list[i].ProfilePic + "\" style=\"max-width: 50px;max-height: 50px;margin-top:10px;\"/></div><div style=\"margin-left: 70px;height: 60px;margin-top: -60px;\">" + res.list[i].Notification_Message + "</div></a></div><hr />";
    					}
    				}
    			}
    		});
            $('#breeder_notificationbubble').show();
            //console.log("api/update_notify_count.php");
            $http.post("api/update_notify_count.php", {cache: false})
                .success(function(r3) {
                    //console.log(r3);
                });            
        }else{
            $('#breeder_notificationbubble').hide();
        }
    };
    
   	$scope.messageclick_breeder = function(ev) {
		ev.stopPropagation();
		ev.preventDefault();
        $('#breeder_notificationbubble').hide();
        if($('#breeder_messagebubble').css('display')=='none'){
            $http.post("api/rfq_msg_notifications1.php", { cache: false })
            .success(function(res) {
                $("#breeder_messagecount").css('display','none');
    			if (res.status == 'True') {
    				for (var i = 0; i < (res.Count_RFQ_Msg + res.Count_App_Msg); i++) {
    					if (res.list[i].Notify_TID == 3 && res.list[i].MsgRead_Time == 0) {
    						document.getElementById('breeder_messages').innerHTML += "<div style=\"background-color: #AAAAAA;\"><a href=\"rfq_messages.php?RFQ_ID=" + res.list[i].RFQ_ID + " \" ><div style=\"height: 70px;width: 60px;text-align: center;\"><img src=\"" + res.list[i].ProfilePic + "\" style=\"max-width: 50px;max-height: 50px;margin-top:10px;\"/></div><div style=\"margin-left: 70px;height: 60px;margin-top: -60px;\">" + res.list[i].Notification_Message + "</div></a></div><hr />";
    					} else if (res.list[i].Notify_TID == 3 && res.list[i].MsgRead_Time != 0) {
    						document.getElementById('breeder_messages').innerHTML += "<div><a href=\"rfq_messages.php?RFQ_ID=" + res.list[i].RFQ_ID + " \" ><div style=\"height: 70px;width: 60px;text-align: center;\"><img src=\"" + res.list[i].ProfilePic + "\" style=\"max-width: 50px;max-height: 50px;margin-top:10px;\"/></div><div style=\"margin-left: 70px;height: 60px;margin-top: -60px;\">" + res.list[i].Notification_Message + "</div></a></div><hr />";
    					} else if (res.list[i].Notify_TID == 4 && res.list[i].MsgRead_Time == 0) {
    						document.getElementById('breeder_messages').innerHTML += "<div style=\"background-color: #AAAAAA;\"><a href=\"appt_messages.php?Appointment_ID=" + res.list[i].Appointment_ID + "\" ><div style=\"height: 70px;width: 60px;text-align: center;\"><img src=\"" + res.list[i].ProfilePic + "\" style=\"max-width: 50px;max-height: 50px;margin-top:10px;\"/></div><div style=\"margin-left: 70px;height: 60px;margin-top: -60px;\">" + res.list[i].Notification_Message + "</div></a></div><hr />";
    					} else if (res.list[i].Notify_TID == 4 && res.list[i].MsgRead_Time != 0) {
    						document.getElementById('breeder_messages').innerHTML += "<div><a href=\"appt_messages.php?Appointment_ID=" + res.list[i].Appointment_ID + "\" ><div style=\"height: 70px;width: 60px;text-align: center;\"><img src=\"" + res.list[i].ProfilePic + "\" style=\"max-width: 50px;max-height: 50px;margin-top:10px;\"/></div><div style=\"margin-left: 70px;height: 60px;margin-top: -60px;\">" + res.list[i].Notification_Message + "</div></a></div><hr />";
    					}
    				}
    			}
    		});
            $('#breeder_messagebubble').show();
            //console.log("api/update_msg_count.php");
    		$http.post("api/update_msg_count.php", {cache: false})
            .success(function(r4) {
                //console.log(r4);
            });            
            
        }else{
            $('#breeder_messagebubble').hide();
        }
    };
    $scope.notificationclick_user = function(e) {
		e.stopPropagation();
		e.preventDefault();
		$('#user_messagebubble').hide();
        if($('#user_notificationbubble').css('display')=='none'){     
            $http.post("api/new_rfq_notifications1.php", {cache: false})
                .success(function(res) {
                    $("#user_notificationcount").css('display','none');    			
    			if (res.status == "True") {
    				for (var i = 0; i < res.Cashback_Count; i++) {
    					if (res.list.New_Cashback[i].is_Visited == 0) {
    						document.getElementById('user_notifications').innerHTML += "<div style=\"background-color: #AAAAAA;\"><a href=\"cashback.php\" ><div style=\"margin-left: 30px;height: 60px;margin-top: 5px;\">" + res.list.New_Cashback[i].Notification_Message + "</div></a></div><hr />";
    					} else if (res.list.New_Cashback[i].is_Visited != 0) {
    						document.getElementById('user_notifications').innerHTML += "<div><a href=\"cashback.php\" ><div style=\"margin-left: 30px;height: 60px;margin-top: 5px;\">" + res.list.New_Cashback[i].Notification_Message + "</div></a></div><hr />";
    					}
    				}
    			}
    		});
            $('#user_notificationbubble').show();
    		$http.post("api/update_notify_count.php", {
    			cache: false
    		}).success(function(r1) {});
        }else{
            $('#user_notificationbubble').hide();
        }		
	};
    $scope.messageclick_user = function(e) {
		e.stopPropagation();
		e.preventDefault();
        $('#user_notificationbubble').hide();
        if($('#user_messagebubble').css('display')=='none'){ 
            $http.post("api/rfq_msg_notifications1.php", {cache: false })
                .success(function(res) {
    			$("#user_messagecount").css('display','none');
    			if (res.status == 'True') {
    				for (var i = 0; i < (res.Count_RFQ_Msg + res.Count_App_Msg); i++) {
    					if (res.list[i].Notify_TID == 3 && res.list[i].MsgRead_Time == 0) {
    						document.getElementById('user_messages').innerHTML += "<div style=\"background-color: #AAAAAA;\"><a href=\"rfq_messages_user.php?RFQ_ID=" + res.list[i].RFQ_ID + "&RFQ_Msg_ID=" + res.list[i].RFQ_Msg_ID + " \" ><div style=\"height: 70px;width: 60px;text-align: center;\"><img src=\"" + res.list[i].ProfilePic + "\" style=\"max-width: 50px;max-height: 50px;margin-top:10px;\"/></div><div style=\"margin-left: 70px;height: 60px;margin-top: -60px;\">" + res.list[i].Notification_Message + "</div></a></div><hr />";
    					} else if (res.list[i].Notify_TID == 3 && res.list[i].MsgRead_Time != 0) {
    						document.getElementById('user_messages').innerHTML += "<div><a href=\"rfq_messages_user.php?RFQ_ID=" + res.list[i].RFQ_ID + "&RFQ_Msg_ID=" + res.list[i].RFQ_Msg_ID + " \" ><div style=\"height: 70px;width: 60px;text-align: center;\"><img src=\"" + res.list[i].ProfilePic + "\" style=\"max-width: 50px;max-height: 50px;margin-top:10px;\"/></div><div style=\"margin-left: 70px;height: 60px;margin-top: -60px;\">" + res.list[i].Notification_Message + "</div></a></div><hr />";
    					} else if (res.list[i].Notify_TID == 4 && res.list[i].MsgRead_Time == 0) {
    						document.getElementById('user_messages').innerHTML += "<div style=\"background-color: #AAAAAA;\"><a href=\"appt_messages_user.php?Appointment_ID=" + res.list[i].Appointment_ID + "\" ><div style=\"height: 70px;width: 60px;text-align: center;\"><img src=\"" + res.list[i].ProfilePic + "\" style=\"max-width: 50px;max-height: 50px;margin-top:10px;\"/></div><div style=\"margin-left: 70px;height: 60px;margin-top: -60px;\">" + res.list[i].Notification_Message + "</div></a></div><hr />";
    					} else if (res.list[i].Notify_TID == 4 && res.list[i].MsgRead_Time != 0) {
    						document.getElementById('user_messages').innerHTML += "<div><a href=\"appt_messages_user.php?Appointment_ID=" + res.list[i].Appointment_ID + "\" ><div style=\"height: 70px;width: 60px;text-align: center;\"><img src=\"" + res.list[i].ProfilePic + "\" style=\"max-width: 50px;max-height: 50px;margin-top:10px;\"/></div><div style=\"margin-left: 70px;height: 60px;margin-top: -60px;\">" + res.list[i].Notification_Message + "</div></a></div><hr />";
    					}
    				}
    			}
    		});
            $('#user_messagebubble').show();
            $http.post("api/update_msg_count.php", {
    			cache: false
    		}).success(function(r2) {});
        }else{
            $('#user_messagebubble').hide();
        }
	};
});




wp.controller('HomeCtrl', function($scope, $http, $window) {
    $scope.resetvalues = function(){
        console.log("Reset");
        $(".uid").val(""); 
        $scope.birthplace = "0";
        $scope.age = "0";
        $("input:radio[name='gender']").each(function(i) {
            this.checked = false;
        });
        $scope.ccolor = "0";
        $("input:checkbox[name='btype']").each(function(i) {
            this.checked = false;
        });
        $scope.dogweight="";
        $scope.dogheight = "";
        $scope.minprice = "";
        $scope.maxprice = "";
        $("input:radio[name='dm']").each(function(i) {
            this.checked = false;
        });
        $scope.rating = "0";
        $scope.service = "";
        $scope.breederplace = "0";
        $scope.award=false;
    };
    
    $scope.result_view = "grid_view";
    
    $scope.showingrid = function() {
		$scope.result_view = "grid_view";
	};
	$scope.showinlist = function() {
		$scope.result_view = "list_view";
	};
    
    
	$scope.showadv = true;
	$scope.loading = false;
	$scope.showingsearchresults = false;
	$scope.headermsg = "New Arrivals";
	$scope.loadingsearch = false;
	$scope.picturemode = true;
	$scope.resultshow = true;
	$scope.morevaluefound = false;
	$scope.loadingnextpage = false;
	$scope.sortoption = 'latest';
	$scope.birthplace = "0";
	$scope.age = "0";
	$scope.gendertype = "";
	$scope.ccolor = "0";
	$scope.dogweight = "";
	$scope.dogheight = "";
	$scope.minprice = "";
	$scope.maxprice = "";
	$scope.deliverytype = "";
	$scope.biogua = false;
	$scope.healthgua = false;
	$scope.vaccine = false;
	$scope.pedigree = false;
	$scope.algebric = false;
	$scope.award = false;
	$scope.breederplace = "0";
	$scope.rating = "0";
	$scope.service = "";
	var dogsarr = [],
		tempfavarr = [],
		isfav = [],
		pageID = 0,
		searchresults = 0,
		order = '',
		col = '';
	$http.post("api/city_list.php", {
		cache: false
	}).success(function(response) {
		$scope.birthplaces = response;
	});
	$http.post("api/master_coat_color.php", {
		cache: false
	}).success(function(response) {
		$scope.coatcolors = response;
	});
	getnewarrivals('Registered_On', 'desc');
	var algebri, biog, healthg, vacine, pedigri, searchcity, dogage, dogweight, dogheight, dogtype, birthplace, gendertype, ccolor, minprice, maxprice, breederplace, deliverytype, rate, history, bplace, award;
	$scope.searchdogs = function() {
		if (document.getElementById('minprice').value > document.getElementById('maxprice').value) {
			alert("Enter the correct Price range");
		} else {
			biog = '', healthg = '', vacine = '', pedigri = '', algebri = '', award = '';
			if (document.getElementById('birthplace').value == 0) {
				birthplace = '';
			} else {
				birthplace = document.getElementById('birthplace').value;
			}
			if (document.getElementById('ccolor').value == '0') {
				ccolor = '';
			} else {
				ccolor = document.getElementById('ccolor').value;
			}
			if (document.getElementById('age').value == 0) {
				dogage = '';
			} else {
				dogage = document.getElementById('age').value;
			}
			if (document.getElementById('gendermale').checked) {
				gendertype = 'Boy';
			} else if (document.getElementById('genderfemale').checked) {
				gendertype = 'Girl';
			} else {
				gendertype = '';
			}
			if (document.getElementById('dogweight').value == 0) {
				dogweight = '';
			} else {
				dogweight = document.getElementById('dogweight').value;
			}
			if (document.getElementById('dogheight').value == 0) {
				dogheight = '';
			} else {
				dogheight = document.getElementById('dogheight').value;
			}
			if (document.getElementById('persdelivery').checked) {
				deliverytype = 'Personal';
			} else if (document.getElementById('airdelivery').checked) {
				deliverytype = 'Airlift';
			} else if (document.getElementById('anydelivery').checked) {
				deliverytype = 'Any';
			} else {
				deliverytype = '';
			}
			if (document.getElementById('minprice').value == 0) {
				minprice = '';
			} else {
				minprice = document.getElementById('minprice').value;
			}
			if (document.getElementById('maxprice').value == 0) {
				maxprice = '';
			} else {
				maxprice = document.getElementById('maxprice').value;
			}
			if ($scope.biogua == true) {
				biog = "Yes";
			}
			if ($scope.healthgua == true) {
				healthg = "Yes";
			}
			if ($scope.vaccine == true) {
				vacine = "Yes";
			}
			if ($scope.pedigree == true) {
				pedigri = "Yes";
			}
			if ($scope.algebric == true) {
				algebri = "Yes";
			}
			if (document.getElementById('rating').value == 0) {
				rate = '';
			} else {
				rate = document.getElementById('rating').value;
			}
			if (document.getElementById('breederplace').value == 0) {
				breederplace = '';
			} else {
				breederplace = document.getElementById('breederplace').value;
			}
			if (document.getElementById('service').value == 0) {
				history = '';
			} else {
				history = document.getElementById('service').value;
			}
			if ($scope.award == true) {
				award = "Yes";
			}
			var temp1 = $('.uid').val();
            //alert($('.uid').val());
			if (temp1 != '') {
				var temp = temp1.split("|");
				var n = temp1.indexOf("|");
				dogtype = temp[0]; //.replace(/\s+/g, '');
				if (n > 0 || n == 0) {
					ccolor = temp[1]; //.replace(/\s+/g, '');
				}
			} else {
				dogtype = '';
			}
			$scope.headermsg = "Search Results";
			$scope.showingsearchresults = true;
			$scope.loadingsearch = true;
			$scope.loading = true;
			$scope.newarr = '';
			pageID = 0;
			order = '';
			col = '';
			getdogs(0);
			show_onmap();
		}
	}; //end of searchdogs function

	function getdogs(page) {
		dogsarr[page] = '';
		$scope.newarr = dogsarr;
		//console.log("search3.php==> Age="+dogage+" Dtype_ID="+dogtype+" DBP_ID="+birthplace+" Gender="+gendertype+" CColor="+ccolor+" Weight="+dogweight+" Height="+dogheight+" BioG="+biog+" HealthG="+healthg+" Min_Price="+minprice+" Max_Price="+maxprice+" BreederCity="+breederplace+" Delivery="+deliverytype+" Vaccine_Bill="+vacine+" Pedigpr="+pedigri+" Algebric_Dog="+algebri+" Rating="+rate+" BreederHistory="+history+" Award_Winning="+award+" pageID="+page+" column="+col+" order="+order);
		$http.post("api/search.php?Age=" + dogage + "&Dtype_ID=" + dogtype + "&DBP_ID=" + birthplace + "&Gender=" + gendertype + "&CColor=" + ccolor + "&Weight=" + dogweight + "&Height=" + dogheight + "&BioG=" + biog + "&HealthG=" + healthg + "&Min_Price=" + minprice + "&Max_Price=" + maxprice + "&Breeder_City=" + breederplace + "&Delivery=" + deliverytype + "&Vaccine_Bill=" + vacine + "&Pedigpr=" + pedigri + "&Algebric_Dog=" + algebri + "&Rating=" + rate + "&BreederHistory=" + history + "&Award_Winning=" + award + "&pageID=" + page + "&column=" + col + "&order=" + order, {
			cache: false
		}).success(function(response) {
			if (response.status == 'True') {
				$scope.resultshow = true;
				searchresults = 1;
				$scope.pn = page;
				$scope.totalsearchresults = response.list.count;
				dogsarr[page] = response;
				$scope.newarr = dogsarr;
				$scope.loadingsearch = false;
				$scope.loadingnextpage = false;
				for (var i = 0; i < response.list.pagecount; i++) {
					var tempdogid = response.list[i].Dog_ID;
					if (response.list[i].UserFav == 1) {
						tempfavarr[tempdogid] = "fav.png";
						isfav[tempdogid] = 1;
					} else {
						tempfavarr[tempdogid] = "notfav.png";
						isfav[tempdogid] = 0;
					}
				}
				$scope.favimage = tempfavarr;
				if (response.list.count > ((6 * page) + response.list.pagecount)) {
					$scope.morevaluefound = true;
				} else {
					$scope.morevaluefound = false;
				}
			} else {
				$scope.morevaluefound = false;
				$scope.resultshow = false;
				$scope.loadingsearch = false;
				$scope.totalsearchresults = 'No';
				dogsarr[page] = '';
				$scope.newarr = dogsarr;
			}
		});
	}

	function show_onmap() {
		
		$http.post("api/search_map.php?Age=" + dogage + "&Dtype_ID=" + dogtype + "&DBP_ID=" + birthplace + "&Gender=" + gendertype + "&CColor=" + ccolor + "&Weight=" + dogweight + "&Height=" + dogheight + "&BioG=" + biog + "&HealthG=" + healthg + "&Min_Price=" + minprice + "&Max_Price=" + maxprice + "&Breeder_City=" + breederplace + "&Delivery=" + deliverytype + "&Vaccine_Bill=" + vacine + "&Pedigpr=" + pedigri + "&Algebric_Dog=" + algebri + "&Award_Winning=" + award, {
			cache: false
		}).success(function(response) {
		  if(response.status=='True'){
            $scope.showadv = false;
			var res = response;
			var Japan = new google.maps.LatLng(37.4900318, 136.4664008);
			var totalMarkers;
			var loaded = 0;
			var mapOptions = {
				zoom: 19,
				scrollwheel: false,
				center: Japan,
				disableDefaultUI: true,
				panControl: true,
				zoomControl: true
			};
			map = new google.maps.Map(document.getElementById('google_map'), mapOptions);
			google.maps.event.addListener(map, 'bounds_changed', function() {
				if (totalMarkers == 1 && loaded == 0) {
					map.setZoom(16);
					loaded++;
				}
			});
			var markersArray = new Array();
			var marker;
			var latlngbounds = new google.maps.LatLngBounds;
			totalMarkers = res.list.count;
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
				var imageURL = res.list[i].Thumb_Path;
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
						var Big_thumb_Path = res.list[i].Image_Path;
						var contentString = '<div style="background:#FFFFFF;width:100%;max-height: 320px;overflow-y: auto;"><table style="background:#FFFFFF;width:93%;"><tr><td colspan="2" style="text-align:center;font-size:10px;color:#000;padding-left:10px;padding-top:10px;"><a href="dog.php?id=' + res.list[i].Dog_ID + '" target="_blank"><img src="' + Big_thumb_Path + '" style="max-height: 80px;max-width: 120px;"></a></td></tr><tr><td  style="text-align:center;font-size:12px;color:#000000;padding-top:3px;">' + res.list[i].Breed_Name + '<br />' + res.list[i].DOB + ' ' + res.list[i].Gender + '<br /><span style="color:red;font-size:11px;font-weight:bold;">&yen; ' + res.list[i].Price + '</span></td></tr></table><br/>';
						var currentLat = res.list[i].Lat;
						var currentLon = res.list[i].Lng;
						var foundMoreThanOneAtSameSpot = 0;
						var contentString1 = "<table style='margin: 10px 0px 10px 10px;width: 90%;'>";
						for (var g = 0; g < totalMarkers; g++) {
							if (g != i) {
								if ((currentLat == res.list[g].Lat) && (currentLon == res.list[g].Lng)) {
									contentString1 = contentString1 + '<tr><td style="width: 25%;text-align: center;"><a href="dog.php?id=' + res.list[g].Dog_ID + '" target="_blank"><img src="' + res.list[g].Image_Path + '" style="max-height: 30px;max-width: 45px;" ></a></td><td style="text-align: left;width: 70%;position:relative;top:-21px;">' + res.list[g].Breed_Name + '<br />' + res.list[g].Gender + '<br /><span style="color:red;font-size:11px;font-weight:bold;">&yen; ' + res.list[g].Price + '</span></td></tr>';
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
					minZoom: 5,
					maxZoom: 9
				});
			} else if (totalMarkers == 1) {
				map.panTo(otherLatlng);
				map.setOptions({
					minZoom: 5,
					maxZoom: 9
				});
			} else {
				map.setCenter(Japan);
				map.setZoom(6);
				map.setOptions({
					minZoom: 5,
					maxZoom: 9
				});
			}
          }
		});
	}

	function getnewarrivals(cols, orders) {
		$scope.loading = false;
		dogsarr = [];
		tempfavarr = [];
		isfav = [];
		$scope.pn = 0;
		$scope.morevaluefound = false;
		$scope.showingsearchresults = false;
		searchresults = 0;
		$http.post("api/latest_dogs.php?column=" + cols + "&order=" + orders, {
			cache: false
		}).success(function(response) {
			if (response.status == 'True') {
				dogsarr[0] = response;
				$scope.newarr = dogsarr;
				for (var i = 0; i < response.list.pagecount; i++) {
					var tempdogid = response.list[i].Dog_ID;
					if (response.list[i].UserFav == 1) {
						tempfavarr[tempdogid] = "fav.png";
						isfav[tempdogid] = 1;
					} else {
						tempfavarr[tempdogid] = "notfav.png";
						isfav[tempdogid] = 0;
					}
				}
				$scope.favimage = tempfavarr;
			} else {
				$scope.headermsg = "No New Arrivals found";
			}
		});
	}
	
	$scope.seemoreresult = function() {
		$scope.loadingnextpage = true;
		pageID++;
		getdogs(pageID);
	};
	
	$scope.sortresult = function() {
		if (searchresults == 0) {
			var opt = document.getElementById('sortoption').value;
			$scope.headermsg = "Ordered Results";
			if (opt == 'older') {
				getnewarrivals('Registered_On', 'asc');
			} else if (opt == 'lowprice') {
				getnewarrivals('Price', 'asc');
			} else if (opt == 'highprice') {
				getnewarrivals('Price', 'desc');
			} else if (opt == 'younger') {
				getnewarrivals('DOB', 'desc');
			} else if (opt == 'elder') {
				getnewarrivals('DOB', 'asc');
			} else {
				getnewarrivals('Registered_On', 'desc');
			}
		} else {
			var opt1 = document.getElementById('sortoption').value;
			if (opt1 == 'older') {
				col = 'Registered_On';
				order = 'asc';
			} else if (opt1 == 'lowprice') {
				col = 'Price';
				order = 'asc';
			} else if (opt1 == 'highprice') {
				col = 'Price';
				order = 'desc';
			} else if (opt1 == 'younger') {
				col = 'DOB';
				order = 'desc';
			} else if (opt1 == 'elder') {
				col = 'DOB';
				order = 'asc';
			} else {
				col = 'Registered_On';
				order = 'desc';
			}
			$scope.headermsg = "Search Results";
			pageID = 0;
			getdogs(pageID);
		}
	};
	$scope.addtofav = function(dogidd) {
		if (isfav[dogidd] == 0) {
			$http.post("api/user_favorite.php?Dog_ID=" + dogidd + "&fav=1", {
				cache: false
			}).success(function(data) {
				if (data.status == 'True') {
					tempfavarr[dogidd] = "fav.png";
					isfav[dogidd] = 1;
				} else {
					alert("Something went wrong");
				}
				$scope.favimage = tempfavarr;
			});
		} else {
			$http.post("api/user_favorite.php?Dog_ID=" + dogidd + "&fav=0", {
				cache: false
			}).success(function(data) {
				if (data.status == 'True') {
					tempfavarr[dogidd] = "notfav.png";
					isfav[dogidd] = 0;
				} else {
					alert("Something went wrong");
				}
				$scope.favimage = tempfavarr;
			});
		}
	};
	//$scope.range = function(min, max, step){
	//        step = step || 1;
	//        var input = [];
	//        for (var i = min; i <= max; i += step) 
	//        input.push(i);
	//        return input;
	//    };
});
wp.directive('panClouds', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			//console.log("pan");
			$(element).pan(scope.$eval(attrs.panClouds));
		}
	}
});
wp.directive('menuTip', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			//console.log("slicknav");
			$(element).slicknav(scope.$eval(attrs.menuTip));
		}
	};
});
$(document).click(function() {
    
    if($('#breeder_notificationbubble').css('display')=='block'){
        $('#breeder_notificationbubble').css('display','none');
    }
    if($('#breeder_messagebubble').css('display')=='block'){
        $('#breeder_messagebubble').css('display','none');
    }
    if($('#user_notificationbubble').css('display')=='block'){
        $('#user_notificationbubble').css('display','none');
    }
    if($('#user_messagebubble').css('display')=='block'){
        $('#user_messagebubble').css('display','none');
    }
    
});


function autofilldog() {
	var dogcolortext = [];
	$.ajax({
		url: "api/ajax_search_breed.php?search_text="+$('.uid').val(),
		type: "POST",
		success: function(response) {
			var res9 = $.parseJSON(response);
			if (res9.status == 'True') {
				for (var i = 0; i < res9.list.pagecount; i++) {  
					var nam = res9.list[i].Breed_Name + "|" + res9.list[i].Coat_Color;
                    //var val = res9.list[i].Breed_ID + "|" +res9.list[i].Coat_Color_ID;
					dogcolortext.push(nam);//{ "value": val, "label": nam});
				}
                $(".uid").autocomplete({                    
                    source: dogcolortext,
                    focus: function( event, ui ) {
                       $( ".uid" ).val( ui.item.value );
                       },
                    select: function( event, ui ) {                        
                       $( ".uid" ).val( ui.item.value );
                       //console.log('You selected: ' + ui.item.value);
                    }                    
            	});
			}
		}
	});
}

function only_num(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}

$(document).ready(function() {
});


