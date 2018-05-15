# -*- coding:UTF-8 -*-
from django.contrib import admin
from main_site.models import bikeData, bikeLocation, userInfomation, userTravel, travelDetail

admin.site.site_header = '基于移动互联网的位置跟踪系统--管理员端'
admin.site.site_title = '后台数据管理系统'
@admin.register(userInfomation)
class userInfoAdmin(admin.ModelAdmin):
    list_display = ('userId', 'password', 'userSex', 'creditLevel')
    fields = ('userId', 'password', 'userSex', 'creditLevel')


# Register your models here.
@admin.register(bikeData)
class bikeDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'bikeIp', 'bikeStatus', 'bikePort')


@admin.register(bikeLocation)
class bikeLocationAdmin(admin.ModelAdmin):
    list_display = ('bikeId', 'bikeLongitude', 'bikeLatitude')  # 将表项以表格的形式展示出来，传递的参数是每一行中显示的列
    fields = ('bikeId', ('bikeLongitude', 'bikeLatitude'))  # 用来定义修改每个表项的页面
    list_display_links = ('bikeId',)  # 选择"list_display"哪个项目可以点击进入修改界面,默认是第一个索引
    list_editable = (
        'bikeLongitude', 'bikeLatitude',)  # 可以直接在表项的目录中对数据进行修改，注意的是，某列不能同时出现在list_display_lists与link_editable同时出现
    list_filter = ('bikeLongitude', 'bikeLatitude',)
    save_as = True
    save_as_continue = True
    # list_display_links = None
    # exclude = ('bikeId',) #在修改界面中排除选中的列

    # actions_selection_counter = False  被选中选项的个数
    # actions_on_bottom = True 动作菜单放置的位置
    # actions_on_top = False


@admin.register(userTravel)
class userTravelAdmin(admin.ModelAdmin):
    list_display = ('userId', 'travelId', 'bikeId', 'openDate', 'openTime', 'endTime', 'lockStatus')
    fields = ('userId', 'bikeId', 'endTime', 'lockStatus')


@admin.register(travelDetail)
class tarvelDetialAdmin(admin.ModelAdmin):
    list_display = ('detailId', 'travelId', 'timeStamp', 'lon', 'lat')




