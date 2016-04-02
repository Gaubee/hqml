# About ListModel
在QML中，数组对象的绑定如果使用JS-Array，那么就会遇到这种情况：

```qml
property var listValue:["A","B","C","D","E"]

Repeater{
    model:listValue
    TextInput{
        id:inputText
        y:index*20
        x:50
        text:modelData
        onTextChanged: {
            listValue[index] = this.text
            // listValue = listValue；
        }
    }
}
Repeater{
    model:listValue
    Item{
        Text{
            y:index*20
            x:10
            text:modelData
        }
    }
}
```

这里有**两点问题**：
1. `text:modelData`没有做到声明的同时绑定
2. 另外一个是`onTextChanged`在修改完listValue后并不能正确触发更新，需要加上一句`listValue = listValue；`。
>而即便是触发了更新，也会形成一个循环绑定，使得TextInput失去焦点，而报出`QML Repeater: Binding loop detected for property "model"`的错误。

# QtQuick怎么实现这种数组绑定？

官方的解法是使用`ListModel`，代码如下
```qml
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
```
值得注意的是这里：
* modelData是read-only属性，虽然它可以把value属性读出来（modelData.value），但无法替代value这个属性名。所以如果要在Text节点中声明绑定的话就不能用modelData，而必须使用value这个属性名。这个很明显是设计上的缺陷。
* 另外官方文档中ListElement限制重重，因为官方的设计应该是XML数据类型为主要数据类型而不是JSON，所以基本上是没法说做到和JSON数据兼容了，就比如说`[1,2,3]`这样的数据类型是无法在ListModel中表达出来的，因为ListModel的元素必须是jsObject（instanceof Object），所以number、string、boolean类型是无法存储的。
* 还有说一下Repeater的弊端，一个是index这个属性无法被其下的子Repeater拿到，也就是说嵌套Repeater的情况下，低级的Repeater无法拿到高级的index，目前我还没找到解决方案。

# qml2js要如果做？

在runtime自然能做到前面所说的“两点问题”，在不违背QML语法的情况下，但qml2js的出发点是基于QML，至少要做到不违背QML。
首先最重要的一点，就是增加可控性，因为JS的灵活性，如果不开放这些可控性，很难调和开发者的需求，我们使用现在前端人员目标中常用的字段Each来做ElementName：
```qml
Each{
    id:firstEach
    /*
     * 同定义ID一样定义index、value的符号
     * 注意：这里使用的是符号，所以字符串是无效的，因此是不可绑定的，所以无允许动态改变这个关键字
     */
    valueName: $V // 默认是$value
    indexName: I // 默认是$index
    model: [1,2,{v:3},[4,5,6]] // 可以直接传入一个JS-Object，无需ListModel
    If{//按需渲染，如果没有a属性，则不会产生Each-Element，减少性能损耗
        condition: $V instanceof Array // 条件
        onTrue: Each{
            model: $V
            Text:{
                text: "Array Item:" + I + "," + $index + ":" + $value
            }
        }
        onFalse: I{
            text:"no array"
        }
    }
    B{ /*
        * 1,2,[object Object],[4,5,6]
        * JS对象转成字符串，除了undefined显示是空字符串""以外，其余的都是直接调用String(obj)来作为最后的结果
        */
        text:"<b>"+$V+"</b>"
    }

}
```

