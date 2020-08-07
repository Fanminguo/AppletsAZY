Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
	 
	},
  
	/**
	 * 组件的初始数据
	 */
	data: {
	  
	},
  
	/**
	 * 组件的方法列表
	 */
	methods: {
		addInfo(){
		  console.log(11)
		  let item = {title:'测试',money:8,category:'吃饭'}//要传给父组件的参数
		  this.triggerEvent('addInfo',item)//通过triggerEvent将参数传给父组件
		// this.onload()
	  }
	},
	
  })