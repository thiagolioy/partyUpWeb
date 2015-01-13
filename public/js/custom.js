var SnapR = SnapR || (function() {
  var file;

  var bindUploadButtonEvent = function () {
    $('#upload-button').click(function(){
      $('#select-file').click();
    });
  };

  var bindSelectFileEvent = function () {
    $('#select-file').bind("change", function(f) {
      var files = f.target.files || f.dataTransfer.files;
      file = files[0];
      $("#filename").val(file.name);

      var contains = file.name.indexOf(".ipa") > -1;
      toggleBounceAnimation("#bundle-id-container",contains);
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
        postRelease(data.url);
      },
      error: function(data) {
        var obj = jQuery.parseJSON(data);
        alert(obj.error);
      }
    });

  };

  var initParseSdk = function(){
    if(!Parse.applicationId)
      Parse.initialize("jol9azVpjaanp6btbn3fQVAoQVsE4ZFwUE29EkQh",
      "7KWtVRhabygCguq8JdKmuA2UNvwbRFeJgik642qZ");
  };

  var postRelease = function(filePath){
    initParseSdk();

    var Release = Parse.Object.extend("Release");
    var newRelease = new Release();

    newRelease.set("upload_path", filePath);
    newRelease.set("bundle_id", "teste.api");

    newRelease.save(null, {
      success: function(release) {
        var releaseUrl = "http://snaprelease.parseapp.com/download/"+release.id;
        window.location.replace(releaseUrl);
      },
      error: function(release, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });

  };

  var bindSnapReleaseEvent = function(){
    $('#snaprelease-button').click(function() {
      uploadFile();
    });
  };

  var attachEvents = function () {
    bindUploadButtonEvent();
    bindSelectFileEvent();
    bindSnapReleaseEvent();
  };

  return {
    attachEvents : attachEvents
  };
})();

$(document).ready(function() {
  SnapR.attachEvents();
});
