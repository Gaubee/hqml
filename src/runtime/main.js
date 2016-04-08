var _BLOCK = "block",
	_DEBUGGER = "debugger",
	_DO = "do",
	_RETURN = "return",
	_SWITCH = "switch",
	_THROW = "throw",
	_WHILE = "while",
	_WITH = "with",
	_LABEL = "label",
	_STAT = "stat", // Statement 声明
	_NAME = "name",
	_FOR = "for",
	_IF = "if",
	_TRY = "try",
	_VAR = "var",
	_CONST = "const",
	_NEW = "new",
	_REGEXP = "regexp",
	_ARRAY = "array",
	_OBJECT = "object",
	_DOT = "dot",
	_SUB = "sub",
	_CALL = "call",
	_BINARY = "binary",
	_CONDITIONAL = "conditional",
	_ASSIGN = "assign",
	_SEQ = "seq",
	_QMLBINDING = "qmlbinding",
	_QMLVALUE = "qmlvalue",
	_QMLALIASDEF = "qmlaliasdef",
	_QMLPROPDEF = "qmlpropdef",
	_QMLDEFAULTPROP = "qmldefaultprop",
	_QMLSIGNALDEF = "qmlsignaldef",
	_QMLMETHOD = "qmlmethod",
	_QMLPROP = "qmlprop",
	_QMLELEM = "qmlelem",
	_QMLOBJDEF = "qmlobjdef",
	_QMLOBJ = "qmlobj",
	_QMLIMPORT = "qmlimport",
	_TOPLEVEL = "toplevel";
// 补充
var _NUM = "num",
	_STRING = "string";
_FUNCTION = "function"
	// 单目运算符
var _UNARY_PREFIX = "unary-prefix", //前
	_UNARY_POSTFIX = "unary-postfix"; //后

global.QMLTreeToJS = QMLTreeToJS;

function QMLTreeToJS(tree, options) {
	/* RETURN:
	 * code
	 * params
	 * args
	 *
	 * Function(args_name, code)(args)
	 */
	var args_info = {
		params: [],
		args: []
	}
	return {
		code: _QMLTreeToJSBuilder([tree], args_info, ""),
		params: args_info.params,
		args: args_info.args
	}
};

function _QMLTreeToJSBuilder(tree, args_info, param_prefix) {
	var i = 0;
	var node
	var res = ""
	while (node = tree && tree[i++]) {
		// 不使用switch-case，确保更高的压缩率
		/*
		 * TYPE
		 */
		var type = node[0];
		/*
		 * importTree, documentTree
		 */
		if (type === _TOPLEVEL) {
			res += QMLTreeToJSBuilder[_TOPLEVEL](node, args_info, param_prefix + "_" + i)
		} else {
			throw SyntaxError("unknow TYPE:" + type + ", Tree-Node-Index:" + i);
		}
	}
	return res
};
var QMLTreeToJSBuilder = _QMLTreeToJSBuilder._ = {};
QMLTreeToJSBuilder[_TOPLEVEL] = function(node, args_info, param_prefix) {
	return "QML.import(" +
		"[" +
		$Map(node[1], function(import_node, i) {
			return QMLTreeToJSBuilder[_QMLIMPORT](import_node, args_info, param_prefix + i)
		}).join() +
		"],function($){" + //$scope
		QMLTreeToJSBuilder[_QMLELEM](node[2], args_info, param_prefix) +
		"})"
};

QMLTreeToJSBuilder[_QMLIMPORT] = function(node, args_info, param_prefix) {
	/*
	 * moduleName, version, namespace, isDottedNotation
	 */
	var param_name = param_prefix + "_IMPORT_";
	$Push(args_info.params, param_name);
	$Push(args_info.args, node);
	return param_name
};

QMLTreeToJSBuilder[_QMLELEM] = function(node, args_info, param_prefix) {
	/*
	 * className, ?, propertys
	 */
	var param_name = param_prefix + "_ELEM_";
	$Push(args_info.params, param_name);
	$Push(args_info.args, node);

	return "$.elem('" + node[1] + "'," +
		(node[2] ? ("'" + node[2] + "'") : "null") +
		",[" +
		$Map(node[3], function(child_node, i) {
			return QMLTreeToJSBuilder[child_node[0]](child_node, args_info, param_name + i)
		}).join() +
		"])"
};

QMLTreeToJSBuilder[_QMLPROP] = function(node, args_info, param_prefix) {
	/*
	 * propName, propValue, *sourceCode
	 */
	var param_name = param_prefix + "_PROP_";
	var propValue = node[2];
	// $Push(args_info.params, param_name);
	// $Push(args_info.args, node);

	return "$.prop('" + node[1] + "'," +
		QMLTreeToJSBuilder[propValue[0]](propValue, args_info, param_name) +
		")"
};
QMLTreeToJSBuilder[_QMLBINDING] = function(node, args_info, param_prefix) {
	return "QMLBINDING()"
};
QMLTreeToJSBuilder[_QMLVALUE] = function(node, args_info, param_prefix) {
	return "QMLVALUE()"
};
QMLTreeToJSBuilder[_QMLALIASDEF] = function(node, args_info, param_prefix) {
	return "QMLALIASDEF()"
};
QMLTreeToJSBuilder[_QMLPROPDEF] = function(node, args_info, param_prefix) {
	return "QMLPROPDEF()"
};
QMLTreeToJSBuilder[_QMLDEFAULTPROP] = function(node, args_info, param_prefix) {
	return "QMLDEFAULTPROP()"
};
QMLTreeToJSBuilder[_QMLSIGNALDEF] = function(node, args_info, param_prefix) {
	return "QMLSIGNALDEF()"
};
QMLTreeToJSBuilder[_QMLMETHOD] = function(node, args_info, param_prefix) {
	return "QMLMETHOD()"
};
QMLTreeToJSBuilder[_QMLOBJDEF] = function(node, args_info, param_prefix) {
	return "$.objdef('" + node[1] + "','" + node[2] + "'," + ItemQMLTreeToJSBuilder(node[3]) + ")"
};
QMLTreeToJSBuilder[_QMLOBJ] = function(node, args_info, param_prefix) {
	return "QMLOBJ()"
};

function ArrayQMLTreeToJSBuilder(nodes, args_info, param_prefix) {
	return $Map(nodes, function(child_node, i) {
		return ItemQMLTreeToJSBuilder(child_node, args_info, param_prefix + i)
	})/*.join()*/ //join可以不写会隐式调用
};

function ItemQMLTreeToJSBuilder(node, args_info, param_prefix) {
	if (node && !QMLTreeToJSBuilder[node[0]]) {
		console.log(node)
	}
	return node && QMLTreeToJSBuilder[node[0]](node, args_info, param_prefix)
};