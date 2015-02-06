var PartyUp = PartyUp || (function() {

  var file;
  var place;


  var appConfig = {
    parseAppId : "5sjv0ulSUoP2jMeLfvblBcfWhAkhQ76bDwRVxnh6",
    parseRestApiKey : "497ZfHyTwSgrhbnaYSCZiOrS8p3k0HpvtIRrKyXM",
    parseJsApiKey : "tLOzhEPIJpzTvtQ0SszzwLv1lFC8nsucaePUc7YO",
    mapsKey : "AIzaSyCjjqEvLoZDIFjlE6CL2z2yTsFYkwfdvKs"

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
        if(file){
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

         }
          // var name = "photo.jpg";
          // alert(file.name);

          // var parseFile = new Parse.File(name, file);
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
        if(k.indexOf("bind") > -1)
          eventBindings[k]();
      });
    }

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
      var serverUrl = 'https://api.parse.com/1/files/' + file.name;
      $.ajax({
        xhr: function() {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress", function(evt) {
            if (evt.lengthComputable) {
              updateProgressBar(evt);
            }
          }, false);
          return xhr;
        },
        type: "POST",
        beforeSend: function(request) {
          request.setRequestHeader("X-Parse-Application-Id", '5sjv0ulSUoP2jMeLfvblBcfWhAkhQ76bDwRVxnh6');
          request.setRequestHeader("X-Parse-REST-API-Key", '497ZfHyTwSgrhbnaYSCZiOrS8p3k0HpvtIRrKyXM');
          request.setRequestHeader("Content-Type", file.type);
          UIUtils.toggleBounceAnimation("#progressbar-container",true);
        },
        url: serverUrl,
        data: file,
        processData: false,
        contentType: false,
        success: function(data) {
          UIUtils.toggleBounceAnimation("#progressbar-container",false);
          actions.postParty(file);
        },
        error: function(data) {
          var obj = jQuery.parseJSON(data);
          alert(obj.error);
        }
      });

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
         var location = obj.results[0].geometry.location;
         UIUtils.updateMaps(location.lat,location.lng);
       };

       xhr.onerror = function() {
         alert('Woops, there was an error making the request.');
       };

       xhr.send();

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
