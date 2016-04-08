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
        id: fruitModel

        ListElement {
            name: "Apple"
            list: [
                ListElement { value: 1; name:"n1" },
                ListElement { value: 2; name:"n2" },
                ListElement { value: 3; name:"n3" }
            ]
        }
        ListElement {
            name: "Orange"
            list:  [
                ListElement { value: 4; name:"n4" },
                ListElement { value: 5; name:"n5" },
                ListElement { value: 6; name:"n6" }
            ]
        }
        ListElement {
            name: "Banana"
            list:  [
                ListElement { value: 7; name:"n7" },
                ListElement { value: 8; name:"n8" },
                ListElement { value: 9; name:"n9" }
            ]
        }
    }


    Component {
        id: fruitDelegate
        Grid{
            Row {
                spacing: 10
                Text {
                    height: 20
                    id:id_name
                    text: name
                }
                TextInput{
                    height: 20
                    text:name
                    color: "red"
                    onTextChanged: {
                        fruitModel.setProperty(index,"name",this.text)
                    }
                }
            }

            Repeater{
                model:list
                Row{
                    Text{
                        x:20
                        height: 20
                        text:value
                    }
                    spacing: 10
                }
            }
        }
    }
    ListView {
        id:id_listview_1
        anchors.fill: parent
        model: fruitModel
        delegate: fruitDelegate

    }
    ListView {
        id:id_listview_2
        anchors.fill: parent
        anchors.leftMargin: app.width/2
        model: fruitModel
        delegate: fruitDelegate
    }

    ListView{
        id: id_listview
        anchors.fill: parent
        anchors.topMargin: 200
        model:fruitModel
        delegate: Item{
            id:id_item
            x:index*100
            Repeater{
                model:list
                TextInput{
                    x:20
                    y:index*20
                    height: 20
                    text:value
                    color:"blue"
                    onTextChanged: {
               console.log(id_listview.index,index)
                    }
                }
            }
        }
    }

}
