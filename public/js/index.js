var bindings = require('./bindings');
var actions = require('./actions');

$(document).foundation();
bindings.attachEvents();

$(document).ready(function(){
   actions.initGMaps();
});
