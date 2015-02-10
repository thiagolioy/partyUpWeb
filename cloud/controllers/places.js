var Place = Parse.Object.extend('Place');
var limit = 10;

exports.create = function(req, res) {

};

exports.new = function(req, res) {
  res.render('dist/places/place');
};

var numberOfPlacesPages = function(req,res,callback){
  var query = new Parse.Query(Place);
  query.count({
    success:function(count) {
      var n = Math.ceil(count / limit);
      var pages = Array.apply(null, {length:n}).map(Number.call,Number);
      callback(req,res,pages);
    },
    error:function() {

    }
  });
};

exports.index = function(req, res) {

    var fetchPlaces = function(req,res,numberOfPages){

        var page = req.query.page || 0;


        console.log("params :" + req.query);

        var query = new Parse.Query(Place);
        query.descending('createdAt');
        query.limit(limit);
        query.skip(page * limit);
        query.find().then(function(places) {
          res.render('dist/places/places', {
            places: places,
            placesCount: numberOfPages,
            currentPage : page
          });
        },
        function() {
          res.send(500, 'Failed loading places');
        });
    };


    numberOfPlacesPages(req,res,fetchPlaces);
};
