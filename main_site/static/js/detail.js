/*
* @Author: Administrator
* @Date:   2018-04-19 15:52:28
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-19 15:58:15
*/
function getQueryString(name) {
var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
var r = window.location.search.substr(1).match(reg);
if (r != null) return unescape(r[2]); return null;

}
$(document).ready(function () {
	var map = new BMap.Map("map-detail");    // 创建Map实例
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
	var bikeId = getQueryString('bikeId');
	var tripId = getQueryString('tripId');
	var startTime = getQueryString('startTime');
	var cycling_time = getQueryString('cycling_time');
	var startDate = getQueryString('startDate');

	console.log(startDate);
	$('#bike-id').text(bikeId);
	$('#start-time').text(startTime);
	$('#cycling-time').text(cycling_time);
	$('#current-time').text(startDate);

}
);

