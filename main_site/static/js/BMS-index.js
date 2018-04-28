	var map = new BMap.Map("allmap");    // 创建Map实例
	map.centerAndZoom("西安",15);  // 初始化地图的默认区域为西安市，并设置地图的级别。
	map.enableScrollWheelZoom(); //启用使用滚轮对地图大小进行缩放
    var marker_test = null;
	var viewRange = {
                lng_left:0,
                lng_right:360,
                lat_left:0,
                lat_right:360
            };
	function configBike() {
	    marker_test = this;
	    var bike_id = this.V.title;
	    var lat = this.point.lat;
	    var lon = this.point.lng;
	    $('#modify-id').val(bike_id);
	    $('#bike-longitude').val(lon);
	    $('#bike-latitude').val(lat);
	    $('#modify').modal('show');
        $('#sure-delete').click(function () {
        var p =$.ajax({
                type:'POST',
                data:{
                    'bikeId':bike_id
                },
                url:'/main/removeBikeLocation/',
                success:function (data) {
                    console.log(`remove Bike info ${data}`);
                    if(data === 'ok'){
                        console.log('test');
                        map.removeOverlay(marker_test)
                    }
                    else{
                        console.log('remove bike location error')
                    }
                },
                error:function (error) {
                    console.log('removeBikeLocation error : ');
                    console.log(error)
                }

            });
        p.then(function () {
            $('#modify').modal('hide');
        });
        });
        $('#sure-modify').click(function () {
            var lat = $('#bike-latitude').val();
            var lon = $('#bike-longitude').val();
            $.ajax({
                type:'POST',
                data:{
                    "id":bike_id,
                    "lat":lat,
                    "lon":lon
                },
                url: '/main/updateBikeLocation/',
                success: function (data) {
                    if(data === 'ok'){
                        alert('修改成功');
                    }
                    else if(data === 'no'){

                        alert('与库中数据一致，未修改')

                    }
                },
                error:function () {
                    console.log('updateBikeLocation error')
                }
            })
        });
    }
 	function getViewRange(callBack){
                var range = map.getBounds();//获取地图的可视区域
                var sw = range.getSouthWest();//获取左下角（西南）
                var ne = range.getNorthEast();//获取右上角（东北）
                viewRange.lat_left = sw.lat;
                viewRange.lat_right = ne.lat;
                viewRange.lng_left = sw.lng;
                viewRange.lng_right = ne.lng;
                console.log(viewRange);
                callBack()
	}
	function getBikeLocation(){

                $.ajax({
                    type:'POST',
                    url:'/main/getBikeLatLng',
                    data:{
                        "lon_left":viewRange.lng_left,
                        "lon_right":viewRange.lng_right,
                        "lat_left":viewRange.lat_left,
                        "lat_right":viewRange.lat_right
                    },
                    success : function (data) {
                        var bikeList = jQuery.parseJSON(data);
                        console.log(bikeList);
                        for(var i=0;i<bikeList.length;i++){
                            console.log(bikeList[i]);
                            var myIcon = new BMap.Icon("/static/img/map_bike.png", new BMap.Size(50, 50)); //更换图标
                            var point = new BMap.Point(bikeList[i].bikeLongitude,bikeList[i].bikeLatitude);

                            var marker = new BMap.Marker(point,{
                                icon:myIcon,
                                title:bikeList[i].bikeId
                            });
                            marker.addEventListener("click",configBike);
                            map.addOverlay(marker)
                        }
                    },
                    error : function () {
                        console.log('getBikeLocation error')
                    }
                })

	}
	function success() {
			console.log('change ok');
        }

	//给搜索框的按钮绑定一个点击事件
	//当点击时，根据搜索框内的地点展示该地地点附近的位置信息
	$('#search-click').click(function(){
		var $site = $('#search-keywords').val();
		var local = new BMap.LocalSearch(map, {
		renderOptions:{map: map}
		});
		local.search($site);
		local.setMarkersSetCallback(function () {
				console.log('finished');
				setTimeout(function () {
				getViewRange(getBikeLocation);
				map.clearOverlays();
            },2000);
        });
		//向后台发送请求，将车辆信息展示在地图上


	});

	//监听整个地图区域的点击事件
	map.addEventListener('click',function(e){
		//点击获取点击位置的经纬度
		var $lng = e.point.lng;
		var $lat = e.point.lat;
		console.log(e.point.lng + ", " + e.point.lat);
		//向后台请求数据，判断当前的点击位置是否存在车辆
		$.ajax({
			type:'post',
			url:'',
			data:{
				lng:$lng,
				lat:$lat
			},
			success:function(data){
				if(data==='ok'){
					//当点击有车辆的位置时，可以对车辆的信息进行修改和删除
					$('#modify').modal('show');//弹出一个修改车辆信息的模态框

					//当点击模态框里的"确定"按钮时，把修改的信息发送给后台并把修改之后的车辆信息显示在页面上。
					$('#sure-modify').click(function(){
						var $modifyId = $('#modify-id').val();
						var $bikeLongitude = $('#bike-longitude').val();
						var $bikeLatitude = $('#bike-latitude').val();
						console.log($modifyId);
						console.log($bikeLongitude);
						console.log($bikeLatitude);
						//把修改的信息发送给后台
						$.ajax({
							method: 'post',
							url: '',
							data:{
								id:$modifyId,
								lng:$bikeLongitude,
								lat:$bikeLatitude
							},
							success:function(data){
								//把该标注显示在页面上
								var bikeList = jQuery.parseJSON(data);
                				for(var i=0;i<bikeList.length;i++){
                   				 	console.log(bikeList[i]);
                    			 	var myIcon = new BMap.Icon("/static/img/map_bike.png", new BMap.Size(50, 50)); //更换图标
                    			 	var point = new BMap.Point(bikeList[i].bikeLongitude,bikeList[i].bikeLatitude);
                    			 	var marker = new BMap.Marker(point,{
                        				icon:myIcon
                    				});
                    				map.addOverlay(marker)
                				}
							},
							error:function(){
								console.log(error);
							}
						})

					});
					//当点击模态框里的"删除"按钮时，删除当前标注，并把删除信息发送给后台
					$('#sure-delete').click(function(){
						var $modifyId = $('#modify-id').val();
						$.ajax({
							method:'post',
							data:$modifyId,
							url:'',
							success:function(data){
								//移除标注
								var pointMarkup = new BMap.Point(lng,lat);
								map.removeOverlay(pointMarkup);
							},
							error:function(){
								console.log(error);
							}
						})
					})

				}
				//没有车辆信息的地图区域
				if(data=='no'){
					//当点击没有车辆信息的地图区域时，可以添加车辆的位置信息
					$('#add').modal('show');//弹出一个添加车辆信息的模态框
					var $bikeId =$('#bike-id').val();
					//当点击模态框里的"确定"按钮时，把添加的信息发送给后台。
					$('#sure-add').click(function(){
						var $bikeId =$('#bike-id').val();
						console.log($bikeId);
						$.ajax({
							method: 'post',
							url: '',
							data:{
								id:$bikeId,
								lng:$lng,
								lat:$lat
							},
							success:function(data){
							//把该标注显示在页面上
							var bikeList = jQuery.parseJSON(data);
                				for(var i=0;i<bikeList.length;i++){
                   				 	console.log(bikeList[i]);
                    			 	var myIcon = new BMap.Icon("/static/img/map_bike.png", new BMap.Size(50, 50)); //更换图标
                    			 	var point = new BMap.Point(bikeList[i].bikeLongitude,bikeList[i].bikeLatitude);
                    			 	var marker = new BMap.Marker(point,{
                        				icon:myIcon
                    				});
                    				map.addOverlay(marker)
                				}
							},
							error:function(){
								console.log(error);
							}
						})
					})
				}
			},
			error:function(){
				console.log('error');
			}
		})
		
	});


	$(document).ready(function () {
	    var username = null;
	    $.ajax({
            type:'GET',
            url:'/main/getAdminUserName/',
            success:function (data) {
                username = data;
        		document.getElementById('username').innerHTML=username;
            },
            error:function (error) {
                console.log('getAdminUserName : ');
                console.log(error)
            }

        });
	    document.getElementById('exit').addEventListener('click',function () {
            var issuccess = false;
		    var p = $.ajax({
                type:'GET',
                url:'/main/exitBMS/',
                success:function (data) {
                    console.log('exit status ' +data);
                    if(data === 'ok'){
                        issuccess = true
                    }

                },
                error:function (error) {
                  console.log('exitBMS : ');
                  console.log(error)
                }

                }
            );

            p.then(function () {
                if(issuccess){
                    console.log('test');
                    window.location.href='/graphAdmin/'
                }

            })
        });


		//默认显示模态框，方便测试。测试完之后删除。
		$('#add').modal('show');
		//$('#modify').modal('show');
    });

	
	
	