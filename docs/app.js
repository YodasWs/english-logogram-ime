"use strict";(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:false};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.loaded=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.p="";return __webpack_require__(0)})([function(module,exports,__webpack_require__){module.exports=__webpack_require__(1)},function(module,exports,__webpack_require__){var modules=["ngRoute"];var dict={};Object.assign(dict,__webpack_require__(2));angular.module("EnglishLogogramIME",modules).config(["$locationProvider","$routeProvider",function($locationProvider,$routeProvider){$locationProvider.html5Mode(false);$routeProvider.when("/",{templateUrl:"pages/home.html",controllerAs:"$ctrl",controller:function controller(){angular.element("[ng-view]").attr("ng-view","pageHome");var $list=$("#composition");function updateCompBox(word){$list.empty();if(!word||typeof word!=="string")return;dictStartWith(word.toLowerCase()).forEach(function(word){$list.append("<li>"+word)})}document.querySelectorAll("textarea").forEach(function(textarea){var composing={start:false,is:false};textarea.addEventListener("input",function(e){if(e.isComposing)composing.is=e.isComposing;var re=/\b[a-z']+$/i,lastWord=void 0;var end=re.exec(e.target.value);if(Array.isArray(end)){lastWord=end[0].toLowerCase()}switch(e.inputType){case"insertText":if(e.data.match(/\s/)){$list.empty();if(composing.is){re=new RegExp("([a-z']+)"+e.data+"$","i");console.log("re:",re);end=re.exec(e.target.value);console.log("'"+e.target.value+"'");console.log("end:",end);if(Array.isArray(end)){lastWord=end[1].toLowerCase();console.log(lastWord);if(dict[lastWord]){console.log("dict:",dict[lastWord]);e.target.value=e.target.value.replace(re,""+dict[lastWord]+e.data)}}}composing.is=false}else if(isLetter(e.data)||e.data==="'"){if(!composing.is){composing.start=end.index}composing.is=true;updateCompBox(lastWord)}else if(isNumeric(e.data)){}break;case"insertLineBreak":composing.is=false;break;case"deleteContentBackward":if(composing.is){if(e.target.value.length<=composing.start){$list.empty()}else{updateCompBox(lastWord)}}break;default:console.log(e);}},false)})}}).otherwise({redirectTo:"/"})}]);function isLetter(c){return c.toLowerCase()!==c.toUpperCase()}function isNumeric(c){return isFinite(c)}function dictStartWith(word){word=word.toLowerCase();var list=[];for(var i in dict){if(i.startsWith(word))list.push(dict[i])}return list.unique()}Array.prototype.unique=function(){var _this=this;return this.filter(function(val,i){return _this.indexOf(val)===i})}},function(module,exports){module.exports={"i":"\u6211","me":"\u6211","my":"\u6211\u7684","mine":"\u6211\u7684","you":"\u4F60","your":"\u4F60\u7684","yours":"\u4F60\u7684","he":"\u4ED6","him":"\u4ED6","his":"\u4ED6\u7684","she":"\u5979","her":"\u5979","hers":"\u5979\u7684","it":"\u5B83","its":"\u5B83\u7684","we":"\u6211\u4EEC","us":"\u6211\u4EEC","our":"\u6211\u4EEC\u7684","ours":"\u6211\u4EEC\u7684","they":"\u4ED6\u4EEC","them":"\u4ED6\u4EEC","their":"\u4ED6\u4EEC\u7684","theirs":"\u4ED6\u4EEC\u7684"}}]);