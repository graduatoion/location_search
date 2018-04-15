/*
* @Author: Administrator
* @Date:   2018-04-14 15:06:26
* @Last Modified by:   sivartTravis
* @Last Modified time: 2018-04-14 17:46:28
*/

$(document).ready(function(){
	//扫码成功之后进入到openBike界面，判断开锁状态
    //若开锁成功，则隐藏掉开锁动画，并显示运行中，若开锁失败，则显示开锁失败。
    $.ajax({
    	method: 'get',
        url: '',
        success:function(data){
        if (data = 'ok') {
             $('#loading-image').css('display','none');
             $('#loading-infor').text('骑行中...( ﹡ˆoˆ﹡ )');
        	};
        if(data = 'no'){
             $('#loading-infor').text('开锁失败-(╥_╥)');
        	}
        },
        error:function(){
            console.log(error);
        }
    })

	//请求当前车辆的位置,放大所获取位置附近的地图。
	function showInfo(point){
		$.ajax({
		type: get,
		url: '',
		success:function(data){
			map.centerAndZoom(point, 20);
		}
		error:function(){
			console.log(error);
		}

	})
		
	}
	map.addEventListener("click", showInfo);

         
})