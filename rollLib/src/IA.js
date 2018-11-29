const a = "EXTERNAL A";
const b = function(){
	return "I AM IA";
}();
const test = a + b + "CIAO";
console.log(test);

export default function (){
	return b + a;
}