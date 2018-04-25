/*
* @Author: Administrator
* @Date:   2018-04-19 15:52:28
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-19 15:58:15
*/
var bikeId = getQueryString('bikeId');
var tripId = getQueryString('tripId');
var startTime = getQueryString('startTime');
var cycling_time = getQueryString('cycling_time');
var startDate = getQueryString('startDate');


function getQueryString(name) {
var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
var r = window.location.search.substr(1).match(reg);
if (r != null) return unescape(r[2]); return null;
}

function getBikePoint(point_list){

	var p = $.ajax({
		type:'POST',
		url:'/main/getBikeHistoryPoint/',
		data:{
			'tripId':tripId
		},
		success:function (data) {
			var location_list = $.parseJSON(data);
			for(var i=0;i<location_list.length;i++){
                var p = new BMap.Point(location_list[i][0],location_list[i][1]);
                point_list.push(p);
            }
        },
        error:function (e) {
			console.log("getBikeHistoryPoint : "+e);
        }


	});
    return p;

}
$(document).ready(function () {
	var map = new BMap.Map("map-detail");    // 创建Map实例
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
    var point_list = [];

	console.log(startDate);
	$('#bike-id').text(bikeId);
	$('#start-time').text(startTime);
	$('#cycling-time').text(cycling_time);
	$('#current-time').text(startDate);
	var p = getBikePoint(point_list);
    p.then(function () {
        console.log(point_list);
        var i;
        var saving_walking = [];
        for(i=0;i<point_list.length-1;i++){
            var walking = new BMap.WalkingRoute(map,{renderOptions:{map:map,autoViewPort:true}});
            walking.search(point_list[i],point_list[i+1]);
            if(i !== 0 || i !== point_list.length-2){
                saving_walking.push(walking)
            }
        }
        console.log(saving_walking)
    })
});
