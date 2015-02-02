var Place = Parse.Object.extend('Place');
var Party = Parse.Object.extend('Party');


exports.create = function(req, res) {

};

exports.index = function(req, res) {
  var query = new Parse.Query(Party);
  query.descending('createdAt');
  query.limit = 10;
  query.include("place");

  query.find().then(function(parties) {
    res.render('parties/parties', {
      parties: parties
    });
  },
  function() {
    res.send(500, 'Failed loading parties');
  });
};
