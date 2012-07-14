var Bulldog = module.exports = function Bulldog(url, interval, opt){
	this.url = url;
	this.interval = interval;
	this.options = opt;
};

Bulldog.watch = function(url, interval, opt){
	return new Bulldog(url, interval, opt);
}