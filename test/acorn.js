const showErrorInCode = require("../src/helpers/showErrorInCode");
const acorn = require("acorn");
require('acorn-es7-plugin')(acorn);
require('acorn-qml').install(acorn);

const fs = require("fs");
const code = fs.readFileSync(__dirname + "/../build/.test/main.qml").toString()

// const code = `var sleep = (t)=>{
// 	return Promise((resolve, reject)=>{
// 		setTimeout(resolve, t)
// 	})
// };
// (async function(){
// 	await sleep(100)
// 	console.log([..."string"])
// })();
// `

// const code = `
// import QtQuick 2.6;
// `
try {

    const res = acorn.parse(code, {
        plugins: {
            // asyncawait: true,
            qml: true
        },
        locations: true,
        ecmaVersion: 5,
        // ecmaVersion: 7,
        allowReserved: false,
        ignoreQmlEcmaVersion: true
    });

    console.log(JSON.stringify(res, null, 4))
} catch (error) {
    // 如果有错误定点信息的话，则显示定点信息
    if (error.loc) {
        console.log(showErrorInCode(code, error.loc, error))
    } else {
        console.log(error.stack)
    }
}