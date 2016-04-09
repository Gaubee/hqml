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