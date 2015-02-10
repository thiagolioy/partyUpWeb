var _ = require('underscore');

module.exports = {

  isValidImage : function(file){
    var valid = (this.hasIn(".png",file.name) || this.hasIn(".jpeg",file.name) || this.hasIn(".jpg",file.name));
    return valid ? true : false;
  },
  hasIn : function(text,string){
    return string.indexOf(text) > -1;
  },
  isValidPlace : function(place){
    return true;
  },
  isValidMapsResult : function(result){
    result = result || null;
    return result == null ? false : true;
  },
  addressFromMapsObj : function(mapsObj){
    var address = {};
    var dict = {"street_number":"number","route":"street",
    "neighborhood":"neighborhood","locality":"city",
    "administrative_area_level_1":"state","country":"country",
    "postal_code":"postal_code"};

    _.each(mapsObj.address_components,function(el){
      _.each(el.types,function(value,key){
        if(_.contains(Object.keys(dict),value))
        address[dict[value]] = el.long_name;
      });
    });

    return address;
  },
  partyFromInputs : function(){
    var inputs = ["name","datepicker","hour","description","select-place",
    "facebook-event-id","event-email","male-price","female-price"];
    var keys = ["name","date","hour","description","placeId","facebookId",
    "eventEmail","malePrice","femalePrice"];
    var party = {};
    $.each(inputs, function(i,v){
      party[keys[i]] = $("#"+v).val();
    });

    return party;
  }

}
