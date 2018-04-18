var map = null;
var is_openBike = false;
    
    var currentPoint = {
                latAndLong: [116.404, 39.915],
                name: "这是默认的位置"
            };
            var viewRange = {
                lng_left:0,
                lng_right:360,
                lat_left:0,
                lat_right:360
            };
            //在地图中心设置标注点
            var pos_left = $(window).width()/2-28;
            var pos_top = ($(window).height()-64)/2-28;
            $('#mark').css({
                top:pos_top,
                left:pos_left
            });

            //点击用户图标出现侧栏
            $('#user').click(function(){
                $('#user-centered').fadeIn('slow');
            });
            $('#back').click(function(){
                $('#user-centered').fadeOut('slow');
            })

            //注册登录页面的显示和隐藏
            $('#login-register').bind('click',function(){
                $('#user-centered').fadeOut('slow');
                $('#shade-login').fadeIn('slow');
                
            });
            $('#login-entrance').bind('click',function(){
                $('#shade-login').show();
                $('#shade-register').hide();
            });
            $('#register-entrance').bind('click',function(){
                $('#shade-register').show();
                $('#shade-login').hide();
            })
            //使用谷歌原生api获取地理位置信息
            function getLocation_useGeo(callBack){
                if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var lat = position.coords.latitude; //纬度
                        var lng = position.coords.longitude; //经度
                        console.log(lat+lng+'test2');
                        var gpsPoint = new BMap.Point(lng, lat);
                        var convertor = new BMap.Convertor();
                        var pointArr = [];
                        pointArr.push(gpsPoint);
                        convertor.translate(pointArr, 1, 5, function (data) {

                        currentPoint.latAndLong = (data.points[0].lng + ',' + data.points[0].lat).split(',');
                        console.log('before callback');
                        callBack();

                    });
                    },function (e) {
                        console.log(e);
                        getLocation_useBaiDuApi(mapCreate);
                        document.querySelector(".btn-get").removeEventListener('click',geoRelocate);
                        document.querySelector(".btn-get").addEventListener('click', baiduRelocate);
                    });
                }
                else{
                    alert('不支持谷歌原生定位api')
                }
            }
            //使用百度api获取地理位置信息（但是获取位置不准确）
            function getLocation_useBaiDuApi(callBack) {
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    var gpsPoint = new BMap.Point(r.point.lng, r.point.lat);
                    var convertor = new BMap.Convertor();
                    var pointArr = [];
                    pointArr.push(gpsPoint);
                    //坐标转化（非百度坐标转换成百度坐标）
                    convertor.translate(pointArr, 1, 5, function (data) {
                        currentPoint.latAndLong = (data.points[0].lng + ',' + data.points[0].lat).split(',')
                        callBack();
                    });

                }
                else {
                    alert('failed'+this.getStatus());
                }
            });
            }

            function mapCreate() {

                map = new BMap.Map("showmap");
                console.log("map info: ");
                console.log(map);
                var point = new BMap.Point(currentPoint.latAndLong[0], currentPoint.latAndLong[1]);
                map.centerAndZoom(point ,14);
                map.enableScrollWheelZoom(true);
                var myIcon = new BMap.Icon("/static/img/peoicon.png", new BMap.Size(30, 30)); //更换图标
                var marker = new BMap.Marker(point, {
                    icon: myIcon
                }); // 创建标注
                map.addOverlay(marker); // 将标注添加到地图中(此标注即为当前位置)
                getViewRange(function () {
                    var point = new BMap.Point(117.950,41.000);
                    var myIcon = new BMap.Icon("/static/peoicon.png", new BMap.Size(30, 30)); //更换图标
                    var marker = new BMap.Marker(point,{
                        icon : myIcon
                    });
                    map.addOverlay(marker)
                });
                if(is_openBike){
                    zoomSelectBike();
                }
                getViewRange(getBikeLocation)
            }
            function reLocate(){
                map.clearOverlays();
                var point = new BMap.Point(currentPoint.latAndLong[0], currentPoint.latAndLong[1]);
                var myIcon = new BMap.Icon("/static/img/peoicon.png", new BMap.Size(30, 30)); //更换图标#}
                var marker = new BMap.Marker(point, {
                    icon: myIcon
                }); // 创建标注
                map.addOverlay(marker); // 将标注添加到地图中
                map.centerAndZoom(point,15);
                map.panTo(point);
                getViewRange(getBikeLocation);
                console.log('call reLocate end')
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
                    error : function () {
                        console.log('getBikeLocation error')
                    }
                })

            }
            function geoRelocate(){
                console.log('google reLocate');
                getLocation_useGeo(reLocate);
            }
            function baiduRelocate(){
                console.log('baidu reLocate');
                getLocation_useBaiDuApi(reLocate);

            }
         $(document).ready(function() {

<<<<<<< HEAD
         console.log("create");

         getLocation_useGeo(mapCreate);
         document.querySelector(".btn-get").addEventListener('click', geoRelocate);
=======

             console.log("create");


             mapPageProcess = getLocation_useGeo(mapCreate);
             document.querySelector(".btn-get").addEventListener('click', geoRelocate);
>>>>>>> 7e54d927e13898f580776f789bc3098a7774f439

             //滑动屏幕时动态请求车辆的位置
             document.getElementById('showmap').addEventListener('touchmove', function (e) {
                 console.log('touching');
                 getViewRange(getBikeLocation);

<<<<<<< HEAD
})
=======
             })
         });

>>>>>>> 7e54d927e13898f580776f789bc3098a7774f439
         

         

