function Doc() {

};
var __DocPrototype = Doc.prototype = {};
__DocPrototype.createElement = function(nodeName) {
	return {
		tagName: nodeName.toUpperCase()
	}
};
var globalDoc = Doc.global = global.document || new Doc;
