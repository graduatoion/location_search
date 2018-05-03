#!/bin/bash

UWSGI_INI="myweb_uwsgi.ini"
STATIC_ROOT=$(cat location_search/settings.py|grep STATIC_ROOT | cut -d ' ' -f 3 | sed 's/"//g')

#删除之前的静态文件
rm -rf -v $STATIC_ROOT/*
#部署当前的静态文件
python ./manager.py collectstatic
#关闭当前的uwsgi服务
killall -9 uwsgi
#运行uwsgi服务
uwsgi_nums=$(ps aux|grep uwsgi | grep -v "grep" | wc -l)
if [ $uwsgi_nums -eq 0 ];then
    uwsgi ./${UWSGI_INI} 2&>1 /dev/null
else
	echo "uwsgi already exist"
fi


