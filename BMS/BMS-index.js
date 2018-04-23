	var map = new BMap.Map("allmap");    // 创建Map实例
	map.centerAndZoom("西安",15);  // 初始化地图的默认区域为西安市，并设置地图的级别。

	//给搜索框的按钮绑定一个点击事件
	//当点击时，根据搜索框内的地点展示该地地点附近的位置信息
	$('#search-click').click(function(){
		var $site = $('#search-keywords').val();
		var local = new BMap.LocalSearch(map, {
		renderOptions:{map: map}
		});
		local.search($site);
		//向后台发送请求，将车辆信息展示在地图上
		$.ajax({
			type:'post',
			url:'',
			data:$site,
			success : function (data) {
                        var bikeList = jQuery.parseJSON(data);
                        for(var i=0;i<bikeList.length;i++){
                            console.log(bikeList[i]);
                            //可能需要手动更改一下图标的路径
                            var myIcon = new BMap.Icon("/static/img/map_bike.png", new BMap.Size(50, 50)); //更换图标
                            var point = new BMap.Point(bikeList[i].bikeLongitude,bikeList[i].bikeLatitude);
                            var marker = new BMap.Marker(point,{
                                icon:myIcon
                            });
                            map.addOverlay(marker)
                        }
                    },
                    error : function () {
                        console.log('getBikeLocation error')
                    }
		})

	})

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
				lat:$lat,
			},
			success:function(data){
				if(data=='ok'){
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

	//默认显示模态框，方便测试。测试完之后删除。
	$('#add').modal('show');
	$('#modify').modal('show');
	
	
	