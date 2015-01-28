var PartyUp = PartyUp || (function() {
  var file;
  var place;

  var bindUploadButtonEvent = function () {
    $('#upload-button').click(function(){
      $('#select-file').click();
    });
  };

  var bindRequestFocusOnDatepicker = function(){
    $('#datepicker').focus(function(){
      $('#datepicker').fdatepicker('show');
    });
  };

  var bindChangePartyTypeEvent = function () {
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
  };

  var bindSelectFileEvent = function () {
    $('#select-file').bind("change", function(f) {
      var files = f.target.files || f.dataTransfer.files;
      var name = files[0].name.toLowerCase();
      var contains = (name.indexOf(".png") > -1 || name.indexOf(".jpg") > -1 || name.indexOf(".jpeg") > -1);

      if(contains){
        file = files[0];
        $("#filename").val(file.name);
      }else{

      }
    });
  };

  var toggleBounceAnimation = function(elId,turnOn){

    if(turnOn){
      $(elId).removeClass("hide");
      $(elId).removeClass('animated bounceOutUp');
      $(elId).addClass('animated bounceInDown');
    }else{
      $(elId).removeClass('animated bounceInDown');
      $(elId).addClass('animated bounceOutUp');
      $(elId).addClass('hide');
    }
  };

  var updateProgressBar = function(evt){
    var percentComplete = Math.round((evt.loaded / evt.total)* 100);
    var status = "" + percentComplete + "%";
    $("#progressbar-meter").animate({width:status});
  };

  var uploadFile = function(){
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
        toggleBounceAnimation("#progressbar-container",true);
      },
      url: serverUrl,
      data: file,
      processData: false,
      contentType: false,
      success: function(data) {
        toggleBounceAnimation("#progressbar-container",false);
        postParty(file);
      },
      error: function(data) {
        var obj = jQuery.parseJSON(data);
        alert(obj.error);
      }
    });

  };

  var initParseSdk = function(){
    if(!Parse.applicationId)
    Parse.initialize("5sjv0ulSUoP2jMeLfvblBcfWhAkhQ76bDwRVxnh6",
    "tLOzhEPIJpzTvtQ0SszzwLv1lFC8nsucaePUc7YO");
  };

  var postParty = function(){
    initParseSdk();

    var Party = Parse.Object.extend("Party");
    var newParty = new Party();
    selectedPlace();

    newParty.set("canonicalName", $("#name").val());
    newParty.set("date", parseDate($("#date").val()));
    newParty.set("description", $("#description").val());
    //newParty.set("gentsPrice", );
    newParty.set("image", new Parse.File(file.name, file));
    //newParty.set("ladysPrice", "teste.api");
    newParty.set("name", $("#name").val());
    newParty.set("place", place);
    newParty.set("sendNamesType", "facebook");
    newParty.set("createdAt", new Date());
    //newParty.set("updatedAt", "teste.api");
    //newParty.set("ACL", filePath);

    newParty.save(null, {
      success: function(party) {
        var partyUpUrl = "http://partyup.parseapp.com/";
        window.location.replace(partyUpUrl);
      },
      error: function(party, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });

  };

  var parseDate = function(string){
    var parts = string.split('/');
    var date = new Date(parseInt(parts[2], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[0], 10));

    return date;
  }

  var selectedPlace = function(){
    var Place = Parse.Object.extend('Place');
    var query = new Parse.Query(Place);
    query.descending('createdAt');

    query.get($("#select-place").val(),{
      success:function(place) {
        place = place;
      },
      error:function() {
        res.send(500, 'Failed loading place');
      }
    });
  }

  var bindSavePartyEvent = function(){
    $('#save-button').click(function() {
      postParty();
    });
  };

  var attachEvents = function () {
    bindUploadButtonEvent();
    bindSelectFileEvent();
    bindSavePartyEvent();
    bindChangePartyTypeEvent();
    bindRequestFocusOnDatepicker();
  };

  return {
    attachEvents : attachEvents
  };
})();

$(document).ready(function() {
  PartyUp.attachEvents();
});
