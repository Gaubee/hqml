function QML() {
	var self = this;
	self.deps = null
	self.runtime = new RunTime;
	self.events = {};
	self.STATE = __QMLStates.BeforeLoadDeps;
};
global.QML = QML;
QML.import = function(deps, callback) {
	var slef = new QML();
	_emitState(slef, 0);
	setTimeout(function() {
		_emitState(slef, 2);
		_emitState(slef, 3);
		slef.STATE = 4; //BuildingComponent no emit
		callback(slef.runtime);
		_emitState(slef, 5);
	}, 200);
	_emitState(slef, 1);
	return slef
};
_emitState = function(self, state) {
	self.STATE = state;
	self.emit(__STATEP_REIFX + state);
};
var __QMLStates = QML.states = {
	BeforeLoadDeps: 0,
	LoadingDeps: 1,
	LoadedDeps: 2,
	BeforeBuildComponent: 3,
	BuildingComponent: 4,
	BuildedComponent: 5
};
var __STATEP_REIFX = "STATE:";


var __QMLPrototype = QML.prototype = {};
__QMLPrototype.appendTo = function(dom) {
	var self = this;
	var runtime_root = self.runtime.root;
	var node = runtime_root && runtime_root.dom;
	node && dom.appendChild(node);
	return self;
};
__QMLPrototype.on = function(eventName, eventHandle) {
	var self = this;
	var events = self.events;
	$Push(events[eventName] || (events[eventName] = []), eventHandle);
	return self;
};
__QMLPrototype.off = function(eventName, eventHandle) {
	var self = this;
	var events = self.events;
	$Remove(events[eventName] || (events[eventName] = []), eventHandle);
	return self;
};
__QMLPrototype.emit = function(eventName) {
	var self = this;
	var eventList = $HasAndGet(self.events, eventName);
	if (eventList) {
		var args = arguments.length > 1 && $Slice(arguments, 1);
		$ForEach(eventList, function(handle) {
			args ? handle.apply(self, args) : handle.call(this);
		});
	}
	return self;
};
__QMLPrototype.onState = function(state, handle) {
	state = ~~state;
	var self = this;
	if (self.STATE >= state) {
		handle.call(self)
	} else {
		self.on(__STATEP_REIFX + state, handle);
	}
	return self;
};