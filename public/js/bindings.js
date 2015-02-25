var actions = require('./actions');
var uiutils = require('./uiutils');
var utils = require('./utils');
var _ = require('underscore');

module.exports = {

  bindSearchAddress : function(){
    $('#search-button').click(function(){
      var search = $('#search-text').val();
      actions.searchInMaps(search);
    });
  },
  bindSelectPlaceImageFileChangeEvent : function () {
    $('#select-file').bind("change", function(f) {
      var file = uiutils.fetchFileFromInput('#select-file', true);
      if(file && utils.isValidImage(file)){
        $("#image-name").val(file.name);
      }else{
        $("#image-name").val("");
      }
    });
  },

  bindUploadPlaceImageButtonEvent : function () {
    $('#upload-img-btn').click(function(){
      $('#select-file').click();
    });
  },

  bindCreatePlaceEvent : function(){
    $('#create-place-btn').click(function() {
      var file = uiutils.fetchFileFromInput('#select-file', true);
      if(file){
        actions.createPlace(file);
      }else{
        alert("Escolha a imagem primeiro!");
      }
    });
  },

  bindCreatePartyEvent : function(){
    $('#create-party-btn').click(function() {
      var file = uiutils.fetchFileFromInput('#select-file', false);
      actions.createParty(file);
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

  bindChangePartyCityEvent : function () {
    $('#select-city').bind("change",function(f){
      var city = $('#select-city').val();
      actions.fetchPlaces(city,function(places){
        var t = "<% places.forEach(function(place) { %>\
          <option value='<%= place.id %>'><%= place.get('name') %></option>\
          <% }) %>"
          var template = _.template(t);
          $('#select-place').html(template({places:places}));
        });

      });
    },

    bindSelectFileEvent : function () {
      $('#select-file').bind("change", function(f) {

      });
    },

    bindSavePartyEvent : function(){
      $('#save-button').click(function() {
        actions.postParty();
      });
    },
    attachEvents : function () {
      _.each(this, function(f,k){
        if(k.indexOf("bind") > -1)
        f();
      });
    }
  }
