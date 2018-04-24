/*
* @Author: Administrator
* @Date:   2018-03-12 15:27:01
* @Last Modified by:   sivartTravis
* @Last Modified time: 2018-03-26 16:30:30
*/

    //登陆部分的JavaScript代码
    $(document).ready(function(){

        //点击登陆按钮，判断账号和密码是否匹配
        $('#login-submit').click(function(){
            var $phoneId = $('#phoneId').val();
            var $password = $('#password').val();
            $.ajax({
                type: 'post',
                url: '/main/login/',
                data:{
                    'phoneId':$phoneId,
                    'password':$password
                },
                success:function(data){
                    //侧边栏显示手机号信息
                    if (data ==="no") {
                        //提示手机号或密码错误
                        $('#tip-login').text('手机号或密码错误').show();
                            setTimeout(function(){
                                $('#tip-login').hide();
                            },2000);
                    };
                    if(data =="ok"){
                        //$('#login-register').text($phoneId);
                        isLogin = true;
                        $('#tip-login').text('登陆成功').show();
                        setTimeout(function(){
                            $('#tip-login').hide();
                        },2000);
                        //跳转到主界面
                        $('#shade-login').hide();
                        $('#host-interface').show();
                        $('#login-register').text($phoneId);

                    }
                    
                }
            })
        });
        //判断输入框的值是否为空字符串，若是，给出提示。
        $('#phoneId').blur(function(){
            var $phoneId = $('#phoneId').val();
            console.log($phoneId);
            if($phoneId===''){
                $('#tip-phone').show();
                setTimeout(function(){
                    $('#tip-phone').hide();
                },2000);
            }
            
        });
        $('#password').blur(function(){
            var $password = $('#password').val();
            if($password===''){
                $('#tip-password').show();
                setTimeout(function(){
                    $('#tip-password').hide();
                },2000);
            }
        });


        //注册部分javascript代码
        //验证注册的phoneId是否是一个合法的电话号码
        $('#phoneid-register').on('blur',function(){
            var $phoneId = $(this).val();
            var req = /^1[34578]\d{9}/g;
            var result = req.test($phoneId);
            if (!result) {
                $(this).val('');
                $('#tip-phone-reg').show();
                setTimeout(function(){
                        $('#tip-phone-reg').hide();
                },2000);
            }


        });
        //验证密码是否由8位数字和字母组成，若不是，给出提示信息
        $('#password-register').on('blur',function(){
            var $password = $(this).val();
            var req = /^[\w]{8}$/g;
            var result = req.test($password);
            if (!result) {
                $(this).val('');
                $('#tip-password-reg').show();
                setTimeout(function(){
                        $('#tip-password-reg').hide();
                },2000);
            }


        });
        //验证确认密码是否和之前密码一致，若不一致，给出提示信息
        $('#sure-password').on('blur',function(){
            var $password = $('#password-register').val();
            var $sure = $('#sure-password').val();
            if($password!=$sure){
                $(this).val('');
                $('#tip-password-sure').show();
                setTimeout(function(){
                        $('#tip-password-sure').hide();
                },2000);
            }
        });
        //将注册信息提交给后台
        $('#register-submit').on('click',function(){
            var $phoneId = $('#phoneid-register').val();
            var $password = $('#password-register').val();
            console.log($phoneId+'__'+$password);
            $.ajax({
                type: 'post',
                url: '/main/signUp/',
                data:{
                    'phoneId':$phoneId,
                    'password':$password
                },
                success: function(data){
                    if (data==="ok") {
                        //提示注册成功，提示登录
                        $('#tip-register').text('注册成功').show();
                        $('#tip-register').show();
                            setTimeout(function(){
                                $('#tip-register').hide();
                            },2000);
                    };
                    if(data==="no"){
                        //提示注册失败
                        $('#tip-register').text('注册失败').show();
                            setTimeout(function(){
                                $('#tip-register').hide();
                            },2000);
                    }
                }
            })

        });

		//注册和登录模块的回退功能
        $('#cancel-register').on('click',function(){
                $('#shade-register').hide();
        });
        $('#cancel-login').on('click',function(){
                $('#shade-login').hide();
        });

        var isLogin = false;
    //判断登陆状态
    $.ajax({
        type:'get',
        url:'/main/isLogin/',
        success : function(data){
            if(data=="ok"){
                    isLogin = true;
                    //显示用户昵称
                    $.ajax({
                    type:'get',
                    url:'/main/getPhoneId/',
                    success:function(data){
                            $('#login-register').text(data);
                         }
                    });
            }
        }});
        //扫码功能

        $('#scan-code').one('click',function () {
            if(isLogin){
                window.location.href="/main/scanQr/";
                //进行扫码操作
            }else{
                //跳转到登录页面
                $('host-interface').hide();
                $('#shade-login').show();
            }
        });
        // $('#scan-code').click(function(){
        //     if(isLogin){
        //         window.location.href="/main/scanQr/";
        //         //进行扫码操作
        //     }else{
        //         //跳转到登录页面
        //         $('host-interface').hide();
        //         $('#shade-login').show();
        //     }
        // });
        //退出登录
        $('#log-off').click(function(){
            $.ajax({
                type:'get',
                url:'/main/logOut/',
                success:function(data){
                    isLogin = false;
                    $('#login-register').text('注册登录');
                }
            })
        })

    });
