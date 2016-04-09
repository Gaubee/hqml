const q = require("../qml2js-all.js")
const fs = require("fs")
const path = require("path")
const beautify = require('js-beautify').js_beautify;

try {
	var tree;
	console.log(
		(
			JSON.stringify(
				tree = qmlweb_parse(
					fs.readFileSync(__dirname + path.sep + "main.qml")
					.toString()
				),
				null,
				3
			),
			void 0
		)
	);

	// console.log(QMLTreeToJS(tree))
	var qmlparse_res = QMLTreeToJS(tree);
	var code;
	console.log(code = beautify(qmlparse_res.code.replace(/([\,\]])/g, "$1\n"), {
		comma_first: true
	}));

	var fun = Function(qmlparse_res.params, "return function(){return " + code + "}")(qmlparse_res.args);
	fun(function (qmlinstance) {
		console.log(qmlinstance)
	})
} catch (e) {
	console.error(e.toString === Error.prototype.toString ? e.stack : e.toString())
}