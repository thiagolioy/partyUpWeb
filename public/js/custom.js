var PartyUp = PartyUp || (function() {
  var file;

  var bindUploadButtonEvent = function () {
    $('#upload-button').click(function(){
      $('#select-file').click();
    });
  };

  var bindSelectFileEvent = function () {
    $('#select-file').bind("change", function(f) {
      var files = f.target.files || f.dataTransfer.files;
      var contains = (files[0].name.indexOf(".png") > -1 || files[0].name.indexOf(".jpg") > -1 || files[0].name.indexOf(".jpeg") > -1);
      
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
        request.setRequestHeader("X-Parse-Application-Id", 'jol9azVpjaanp6btbn3fQVAoQVsE4ZFwUE29EkQh');
        request.setRequestHeader("X-Parse-REST-API-Key", '1l6FZMNAlO2ubHK62Z2p2dbXZso0I7Q4JxreJSBG');
        request.setRequestHeader("Content-Type", file.type);
        toggleBounceAnimation("#progressbar-container",true);
      },
      url: serverUrl,
      data: file,
      processData: false,
      contentType: false,
      success: function(data) {
        toggleBounceAnimation("#progressbar-container",false);
        postParty(data.url);
      },
      error: function(data) {
        var obj = jQuery.parseJSON(data);
        alert(obj.error);
      }
    });

  };

  var initParseSdk = function(){
    if(!Parse.applicationId)
      Parse.initialize("sfI8tzyt1PF8aOpQD1w5b7osmm5D69aFmNxu6IFH",
      "7WimPraXqkpps6GYK10XChOMm5Y1dwtCJAy0DfnU");
  };

  var postParty = function(filePath){
    initParseSdk();

    var Party = Parse.Object.extend("Party");
    var newParty = new Party();

    newParty.set("canonicalName", $("#name").val());
    newParty.set("date", $("#date").val());
    newParty.set("description", $("#description").val());
    //newParty.set("gentsPrice", );
    newParty.set("image", filePath);
    //newParty.set("ladysPrice", "teste.api");
    newParty.set("name", $("#name").val());
    newParty.set("place", $("#place").val());
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

  var bindSavePartyEvent = function(){
    $('#save-button').click(function() {
      uploadFile();
    });
  };

  var attachEvents = function () {
    bindUploadButtonEvent();
    bindSelectFileEvent();
    bindSavePartyEvent();
  };

  return {
    attachEvents : attachEvents
  };
})();

$(document).ready(function() {
  PartyUp.attachEvents();
});
