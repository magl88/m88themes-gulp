"use strict";
var user = {}; // Пользователь
user.name = 'Иван';
user.age = 27;
user['birthday'] = '13.11.1988';
console.log("good 5656");
var arr = [2,'name',true, user];
console.log("Вывод типов элементов массива через switch");
for(var c = 0; c <= arr.length -1; c++){
	switch(arr){
		case (typeof arr[c] == 'number'):
			console.log(arr[c] + ' = Number');
			break;
		case 'string':
			console.log(arr[c] + ' = String');
			break;
		case 'boolean':
			console.log(arr[c] + ' = Boolean');
			break;
		case 'object':
			console.log(arr[c] + ' = Object');
			break;
		default:
			console.log(arr[c] + ' =ddd ' + typeof(arr[c]));
	}
}
