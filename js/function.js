$(document).ready(function(){
	var map;
    var service;
    var california,map; 
    var infoWindow = new google.maps.InfoWindow();
    var geocoder = new google.maps.Geocoder();
    var markers = [];
    var resultlist = [];
    var type = [];
	var checkboxval = "";
	var textSearchrequest;
	var marker;
	var bounds = new google.maps.LatLngBounds();

	init();
    
 // Function called on load of page.  
	function init(){
		california = new google.maps.LatLng(36.778261,-119.417932);
        var options = {
      		 center: california,
             mapTypeId: google.maps.MapTypeId.ROADMAP,
    		 zoom: 8,
    		 zoomControl: true,
    		 zoomControlOptions: {
        	 position: google.maps.ControlPosition.LEFT_TOP
             },
     		scaleControl: true,

      	};
      	var autocompleteoptions = {
			 types: ['(cities)']
	 	};
        map = new google.maps.Map(document.getElementById('map'), options);
        var input = $("#searchTextField")[0];
        var autocomplete = new google.maps.places.Autocomplete(input,autocompleteoptions);
	}

   //Sets the map center based on location
	function findLocation(placeId) {
		geocoder.geocode( { 'placeId': placeId}, function(results, status) {
    	      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(14);
      } 
    });
   }

    //Creates marker based on the location
    function createMarker(place) {
    	
    	//bounds.extend(place.geometry.location);
    	var placeLoc = place.geometry.location;
        //console.log(place.name);
   		 marker = new google.maps.Marker({
    		map: map,
    		position: placeLoc    		
  		});
        markers.push(marker);
        
	  google.maps.event.addListener(marker, 'click', function() {
	    infoWindow.setContent(place.name);
	    infoWindow.open(map, marker);
	  });
	}
    
    //Removes all the markers
    function removeMarker(){
    	    for(i=0; i<markers.length; i++){
            markers[i].setMap(null);
       }
    }

//Lists all the place details in div based on search criteria.
 function listPlaceDetails(place){
     var element = $(".placeDetails");

     var div = $('<div/>',{click : function(){
     	var placeLoc = place.geometry.location;
   		 marker = new google.maps.Marker({
    		map: map,
    		position: placeLoc    		
  		});
   		 markers.push(marker);
     	infoWindow.setContent(place.name);
	    infoWindow.open(map, marker);
     }}).addClass("divplaces");

     var pname = $('<p></p>').text(place.name);
     var paddress = ($('<p></p>').text(place.formatted_address));

     var $p = div.append(pname.append(paddress));
     element.append($p);
     var $hr = $('<hr>');   
     element.append($hr); 
 }
 

//Callback function called to store result set.
 function callback(results, status, pagination) {
    if(results != null){
    	resultlist.push(results);
    }
   	if (pagination.hasNextPage) {
            pagination.nextPage(function(data,status){
              if(data !=null){
              	resultlist.push(data);
              }
          });
       }
  	else{
  		if($('.placeDetails')){
  		$('.placeDetails').empty();
  	}
    	for(var page = 0;page < resultlist.length;page++)
 	      {	 
         for (var i = 0; i < resultlist[page].length; i++) {
         var place = resultlist[page][i]; 
         createMarker(place);
         listPlaceDetails(place);
        }
      }
      findLocation(resultlist[0][0].place_id);

 	 }
 }


// Google maps service called based on text entered in search box.
 function fetchResults(){

    resultlist = [];
 	var textvalue = $('#searchTextField').val();
    var city = textvalue.split(",")[0] + " ";
    var query = city.concat(type.join(" "));

  	textSearchrequest = {
  		location : california,
  		query : query,
  		radius : '1500' 		  		  		  		  		  		  		  		
  	};
  	removeMarker();
  	service = new google.maps.places.PlacesService(map);
  	service.textSearch(textSearchrequest,callback);
 }

//On keypress 

$("input").keypress(function(event){
  	resultlist = [];
  	var keyword = "";
  	if(event.which == 13)
  	{
      fetchResults();
    }
  });

 // Called when Click here button is clicked
 $("#getResults").click(function(){
 	fetchResults();
 });



 // When values of checkbox are selected 

   $('input[type=checkbox]').change(function() {
     checkboxval = $(this).val();

        if($(this).is(":checked")) {
            type.push(checkboxval);
        } 
        else{
        	index = type.indexOf(checkboxval);
        	if(index > -1){
        		type.splice(index,1);
        	}
        }      
    });

});


