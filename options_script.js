
var treeSetting = new TreeSetting([{
	key: "function-A",
	name: "機能A",
	defaultValue: false
}, {
	key: "function-B",
	name: "機能B",
	defaultValue: true,
	child: [{
		key: "click-play-pause",
		name: "クリックで再生/一時停止"
	}, {
		key: "wheel-seek",
		name: "ホイールでシーク",
		child: [{
			key: "adjustment-amount",
			name: "調整量",
			type: "number",
			defaultValue: 5
		}, {
			key: "dummy",
			name: "dummy",
			type: "string",
			defaultValue: "テキスト設定も可能"
		}]
	}]
}]);

var containerElement = document.getElementById("setting-container");
treeSetting.appendSettingElement(containerElement);

(function (keys){
	keys.forEach(function (key){
		console.log(key, treeSetting.get(key));
	});
})([
	"function-A",
	"function-B.click-play-pause",
	"function-B.wheel-seek",
	"function-B.wheel-seek.adjustment-amount",
	"function-B.wheel-seek.dummy",
	"function-B.notthing.notthing"
]);