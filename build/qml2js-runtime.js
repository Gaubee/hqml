(function(global){

/*
 * 更好的压缩率
 */
var __PROTOTYPE = "prototype";

function $Push(arr, item) {
	arr[arr.length] = item;
	return arr
}

function $ForEach(arr, cb) {
	for (var i = 0, len = arr.length; i < len; i += 1) {
		cb(arr[i], i)
	}
}

function $Map(arr, cb) {
	for (var i = 0, len = arr.length, res = []; i < len; i += 1) {
		$Push(res, cb(arr[i], i))
	}
	return res
}

var _slice = Array[__PROTOTYPE].slice;

function $Slice(arr, start_index, end_index) {
	return _slice.call(arr, start_index, end_index);
};

function $Remove(arr, item) {
	var index = arr.indexOf(item);
	index !== -1 && arr.splice(i, 1);
};

function $HasAndGet(obj, key) {
	return obj.hasOwnProperty(key) && obj[key];
};

//将字符串反转义,同JSON.stringify(string)
var charIndexBuggy = "a" [0] != "a";
var Escapes = {
	92: "\\\\",
	34: '\\"',
	8: "\\b",
	12: "\\f",
	10: "\\n",
	13: "\\r",
	9: "\\t"
};

function strStringify(value) {
	var result = '"',
		index = 0,
		length = value.length,
		useCharIndex = !charIndexBuggy || length > 10;
	var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
	for (; index < length; index++) {
		var charCode = value.charCodeAt(index);
		// If the character is a control character, append its Unicode or
		// shorthand escape sequence; otherwise, append the character as-is.
		switch (charCode) {
			case 8:
			case 9:
			case 10:
			case 12:
			case 13:
			case 34:
			case 92:
				result += Escapes[charCode];
				break;
			default:
				if (charCode < 32) {
					result += unicodePrefix + toPaddedString(2, charCode.toString(16));
					break;
				}
				result += useCharIndex ? symbols[index] : value.charAt(index);
		}
	}
	return result + '"';
};
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
		args: args_info.args,
		build: BuildJSToFunction
	}
};

function BuildJSToFunction() {
	var con_factory = Function(qml.params, "return function(){return " + qml.code + "}");
	var con = con_factory.apply(null, qml.args);
	return con
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
		"],function($){return " + //$scope
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

	return "$." + _QMLELEM + "('" + node[1] + "'," +
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

	return "$." + _QMLPROP + "('" + node[1] + "'," +
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
	return "$." + _QMLOBJDEF + "('" + node[1] + "','" + node[2] + "'," + ItemQMLTreeToJSBuilder(node[3]) + ")"
};
QMLTreeToJSBuilder[_QMLOBJ] = function(node, args_info, param_prefix) {
	return "QMLOBJ()"
};

function ArrayQMLTreeToJSBuilder(nodes, args_info, param_prefix) {
	return $Map(nodes, function(child_node, i) {
			return ItemQMLTreeToJSBuilder(child_node, args_info, param_prefix + i)
		}) /*.join()*/ //join可以不写会隐式调用
};

function ItemQMLTreeToJSBuilder(node, args_info, param_prefix) {
	if (node && !QMLTreeToJSBuilder[node[0]]) {
		console.log(node)
	}
	return node && QMLTreeToJSBuilder[node[0]](node, args_info, param_prefix)
};
function Doc() {

};
var __DocPrototype = Doc.prototype = {};
__DocPrototype.createElement = function(nodeName) {
	return {
		tagName: nodeName.toUpperCase()
	}
};
var globalDoc = Doc.global = global.document || new Doc;

