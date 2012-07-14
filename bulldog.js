var Bulldog = module.exports = function Bulldog(url, interval){
	this.url = url;
	this.interval = interval;
};

Bulldog.watch = function(url, interval){
	return new Bulldog(url, interval);
}