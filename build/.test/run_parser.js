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
			)/*,
			void 0*/
		)
	);

	// console.log(QMLTreeToJS(tree).code)

	console.log(beautify(QMLTreeToJS(tree).code.replace(/([\,\]])/g, "$1\n"),{
		comma_first:true
	}))
} catch (e) {
	console.error(e.toString === Error.prototype.toString ? e.stack : e.toString())
}