var normal_c = " "
var cjk_c = "　"
    //亚洲字符在控制台中显示两个字符，计算一个字符串实际的显示长度
var cjk = function(char_code) {
    return 0x4E00 <= char_code && char_code <= 0x9FFF ||
        0x3400 <= char_code && char_code <= 0x4DFF ||
        0x20000 <= char_code && char_code <= 0x2A6DF ||
        0xF900 <= char_code && char_code <= 0xFAFF ||
        0x2F800 <= char_code && char_code <= 0x2FA1F;
}

function replacerConsoleRange(str) {
    var res = "";
    for (var i = 0, len = str.length, cc; i < len; i += 1) {
        cc = str.charCodeAt(i);
        if (cc === 9) { // \t
            res += '\t' // tab不管，否则不同的控制台下tab的长度是不一样的；除非在源码那边也进行修改
        } else if (cjk(cc)) {
            res += cjk_c
        } else {
            res += normal_c
        }
    }
    return res;
};
// 格式化显示错误信息点
function showErrorInCode(code, err_location, err, options) {
    options || (options = {});
    var line_range = options.line_range << 0 || 3;

    var codeLines = code.split("\n");

    // 错误的行号下标
    var show_line_index = err_location.line;
    // 显示的代码的起始行数
    var show_start_line = show_line_index - line_range;
    // 显示代码的结束行数
    var show_end_line = show_line_index + line_range;
    if (show_start_line < 0) {
        // show_line_index += show_start_line;
        show_start_line = 0;
    }
    // 显示行标所需的字符数 + 1 空格留白
    var index_len = ("" + show_end_line).length + 1;

    var show_code = codeLines.slice(show_start_line, show_end_line) // 切割出所需的代码片段
        .map(function(one_line_code, index) {
            var suffix = (index + show_start_line + ' '.repeat(index_len)).substr(0, index_len + 1);
            if (index === show_line_index - show_start_line - 1) {
                var prefix = '> '
                one_line_code += '\n' + normal_c.repeat(prefix.length + suffix.length) + replacerConsoleRange(one_line_code.substr(0, err_location.column)) + "∧" /*▲*/ ;
            } else {
                prefix = '  ';
            }
            return prefix + suffix + one_line_code
        }).join("\n")
    if (err && err.stack) {
        show_code += "\n" + err.stack
    }
    return show_code
};

module.exports = showErrorInCode;