const acorn = require("acorn");
const fs = require("fs");
// const acorn_loose = require("acorn/dist/acorn_loose");
// const loose_parser = new acorn_loose.LooseParser();
// const code = fs.readFileSync("../build/.test/main.qml").toString()
// const res = acorn_loose.parse_dammit(code, {
// });
const code = `var sleep = (t)=>{
	return Promise((resolve, reject)=>{
		setTimeout(resolve, t)
	})
};
(async ()=>{
	await sleep(100)
	console.log([..."string"])
})();
`

const res = acorn.parse(code, {
	locations: true,
	ecmaVersion: 6,
	allowReserved: false
});

console.log(JSON.stringify(res, null, 4))