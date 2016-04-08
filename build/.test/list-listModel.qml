import QtQuick 2.6
import QtQuick.Window 2.0
Window{
    id:app
    title:"AAA"
    width:Screen.width/2
    height:Screen.height/2
    x:Screen.width/4
    y:Screen.height/4

    ListModel {
        id: listValue

        ListElement {
            value: "A"
        }
        ListElement {
            value: "B"
        }
        ListElement {
            value: "C"
        }
        ListElement {
            value: "D"
        }
        ListElement {
            value: "E"
        }
    }

    Repeater{
        model:listValue
        TextInput{
            id:inputText
            y:index*20
            x:50
            text:modelData
            onTextChanged:{
                listValue.set(index,{value:this.text});
            }
        }
    }
    Repeater{
        model:listValue
        Item{
            Text{
                y:index*20
                x:10
                text:value
            }
        }
    }
}
