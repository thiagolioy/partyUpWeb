var Place = Parse.Object.extend('Place');


// Display all posts.
exports.index = function(req, res) {
  var query = new Parse.Query(Place);
  query.descending('createdAt');
  query.limit = 10;

  query.find().then(function(places) {
    res.render('admin/index', {
      places: places
    });
  },
  function() {
    res.send(500, 'Failed loading places');
  });
};
