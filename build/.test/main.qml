import HTML 1.0
Div{
	onClick:{
		console.log(1+2)
	}
	onDblClick:(function(){
		console.log(0||6)
	})
}

// Title{
// 	text: "Test QML2JS"
// }
// Link{
// 	src:"./css/index.css"
// }
// Div{
// 	title:(function xx(i){
// 				var res = ""
// 				do{
// 					res += i+","
// 				}while(i-=1)
// 				return res
// 			}(10))
// 	Text{
// 		text: titleInput["value"]||"No Title"
// 	}
// 	Input{
// 		id: titleInput
// 	}
// 	Behavior on scale{

// 	}
// }
// Component.onClick:{
// 	try{
// 		console.log("QAQ")
// 	}catch(err){
// 		return false			
// 	}
// }
