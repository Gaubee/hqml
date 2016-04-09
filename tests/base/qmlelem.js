describe("create qmlelem", function() {
	it("show dom", function() {
		var result = add(3, 5);
		expect(result).toEqual(8);

	});
	it("document has div", function(done) {
		requireQML("/base/tests/base/Div.qml", function(con) {
			var qmlinstance = con();
			qmlinstance.onState(QML.states.BuildedComponent, function() {
				qmlinstance.appendTo(document.body);
				expect(document.getElementsByTagName('div').length).toEqual(1);
				done();
			});
		})
	});
});