var Place = Parse.Object.extend('Place');
var Party = Parse.Object.extend('Party');


exports.create = function(req, res) {

};

exports.index = function(req, res) {
  var query = new Parse.Query(Place);
  query.descending('createdAt');
  query.limit = 10;

  query.find().then(function(places) {
    res.render('places/places', {
      places: places
    });
  },
  function() {
    res.send(500, 'Failed loading places');
  });
};
