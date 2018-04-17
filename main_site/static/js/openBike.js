/*
* @Author: Administrator
* @Date:   2018-04-14 15:06:26
* @Last Modified by:   sivartTravis
* @Last Modified time: 2018-04-14 17:46:28
*/

$(document).ready(function(){
    is_openBike = true;
	//扫码成功之后进入到openBike界面，判断开锁状态
    //若开锁成功，则隐藏掉开锁动画，并显示运行中，若开锁失败，则显示开锁失败。
    $.ajax({
    	method: 'get',
        url: '/main/checkBikeStatus/',
        success:function(data){
    		console.log(data);
        if (data === 'unlock') {
             $('#loading-image').css('display','none');
             $('#loading-infor').text('骑行中...( ﹡ˆoˆ﹡ )');
        	}
        if(data === 'lock'){
             $('#loading-infor').text('开锁失败-(╥_╥)');
        	}
        },
        error:function(){
            console.log(error);
        }
    });
    document.querySelector("#close_bike").addEventListener('click', closeBike);


         
});
function closeBike() {
    var issuccess=true;
    var p =$.ajax({
        method: 'get',
        url :"/main/closeBike/",
        success: function (data) {
            if(data === "yes"){

                console.log("end travel")
            }
            else{
                issuccess = false;
                console.log("end error")
            }
        },
        error:function (e) {
            issuccess = false;
            console.log(e)
        }
    });
    p.then(function () {
        if(issuccess){
            window.location.href="/main/test/";
        }
    })

}

//根据session中缓存的bike_id信息，向后端请求当前开锁单车的经纬度，并聚焦到单车的位置
function zoomSelectBike() {

    var p = $.ajax({
        method: 'get',
        url: '/main/getBikeLocationByid/',
        success: function (data) {
            var location_list = jQuery.parseJSON(data);
            //map.centerAndZoom(point, 20);
            var lat = location_list[0];
            var lon = location_list[1];
            var point = new BMap.Point(lon, lat);
            map.centerAndZoom(point, 20);
            var myIcon = new BMap.Icon("/static/img/map_bike.png", new BMap.Size(50, 50));
            var marker = new BMap.Marker(point,{
                icon:myIcon
            });
            map.addOverlay(marker)
        },
        error: function () {
            console.log(error);
        }

    });

}

