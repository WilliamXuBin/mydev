//数组去重-一般数组
Array.prototype.remove_arr = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
	this.splice(index, 1);
	}
};

//判断是否有重复
Array.prototype.isArrLike = function(){
	var _this = this;
	var sign = false;
	_this.forEach(function(el,index){
		if(index === _this.length)return;
		var str1 = JSON.stringify(el);
		var str2 = JSON.stringify(_this[index+1]);
		if(str1 === str2)sign=true;
	});
    return sign ;
}

//数组去空
Array.prototype.notempty = function(){
	var array = this;
	for(var i = 0 ;i<array.length;i++){

		if($.trim(array[i]) == "" || typeof(array[i]) == "undefined"){
			array.splice(i,1);
			i= i-1;
		}
	}
	return array;
}

//数组删除
Array.prototype.removeByValue = function(val) {
	if(typeof val === "object"){
		var _this = [];
		this.forEach(function(el,index){
			_this.push(JSON.stringify(el));
		});

		var index=_this.indexOf(JSON.stringify(val)); 
		this.splice(index,1); 
		return this;
	}else{
		for(var i=0; i<this.length; i++) {
		  if(this[i] == val) {
		    this.splice(i, 1);
		    break;
		  }
		}
		return this;
	}
}