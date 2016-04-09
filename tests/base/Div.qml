import HTML 1.0
Div{
	dom.id: heh
	onClick:{
		console.log(1+2)
	}
	onDblClick:(function(){
		console.log(0||6)
	})
}