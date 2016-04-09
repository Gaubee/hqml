function add(a, b) {
	return a + b
};

function requireQML(url, cb) {
	var xhr = new XMLHttpRequest;
	xhr.open("get", url, true);
	xhr.send()
	xhr.onload = function() {
		var ast = qmlweb_parse(xhr.responseText);
		var qml = QMLTreeToJS(ast)
		var con_factory = Function(qml.params, "return function(){return " + qml.code + "}");
		var con = con_factory.apply(null, qml.args);
		cb && cb(con);
	}
}