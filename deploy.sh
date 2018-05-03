#!/bin/bash

UWSGI_INI="myweb_uwsgi.ini"
STATIC_ROOT=$(cat location_search/settings.py|grep STATIC_ROOT | cut -d ' ' -f 3 | sed 's/"//g')

#删除之前的静态文件
rm -rf -v $STATIC_ROOT/*
#部署当前的静态文件
python ./manager.py collectstatic
#运行uwsgi服务
uwsgi ./${UWSGI_INI}


