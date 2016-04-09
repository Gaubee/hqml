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