function Scope(obj, parent) {
	this.data = obj;
	this.parent = parent || globalScope;
};
var globalScope = Scope.global = new Scope(global);
Scope.prototype = {
	get: function(key) {
		return this[key]
	},
	set: function(key, value) {
		return this[key] = value
	}
};