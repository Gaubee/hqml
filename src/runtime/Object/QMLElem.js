function QMLElem(doc, tagName, namespace) {
	var self = {};
	tagName = self.tagName = tagName.toUpperCase();
	namespace = self.namespace || "";
	var dom = self.dom = doc.createElement(tagName);
	var attr = self.attr = QmlPropSet();
	self.addAttr = function(qmlprop) {
		$Push(QmlPropSet, qmlprop);
	};
	return self;
};