QMLTreeToJSBuilder[_BLOCK] = function(node, args_info, param_prefix) {
	/*
	 * 代码块，存在于function，if-else，while，try等可以包裹代码块的地方
	 * TODO：与ES6中的let关键字相关
	 */
	return "$.block(" + ArrayQMLTreeToJSBuilder(node[1], args_info, param_prefix) + ")"
};
QMLTreeToJSBuilder[_DEBUGGER] = function(node, args_info, param_prefix) {
	return "DEBUGGER()"
};
QMLTreeToJSBuilder[_DO] = function(node, args_info, param_prefix) {
	return "DO()"
};
QMLTreeToJSBuilder[_RETURN] = function(node, args_info, param_prefix) {
	return "$.return(" + ItemQMLTreeToJSBuilder(node[1], args_info, param_prefix) + ")"
};
QMLTreeToJSBuilder[_SWITCH] = function(node, args_info, param_prefix) {
	return "SWITCH()"
};
QMLTreeToJSBuilder[_THROW] = function(node, args_info, param_prefix) {
	return "THROW()"
};
QMLTreeToJSBuilder[_WHILE] = function(node, args_info, param_prefix) {
	return "WHILE()"
};
QMLTreeToJSBuilder[_WITH] = function(node, args_info, param_prefix) {
	return "WITH()"
};
QMLTreeToJSBuilder[_LABEL] = function(node, args_info, param_prefix) {
	return "LABEL()"
};
QMLTreeToJSBuilder[_STAT] = function(node, args_info, param_prefix) {
	/*
	 * statType,..args
	 */
	var statInfo = node[1]
	return ItemQMLTreeToJSBuilder(statInfo, args_info, param_prefix);
};
QMLTreeToJSBuilder[_NAME] = function(node, args_info, param_prefix) {
	/*
	 * name||boolean||null
	 */
	var name = node[1];
	if (name === "null" || name === "false" || name === "true") {
		return name
	}
	return "$.name('" + name + "')";
};
QMLTreeToJSBuilder[_FOR] = function(node, args_info, param_prefix) {
	return "FOR()"
};
QMLTreeToJSBuilder[_IF] = function(node, args_info, param_prefix) {
	return "IF()"
};
QMLTreeToJSBuilder[_TRY] = function(node, args_info, param_prefix) {
	/*
	 * try ,catch , finally(可能是null)
	 * try、finally里面是多行代码
	 * catch是一段特殊声明的err字段加上代码块
	 */
	return "$.try([" +
		// try
		ArrayQMLTreeToJSBuilder(node[1], args_info, param_prefix) + "],'" + //try-body
		// catch
		node[2][0] + "',[" + //catch-err-name
		ArrayQMLTreeToJSBuilder(node[2][1], args_info, param_prefix) + "]," + //catch-body
		// finally
		(node[3] && ("[" + ArrayQMLTreeToJSBuilder(node[3], args_info, param_prefix) + "]")) + //finally-body
		")"
};
QMLTreeToJSBuilder[_VAR] = function(node, args_info, param_prefix) {
	return "VAR()"
};
QMLTreeToJSBuilder[_CONST] = function(node, args_info, param_prefix) {
	return "CONST()"
};
QMLTreeToJSBuilder[_NEW] = function(node, args_info, param_prefix) {
	return "NEW()"
};
QMLTreeToJSBuilder[_REGEXP] = function(node, args_info, param_prefix) {
	return "REGEXP()"
};
QMLTreeToJSBuilder[_ARRAY] = function(node, args_info, param_prefix) {
	return "ARRAY()"
};
QMLTreeToJSBuilder[_OBJECT] = function(node, args_info, param_prefix) {
	return "OBJECT()"
};
/*
 * 取属性
 * dot是直接取: a.b
 * sub是使用下标取: a['b']
 */
QMLTreeToJSBuilder[_DOT] = function(node, args_info, param_prefix) {
	/*
	 * obj,key
	 */
	return "$.dot(" + ItemQMLTreeToJSBuilder(node[1]) + ",'" + node[2] + "')"
};
QMLTreeToJSBuilder[_SUB] = function(node, args_info, param_prefix) {
	return "$.sub(" + ArrayQMLTreeToJSBuilder($Slice(node, 1)) + ")"
};
/*
 * 调用函数
 */
QMLTreeToJSBuilder[_CALL] = function(node, args_info, param_prefix) {
	/*
	 * function(defined or get by name),args(Array)
	 */
	var fun = node[1]
	return "$.call(" + ItemQMLTreeToJSBuilder(fun, args_info, param_prefix) +
		",[" +
		ArrayQMLTreeToJSBuilder(node[2], args_info, param_prefix) +
		"])"
};
/*
 * 双目运算符
 */
QMLTreeToJSBuilder[_BINARY] = function(node, args_info, param_prefix) {
	/*
	 * 二进制表达式，或者是运算表达式，比如>>、<<、+、^等等
	 * 逻辑表达式，就||、&&什么的
	 */
	// var arg1 = node[2];
	// var arg2 = node[3];
	return "$.binary('" + node[1] + "'," +
		ArrayQMLTreeToJSBuilder($Slice(node, 2), args_info, param_prefix) +
		")"
};
/*
 * 三目运算符
 */
QMLTreeToJSBuilder[_CONDITIONAL] = function(node, args_info, param_prefix) {
	/*
	 * 条件表达式
	 */
	// var _if = node[1];
	// var _then = node[2];
	// var _else = node[3];
	return "$.conditional(" +
		ArrayQMLTreeToJSBuilder($Slice(node, 1), args_info, param_prefix) +
		")"
};
QMLTreeToJSBuilder[_ASSIGN] = function(node, args_info, param_prefix) {
	return "ASSIGN()"
};
QMLTreeToJSBuilder[_SEQ] = function(node, args_info, param_prefix) {
	/*
	 * 序列表达式，意味着多个表达式混合，用,进行分隔
	 * "seq", statItem, ...statItem
	 */
	return "$.seq(" +
		ArrayQMLTreeToJSBuilder($Slice(node, 1), args_info, param_prefix) +
		")"
};
/*
 * 替代原生的对象：number、string
 * 从而在不改动原生prototype的基础上拓展方法
 * boolean语法和name的语法一样，在name那边做处理，基本上也没什么可以拓展的，所以直接用原生的
 */
