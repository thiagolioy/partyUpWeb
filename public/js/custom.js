var PartyUp = PartyUp || (function() {

  var file;
  var place;


  var appConfig = {
    parseAppId : "5sjv0ulSUoP2jMeLfvblBcfWhAkhQ76bDwRVxnh6",
    parseRestApiKey : "497ZfHyTwSgrhbnaYSCZiOrS8p3k0HpvtIRrKyXM",
    parseJsApiKey : "tLOzhEPIJpzTvtQ0SszzwLv1lFC8nsucaePUc7YO"

  };


  var eventBindings = {

    bindUploadButtonEvent : function () {
      $('#upload-button').click(function(){
        $('#select-file').click();
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
        var files = f.target.files || f.dataTransfer.files;
        var name = files[0].name.toLowerCase();
        var contains = (name.indexOf(".png") > -1 || name.indexOf(".jpg") > -1 || name.indexOf(".jpeg") > -1);

        if(contains){
          file = files[0];
          $("#filename").val(file.name);
        }else{

        }
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

    updateProgressBar : function(evt){
      var percentComplete = Math.round((evt.loaded / evt.total)* 100);
      var status = "" + percentComplete + "%";
      $("#progressbar-meter").animate({width:status});
    }


  };

  var actions = {

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
        url: "http://partyup.parseapp.com/party",
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
