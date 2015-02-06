var PartyUp = PartyUp || (function() {

  var file;
  var bestMapsResult;



  var appConfig = {
    parseAppId : "5sjv0ulSUoP2jMeLfvblBcfWhAkhQ76bDwRVxnh6",
    parseRestApiKey : "497ZfHyTwSgrhbnaYSCZiOrS8p3k0HpvtIRrKyXM",
    parseJsApiKey : "tLOzhEPIJpzTvtQ0SszzwLv1lFC8nsucaePUc7YO",
    mapsKey : "AIzaSyCjjqEvLoZDIFjlE6CL2z2yTsFYkwfdvKs",
    initParseSdk : function(){
      if(!Parse.applicationId)
        Parse.initialize(this.parseAppId,this.parseJsApiKey);
    }
  };


  var eventBindings = {

    bindSearchAddress : function(){
      $('#search-button').click(function(){
        var search = $('#search-text').val();
        actions.searchInMaps(search);
      });
    },
    bindPlaceImageOnFocusEvent : function () {
      $('#place-image').focus(function(){
        $('#select-file').click();
        this.blur();
      });
    },
    bindSelectPlaceImageFileChangeEvent : function () {
      $('#select-file').bind("change", function(f) {
        var file = UIUtils.fetchFileFromInput('#select-file');
        if(file && Utils.isValidImage(file)){
          $("#place-image").val(file.name);
        }else{
          $("#place-image").val("");
        }
      });
    },

    bindUploadPlaceImageButtonEvent : function () {
      $('#upload-place-img-btn').click(function(){
         var file = UIUtils.fetchFileFromInput('#select-file');
         if(file){
           actions.createPlace(file);
         }
      });
    },

    bindRequestFocusOnDatepicker : function(){
      $('#datepicker').focus(function(){
        $('#datepicker').fdatepicker('show');
      });
    },

    bindChangePartyTypeEvent : function () {
      $('#select-party-list-type').bind("change",function(f){
        var option = $('#select-party-list-type').val();

        if(option == "facebook"){
          $("#facebook-event-id").parent().removeClass("hide");
          $("#event-email").parent().addClass("hide");
        }else if(option == "email"){
          $("#event-email").parent().removeClass("hide");
          $("#facebook-event-id").parent().addClass("hide");
        }
      });
    },

    bindSelectFileEvent : function () {
      $('#select-file').bind("change", function(f) {
        // var file = UIUtils.fetchFileFromInput('#select-file');
        // $("#place-image").val(file.name);
      });
    },

    bindSavePartyEvent : function(){
      $('#save-button').click(function() {
        actions.postParty();
      });
    },

    attachEvents : function () {
      $.each(eventBindings, function(k,m){
        if(Utils.hasIn("bind",k))
          eventBindings[k]();
      });
    }

  };
  var Utils = {
    isValidImage : function(file){
       var valid = (Utils.hasIn(".png",file.name)|| Utils.hasIn(".jpeg",file.name))
       return valid ? true : false;
    },
    hasIn : function(text,string){
      return string.indexOf(text) > -1;
    },
    addressFromMapsObj : function(mapsObj){
      var address = {};
      var cpms = mapsObj.address_components;
      for (var i=0;i<cpms.length;i++) {

        var el = cpms[i];
        var types = el.types;

        for (var j=0;j<types.length;j++) {

          var value = types[j];

          if(Utils.hasIn("street_number",value)){
            address["number"] = el.long_name;
            continue;
          }

          if(Utils.hasIn("route",value)){
            address["street"] = el.long_name;
            continue;
          }

          if(Utils.hasIn("neighborhood",value)){
             address["neighborhood"] = el.long_name;
             continue;
          }
          if(Utils.hasIn("locality",value)){
            address["city"] = el.long_name;
            continue;
          }
          if(Utils.hasIn("administrative_area_level_1",value)){
            address["state"] = el.long_name;
            continue;
          }
          if(Utils.hasIn("country",value)){
            address["country"] = el.long_name;
            continue;
          }
          if(Utils.hasIn("postal_code",value)){
            address["postal_code"] = el.long_name;
            continue;
          }


        }
      }

      return address;
    },
  };
  var UIUtils = {
    toggleBounceAnimation : function(elId,turnOn){

      if(turnOn){
        $(elId).removeClass("hide");
        $(elId).removeClass('animated bounceOutUp');
        $(elId).addClass('animated bounceInDown');
      }else{
        $(elId).removeClass('animated bounceInDown');
        $(elId).addClass('animated bounceOutUp');
        $(elId).addClass('hide');
      }
    },

    fetchFileFromInput : function(input){
      var fileUploadControl = $(input)[0];
      var hasFiles = fileUploadControl.files.length > 0;
      return hasFiles ? fileUploadControl.files[0] : null;
    },

    updateProgressBar : function(evt){
      var percentComplete = Math.round((evt.loaded / evt.total)* 100);
      var status = "" + percentComplete + "%";
      $("#progressbar-meter").animate({width:status});
    },

    updateMaps : function(lat,lng){
      var myLatlng = new google.maps.LatLng(lat,lng);
      var mapOptions = {
        center: myLatlng,
        zoom: 16
      };
      var map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);

      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title:"Lugar"
      });
    }


  };

  var actions = {

    createCORSRequest : function(method, url) {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        xhr = null;
      }
      return xhr;
    },

    uploadFile : function(){

    },

    searchInMaps : function(search){
       search = search.replace(/\s/g, "+");
       var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+search+"&key="+appConfig.mapsKey;

       var xhr = actions.createCORSRequest('GET', url);
       if (!xhr) {
         alert('CORS not supported');
         return;
       }

       // Response handlers.
       xhr.onload = function() {
         var text = xhr.responseText;
         var obj = jQuery.parseJSON(text);
         bestMapsResult = obj.results[0];
         var location = bestMapsResult.geometry.location;
         UIUtils.updateMaps(location.lat,location.lng);
       };

       xhr.onerror = function() {
         alert('Woops, there was an error making the request.');
       };

       xhr.send();

    },
    createPlace : function(imageFile){
      appConfig.initParseSdk();

      var parseFile = new Parse.File(imageFile.name, imageFile);

      var location = bestMapsResult.geometry.location;
      var point = new Parse.GeoPoint({latitude: location.lat, longitude: location.lng});

      var address = Utils.addressFromMapsObj(bestMapsResult);

      var name = $("#place-name").val();
      var complement = $("#place-complement").val();

      var Place = Parse.Object.extend("Place");
      var place = new Place();
      place.set("image", parseFile);

      place.set("name", name);
      place.set("canonicalName", name.toUpperCase());
      place.set("description", "");

      place.set("street", address.street);
      place.set("number", address.number);
      place.set("neighborhood", address.neighborhood);
      place.set("city", address.city);
      place.set("canonicalCity", address.city.toUpperCase());
      place.set("state", address.state);
      place.set("country", address.country);


      place.set("complement", complement);
      place.set("location", point);




      place.save(null, {
       success: function(place) {
         window.location.replace("https://www.partyup.parseapp.com/parties");
       },
       error: function(place, error) {
         alert('Failed to create new object, with error code: ' + error.message);
       }
      });
    },

    postParty : function(){
      var inputs = ["name","datepicker","description","select-place",
      "facebook-event-id","event-email","male-price","female-price"];
      var keys = ["name","date","description","placeId","facebookId",
      "eventEmail","malePrice","femalePrice"];
      var params = {};
      $.each(inputs, function(i,v){
        params[keys[i]] = $("#"+v).val();
      });


      $.ajax({
        type: "POST",
        url: "http://partyup.parseapp.com/parties",
        data: params,
        contentType: "application/json",
        success: function(data) {
          alert("sucesso : " +data);
        },
        error: function(data) {
          alert("error : " +data);
        }
      });

    }
  };


  return {
    attachEvents : eventBindings.attachEvents
  };
})();

$(document).ready(function() {
  PartyUp.attachEvents();
});