QMLTreeToJSBuilder[_NUM] = function(node, args_info, param_prefix) {
	/*
	 * number
	 * TODO:ES6中数字的表达范围更广，所以到时候要针对高版本的数值表达字符串给解析成数字
	 */
	return "$.num(" + node[1] + ")"
};
QMLTreeToJSBuilder[_STRING] = function(node, args_info, param_prefix) {
	/*
	 * string
	 */
	return "$.string(" + strStringify(node[1]) + ")"
};
/*
 * 单目运算符
 */
QMLTreeToJSBuilder[_UNARY_PREFIX] = function(node, args_info, param_prefix) {
	var arg = node[2];
	return "$.unary_prefix('" + node[1] + "'," + ItemQMLTreeToJSBuilder(arg, args_info, param_prefix) + ")";
};
QMLTreeToJSBuilder[_UNARY_POSTFIX] = function(node, args_info, param_prefix) {
	var arg = node[2];
	return "$.unary_postfix('" + node[1] + "'," + ItemQMLTreeToJSBuilder(arg, args_info, param_prefix) + ")";
};
/*
 * 函数定义
 */
QMLTreeToJSBuilder[_FUNCTION] = function(node, args_info, param_prefix) {
	/*
	 * FunctionName(string||null), ArgsDefine[], FunctionBody
	 * 函数的定义需要把当前的声明域传入
	 * TODO:目前Parser中不支持默认参数等ES6特性
	 */
	var functionName = node[1];
	functionName && (functionName = strStringify(functionName)); //同'"'+functionName+'"'，这里为了节省字符
	var argsDefine = $Map(node[2], function(argName) {
		return strStringify(argName)
	});

	return "$.function(" + functionName + ",[" + argsDefine.join() + "," + ArrayQMLTreeToJSBuilder(node[3]) + "])"
};
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
function QmlProp(name, value) {
	var self = {};
	self[name] = value;
	return self;
};

function QmlPropSet() {
	var res = [];
	return res;
};
function QML() {
	var self = this;
	self.deps = null
	self.runtime = new RunTime;
	self.events = {};
	self.STATE = __QMLStates.BeforeLoadDeps;
};
global.QML = QML;
QML.import = function(deps, callback) {
	var slef = new QML();
	_emitState(slef, 0);
	setTimeout(function() {
		_emitState(slef, 2);
		_emitState(slef, 3);
		slef.STATE = 4; //BuildingComponent no emit
		callback(slef.runtime);
		_emitState(slef, 5);
	}, 200);
	_emitState(slef, 1);
	return slef
};
_emitState = function(self, state) {
	self.STATE = state;
	self.emit(__STATEP_REIFX + state);
};
var __QMLStates = QML.states = {
	BeforeLoadDeps: 0,
	LoadingDeps: 1,
	LoadedDeps: 2,
	BeforeBuildComponent: 3,
	BuildingComponent: 4,
	BuildedComponent: 5
};
var __STATEP_REIFX = "STATE:";


var __QMLPrototype = QML.prototype = {};
__QMLPrototype.appendTo = function(dom) {
	var self = this;
	var runtime_root = self.runtime.root;
	var node = runtime_root && runtime_root.dom;
	node && dom.appendChild(node);
	return self;
};
__QMLPrototype.on = function(eventName, eventHandle) {
	var self = this;
	var events = self.events;
	$Push(events[eventName] || (events[eventName] = []), eventHandle);
	return self;
};
__QMLPrototype.off = function(eventName, eventHandle) {
	var self = this;
	var events = self.events;
	$Remove(events[eventName] || (events[eventName] = []), eventHandle);
	return self;
};
__QMLPrototype.emit = function(eventName) {
	var self = this;
	var eventList = $HasAndGet(self.events, eventName);
	if (eventList) {
		var args = arguments.length > 1 && $Slice(arguments, 1);
		$ForEach(eventList, function(handle) {
			args ? handle.apply(self, args) : handle.call(this);
		});
	}
	return self;
};
__QMLPrototype.onState = function(state, handle) {
	state = ~~state;
	var self = this;
	if (self.STATE >= state) {
		handle.call(self)
	} else {
		self.on(__STATEP_REIFX + state, handle);
	}
	return self;
};
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
})(typeof global != 'undefined' ? global : typeof window != 'undefined' ? window : this);