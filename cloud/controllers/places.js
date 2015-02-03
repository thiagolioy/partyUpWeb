var Place = Parse.Object.extend('Place');

var numberOfPartyPages = function(req,res,callback){
  var query = new Parse.Query(Party);
  query.count({
    success:function(count) {
      var n = Math.ceil(count / limit) - 1;
      var pages = Array.apply(0, Array(n)).map(function (x, y) { return y + 1; });
      callback(req,res,pages); 
    },
    error:function() {
      
    }
  });
};

exports.create = function(req, res) {

};

exports.index = function(req, res) {
  
  var fetchParties = function(req,res,numberOfPages){
    var page = req.query.page || 1;

    var query = new Parse.Query(Place);
    query.descending('createdAt');
    query.limit(limit);
    query.skip(page * limit);

    query.find().then(function(places) {
      res.render('places/places', {
        places: places,
        placesCount: numberOfPages,
        currentPage : page
      });
    },
    function() {
      res.send(500, 'Failed loading places');
    });
  }
};
