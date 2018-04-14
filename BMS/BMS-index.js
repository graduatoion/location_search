/*
* @Author: Administrator
* @Date:   2018-04-14 16:17:08
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-14 20:47:39
*/
	var map = new BMap.Map("allmap");    // 创建Map实例
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别


	//给搜索框的按钮绑定一个点击事件，
	//当点击时，根据搜索框内的地点展示该地地点附近的位置信息
	//并向后台发送请求，将车辆信息展示在地图上
	//给地图上的每一个车辆动态绑定一个点击事件，当点击时，弹出一个矩形框，可以对车辆的信息进行修改和删除         
	$('#search-click').addEventListener('click',function(){
		var  site = $('#search-keywords').value();

	})

	//给添加车辆的点击按钮绑定点击事件，当点击的时候，会弹出矩形框（包括将要添加车辆的id和bikeIp，以及添加的位置）

	