import QtQuick 2.6
import "E:/Git/中文测试/你妹啊" __ as HTMLBase
HTML{
	Head{
		id: qaq
		x: 10
		y: x + 20, x + 30
		width: (y>50&&typeof y&&y>>>1) ? ++y : y--
		show: true
		nullValue: null
		anchors.marginLeft: add(x, y)
		Title{
			text: "Test QML2JS"
		}
		Link{
			src:"./css/index.css"
		}
	}
	Div{
		title:(function xx(i){
					var res = ""
					do{
						res += i+","
					}while(i-=1)
					return res
				}(10))
		Text{
			text: titleInput["value"]||"No Title"
		}
		Input{
			id: titleInput
		}
		Behavior on scale{

		}
	}
	Component.onClick:{
		try{
			console.log("QAQ")
		}catch(err){
			return false			
		}
	}
}