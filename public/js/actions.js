var keys = require('./keys');
var uiutils = require('./uiutils');
var utils = require('./utils');

var bestMapsResult = {};

module.exports = {

  initParseSdk : function(){
    if(!Parse.applicationId)
      Parse.initialize(keys.parseAppId,keys.parseJsApiKey);
  },

  initGMaps : function(){
    new GMaps({
      div: '#map-canvas',
      lat: -23.59580171504693,
      lng: -46.679654453408084,
      zoom: 5
    });
  },

  searchInMaps : function(search){
    search = search.replace(/\s/g, "+");
    GMaps.geocode({
      address: search,
      callback: function(results, status) {
        if (status == 'OK') {
          bestMapsResult = results[0];
          var location = results[0].geometry.location;
          uiutils.updateMaps(location.lat(),location.lng());
        }
      }
    });
  },
  createPlace : function(imageFile){

    if(!utils.isValidMapsResult(bestMapsResult)){
      alert("Busque um endereço primeiro");
      return;
    }
    this.initParseSdk();
    var parseFile = new Parse.File(imageFile.name, imageFile);
    var location = bestMapsResult.geometry.location;
    var point = new Parse.GeoPoint({latitude: location.lat(), longitude: location.lng()});

    var address = utils.addressFromMapsObj(bestMapsResult);

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

    if(!utils.isValidPlace(place)){
      alert('Por favor , prencha todos os campos obrigatórios');
      return;
    }

    place.save(null, {
      success: function(place) {
        uiutils.disablePlaceButtons(false);
        window.location.href = "http://partyup.parseapp.com/places";
      },
      error: function(place, error) {
        alert('Failed to create new object, with error code: ' + error.message);
        uiutils.disablePlaceButtons(false);
      }
    });

  },

  fetchPlace : function(placeId,successCallback){

    if(!placeId){
      alert('Por favor, escolha uma cidade!');
      return;
    }

    var Place = Parse.Object.extend("Place");
    var query = new Parse.Query(Place);

    query.get(placeId, {
      success: function(place) {
        successCallback(place);
        uiutils.disablePartyButtons(false);
        uiutils.disablePlaceButtons(false);
      },
      error: function(object, error) {
        alert('Failed to retrieve new object, with error code: ' + error.message);
        uiutils.disablePartyButtons(false);
        uiutils.disablePlaceButtons(false);
      }
    });
  },

   fetchPlaces : function(city,callback){
    this.initParseSdk();
    var Place = Parse.Object.extend("Place");
    var query = new Parse.Query(Place);
    query.descending('createdAt');
    if(city)
      query.equalTo("canonicalCity", city.toUpperCase());
    query.find({
      success: function(places) {
        callback(places);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  },

  saveParty : function(partyObj,place,imageFile){

    var Party = Parse.Object.extend("Party");
    var party = new Party();

    moment().utcOffset(-180);
    moment().locale("br");
    var partyDate = moment(partyObj.date + " " + partyObj.hour, "DD/MM/YYYY HH:mm");

    if(imageFile){
      var parseFile = new Parse.File(imageFile.name, imageFile);
      party.set("image", parseFile);
    }

    if(partyObj.partyId)
      party.set("id",partyObj.partyId);

    party.set("name", partyObj.name);
    party.set("canonicalName", partyObj.name.toUpperCase());
    party.set("date", partyDate._d);
    party.set("description", partyObj.description);
    party.set("malePrice", partyObj.malePrice);
    party.set("femalePrice", partyObj.femalePrice);
    party.set("place", place);

    party.set("sendNamesType", partyObj.partyListType);
    party.set("sendNamesTo", partyObj.sendNamesTo);

    party.save(null, {
      success: function(party) {
        window.location.href = "http://partyup.parseapp.com/parties";
      },
      error: function(party, error) {
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });

  },

  updateParty : function(imageFile){

    this.initParseSdk();

    var partyObj = utils.partyFromInputs();
    partyObj["partyId"] = utils.partyIdFromInput();

    var context = this;
    this.fetchPlace(partyObj.placeId,function(place){

      context.saveParty(partyObj,place,imageFile);

    });

  },

  createParty : function(imageFile){

    this.initParseSdk();

    var partyObj = utils.partyFromInputs();

    var context = this;
    this.fetchPlace(partyObj.placeId,function(place){

      context.saveParty(partyObj,place,imageFile);

    });

  }

}
