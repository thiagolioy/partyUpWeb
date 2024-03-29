module.exports = {

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

  fetchFileFromInput : function(input,isNeeded){
    var fileUploadControl = $(input)[0];
    var hasFiles = true;

    if(isNeeded){
      hasFiles = fileUploadControl.files.length > 0;
    }

    return hasFiles ? fileUploadControl.files[0] : null;
  },

  updateProgressBar : function(evt){
    var percentComplete = Math.round((evt.loaded / evt.total)* 100);
    var status = "" + percentComplete + "%";
    $("#progressbar-meter").animate({width:status});
  },

  disablePlaceButtons : function(should){
    $("#create-place-btn").prop('disabled', should);
  },

  disablePartyButtons : function(should){
    $("#update-party-btn").prop('disabled', should);
    $("#create-party-btn").prop('disabled', should);
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

}
