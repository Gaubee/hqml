function RunTime(scope, doc) {
	this.scope = scope || new Scope();
	this.doc = doc || globalDoc;
	this.root = null;
};
var __RunTimeProtoType = RunTime.prototype = {}
__RunTimeProtoType[_BLOCK] = function() {

};
__RunTimeProtoType[_DEBUGGER] = function() {

};
__RunTimeProtoType[_DO] = function() {

};
__RunTimeProtoType[_RETURN] = function() {

};
__RunTimeProtoType[_SWITCH] = function() {

};
__RunTimeProtoType[_THROW] = function() {

};
__RunTimeProtoType[_WHILE] = function() {

};
__RunTimeProtoType[_WITH] = function() {

};
__RunTimeProtoType[_LABEL] = function() {

};
__RunTimeProtoType[_STAT] = function() {

};
__RunTimeProtoType[_NAME] = function() {

};
__RunTimeProtoType[_FOR] = function() {

};
__RunTimeProtoType[_IF] = function() {

};
__RunTimeProtoType[_TRY] = function() {

};
__RunTimeProtoType[_VAR] = function() {

};
__RunTimeProtoType[_CONST] = function() {

};
__RunTimeProtoType[_NEW] = function() {

};
__RunTimeProtoType[_REGEXP] = function() {

};
__RunTimeProtoType[_ARRAY] = function() {

};
__RunTimeProtoType[_OBJECT] = function() {

};
__RunTimeProtoType[_DOT] = function() {

};
__RunTimeProtoType[_SUB] = function() {

};
__RunTimeProtoType[_CALL] = function() {

};
__RunTimeProtoType[_BINARY] = function() {

};
__RunTimeProtoType[_CONDITIONAL] = function() {

};
__RunTimeProtoType[_ASSIGN] = function() {

};
__RunTimeProtoType[_SEQ] = function() {

};
__RunTimeProtoType[_QMLBINDING] = function() {

};
__RunTimeProtoType[_QMLVALUE] = function() {

};
__RunTimeProtoType[_QMLALIASDEF] = function() {

};
__RunTimeProtoType[_QMLPROPDEF] = function() {

};
__RunTimeProtoType[_QMLDEFAULTPROP] = function() {

};
__RunTimeProtoType[_QMLSIGNALDEF] = function() {

};
__RunTimeProtoType[_QMLMETHOD] = function() {

};
__RunTimeProtoType[_QMLPROP] = function(prop_name, value) {
	return QmlProp(prop_name, value)
};
__RunTimeProtoType["base_" + _QMLELEM] = function(tagName, namespace, args) {
	var self = this;
	var node = QMLElem(self.doc, tagName, namespace);
	$ForEach(args, node.addAttr);
	return node;
};
__RunTimeProtoType[_QMLELEM] = __RunTimeProtoType["root_" + _QMLELEM] = function(tagName, namespace, args) {
	var self = this;
	self[_QMLELEM] = self["base_" + _QMLELEM];
	var res = self[_QMLELEM].apply(this, arguments)
	self.root = res;
	return res;
};

__RunTimeProtoType[_QMLOBJDEF] = function() {

};
__RunTimeProtoType[_QMLOBJ] = function() {

};
__RunTimeProtoType[_QMLIMPORT] = function() {

};
__RunTimeProtoType[_TOPLEVEL] = function() {

};
__RunTimeProtoType[_NUM] = function() {

};
__RunTimeProtoType[_STRING] = function() {

};
__RunTimeProtoType[_FUNCTION] = function() {

};
__RunTimeProtoType[_UNARY_PREFIX] = function() {

};
__RunTimeProtoType[_UNARY_POSTFIX] = function() {

};