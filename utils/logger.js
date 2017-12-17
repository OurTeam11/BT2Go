var DBG = true;

var log = function() {
	var sources = Array.prototype.slice.call(arguments);
	if (DBG) {
	  console.log(sources);
	}
}

module.exports = {
	log:log
}