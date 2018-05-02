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
let point_l = [];

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
             walking.setMarkersSetCallback(function (data) {
                    map.removeOverlay(data[0].marker);
                    map.removeOverlay(data[1].marker)
                })
        }
        console.log('bike history point: ' + point_list.length);
    }).then(function () {
        let start = new BMap.Point(point_list[0].lng,point_list[0].lat);
        let end = new BMap.Point(point_list[point_list.length-1].lng,point_list[point_list.length-1].lat);
        let startIcon = new BMap.Icon("/static/img/start_point.png", new BMap.Size(50, 50)); //更换图标
        let endIcon = new BMap.Icon("/static/img/end_point.png", new BMap.Size(50,50));

        let s_marker = new BMap.Marker(start,{
            icon:startIcon
        });
        let e_marker = new BMap.Marker(end,{
            icon:endIcon
        });

        map.addOverlay(s_marker);
        map.addOverlay(e_marker);
        console.log(e_marker);
        console.log('test')

    })
});
