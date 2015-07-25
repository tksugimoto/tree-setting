
function TreeSetting (settingTree, localStorageKey) {
	this.settingTree = settingTree;
	// settingTreeにdefaultValue指定の無い設定があった場合のデフォルト値
	this.defaultValue = {
		boolean: false,
		string: "",
		number: 0
	};
	
	this.localStorageKey = localStorageKey || "tree-setting";
	this.load();
	
	this.settingInfo = {};
	this.createSettingInfo(settingTree, "");
}

TreeSetting.prototype.createSettingElement = function (tree, prefix){
	if (!tree) tree = this.settingTree;
	if (!prefix) prefix = "";
	var self = this;
	var createElement = TreeSetting.createElement;
	var container = createElement("ul");
	if (prefix) {
		container.style.marginLeft = "20px";
	}
	var _idPrefix = "ts-";
	tree.forEach(function (object){
		var key = prefix + object.key;
		var name = object.name;
		var type = object.type || "boolean";
		var input_and_label = settingElement(key, name, type);
		var list = createElement("li", {
			
		}, input_and_label, function (){
			container.appendChild(this);
		});
		if (object.child) {
			var childElement = self.createSettingElement(object.child, key + ".");
			list.appendChild(childElement);
		}
	});
	return container;
	
	function settingElement(key, name, type){
		var value = self.get(key);
		var separator = " : ";
		if (type === "boolean") {
			var id = _idPrefix + key;
			return [
				createElement("input", {
					type: "checkbox",
					checked: value,
					id: id,
					onchange: function (){
						// 入力ごとに保存すると重いかも
						self.set(key, this.checked);
					}
				}),
				separator, 
				createElement("label", {
					innerText: name,
					htmlFor: id
				})
			];
		} else {
			// TODO: 数字(type === "number"時)のバリデーション
			return [
				createElement("input", {
					type: "text",
					value: value,
					onkeyup: function (){
						// 入力ごとに保存すると重いかも
						self.set(key, this.value);
					}
				}),
				separator, 
				createElement("label", {
					innerText: name
				})
			];
		}
	}
};
TreeSetting.prototype.appendSettingElement = function (parentNode){
	parentNode.appendChild(this.createSettingElement());
};

TreeSetting.prototype.createSettingInfo = function (tree, prefix){
	var self = this;
	tree.forEach(function (object){
		self.settingInfo[prefix + object.key] = object;
		if (object.child) {
			self.createSettingInfo(object.child, prefix + object.key + ".");
		}
	});
};
TreeSetting.prototype.load = function (){
	this.settingData = JSON.parse(localStorage[this.localStorageKey] || "{}");
};
TreeSetting.prototype.save = function (){
	localStorage[this.localStorageKey] = JSON.stringify(this.settingData);
};
TreeSetting.prototype.get = function (name){
	var value = this.settingData[name];
	if (typeof value !== "undefined") {
		return value;
	} else {
		// setting情報のobjectから
		var info = this.settingInfo[name] || {};
		if (typeof info.defaultValue !== "undefined") {
			return info.defaultValue;
		} else {
			return this.defaultValue[info.type || "boolean"];
		}
	}
};
TreeSetting.prototype.set = function (name, value){
	if (this.settingInfo.hasOwnProperty(name)) {
		this.settingData[name] = value;
		this.save();
		return true;
	} else {
		return false;
	}
};

TreeSetting.createElement = function (elem, attrs, childs, callback){
	if (!elem) return null;
	if (typeof elem === "string") elem = document.createElement(elem);
	if (attrs) {
		Object.keys(attrs).forEach(function (key_attr){
			if (key_attr === "style") {
				var styles = attrs.style;
				Object.keys(styles).forEach(function (key_style){
					elem.style[key_style] = styles[key_style];
				});
			} else if (key_attr === "class") {
				elem.className = attrs.class;
			} else if (key_attr.indexOf("-") !== -1) {
				// data-** etc
				elem.setAttribute(key_attr, attrs[key_attr]);
			} else {
				elem[key_attr] = attrs[key_attr];
			}
		});
	}
	if (typeof childs === "function") {
		callback = childs;
		childs = null;
	}
	if (childs) {
		if (childs instanceof Array) {
			childs.forEach(function (child){
				if (child) {
					if (typeof child === "string") child = document.createTextNode(child);
					elem.appendChild(child);
				}
			});
		} else {
			if (typeof childs === "string") childs = document.createTextNode(childs);
			elem.appendChild(childs);
		}
	}
	if (typeof callback === "function") {
		callback.call(elem);
	}
	return elem;
}