var Place = Parse.Object.extend('Place');
var Party = Parse.Object.extend('Party');

var limit = 10;

exports.create = function(req, res) {

};

var numberOfPartyPages = function(req,res,callback){
  var query = new Parse.Query(Party);
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

  var fetchParties = function(req,res,numberOfPages){

      var page = req.query.page || 0;


      console.log("params :" + req.query);

      var query = new Parse.Query(Party);
      query.descending('createdAt');
      query.limit(limit);
      query.skip(page * limit);
      query.include("place");
      query.find().then(function(parties) {
        res.render('parties/parties', {
          parties: parties,
          partiesCount: numberOfPages,
          currentPage : page
        });
      },
      function() {
        res.send(500, 'Failed loading parties');
      });
  };


  numberOfPartyPages(req,res,fetchParties);

};
