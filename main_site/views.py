# coding=utf-8
from django.shortcuts import render, render_to_response, HttpResponse
from django.utils.timezone import now

from main_site.models import bikeLocation, userInfomation, bikeData, userTravel, travelDetail
import datetime
import json
import re
from main_site import common
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from location_search.settings import SECRET_KEY


def test_sign(request):
    return render_to_response('test_sign.html')


# Create your views here.
# phoneId password

# ok is login yes,no is format error or user/password not match
def login(request):
    if request.method == 'POST':
        phoneId = request.POST.get('phoneId')
        password = request.POST.get('password')

        isMatch = common.commonObj.phoneIdRe.match(phoneId)
        if not isMatch:
            return HttpResponse('no')

        data = userInfomation.objects.filter(userId=phoneId, password=password)

        if data:
            request.session['isLogin'] = True
            request.session['phoneId'] = phoneId
            return HttpResponse('ok')
        else:
            return HttpResponse('no')


# ok is signup ok , no is phoneId exist or phoneId format error
def signUp(request):
    if request.method == 'POST':
        phoneId = request.POST.get('phoneId')
        password = request.POST.get('password')

        isMatch = common.commonObj.phoneIdRe.match(phoneId)
        if not isMatch:
            return HttpResponse('no')

        data = userInfomation.objects.filter(userId=phoneId)
        if data:

            return HttpResponse('no')
        else:

            userInfomation.objects.create(userId=phoneId, password=password)
            return HttpResponse('ok')


def main(request):
    return render_to_response('index.html')


def getBikeLatLng(request):
    if request.method == 'POST':
        lon_left = request.POST.get("lon_left")
        lon_right = request.POST.get("lon_right")
        lat_left = request.POST.get("lat_left")
        lat_right = request.POST.get("lat_right")

        data = bikeLocation.objects.filter(bikeLongitude__gt=lon_left).filter(bikeLongitude__lt=lon_right).filter(
            bikeLatitude__gt=lat_left).filter(bikeLatitude__lt=lat_right).values("bikeId", "bikeLongitude",
                                                                                 "bikeLatitude")

        d = [i for i in data]

        locationJson = json.dumps(d)
        if data:
            return HttpResponse(locationJson)
        else:

            return HttpResponse(json.dumps('no result'))

    return HttpResponse('error')


def isLogin(request):
    if request.method == 'GET':
        try:
            if request.session['isLogin']:
                return HttpResponse('ok')
        except:
            print('error')
            return HttpResponse('no')


def getPhoneId(request):
    if request.method == 'GET':
        if request.session['isLogin']:
            return HttpResponse(str(request.session['phoneId']))
        else:
            return HttpResponse('no')


def logOut(request):
    if request.method == 'GET':
        if request.session['isLogin']:

            del request.session['isLogin']
            return HttpResponse('ok')
        else:
            return HttpResponse('no')


def scanQr(request):
    if request.method == 'GET':
        return render_to_response('video/video.html')


def openBike(request):
    if request.method == 'POST':
        bike_id = request.POST.get('bike_id')
        bike_ip = ''
        bike_port = ''
        try:
            data = bikeData.objects.filter(id=bike_id)

            for i in data.values_list('bikeIp', 'bikePort'):
                bike_ip, bike_port = i

            print(bike_ip, bike_port)
        except BaseException as e:

            print ("bike data query error : {}".format(e))
            data = False
        else:
            pass

        if data:
            common.BikeInfo.openBike(port=bike_port)
            request.session['bike_id'] = bike_id
            request.session['bike_ip'] = bike_ip
            request.session['bike_port'] = bike_port
            print("bikeId : {}".format(bike_id))
            try:
                foreUserId = userInfomation.objects.get(userId=request.session['phoneId'])
                foreBikeId = bikeData.objects.get(id=request.session['bike_id'])
                createData = userTravel.objects.create(userId=foreUserId, bikeId=foreBikeId, lockStatus=True)
                foreUserTravelId = userTravel.objects.get(travelId=createData.travelId)
                bike_lon_lat = bikeLocation.objects.get(id=request.session['bike_id'])
                travelDetail.objects.create(travelId=foreUserTravelId, lon=bike_lon_lat.bikeLongitude,
                                            lat=bike_lon_lat.bikeLatitude)

                request.session['travel_id'] = createData.travelId
            except Exception as e:
                print("create userTravel info error : {}".format(e))
            return HttpResponse('yes')
        else:
            return HttpResponse('no')


def closeBike(request):
    if request.method == 'GET':
        try:
            common.BikeInfo.closeBike(port=request.session['bike_port'])

        except Exception as e:
            print("close bike error : {}".format(e))
            return HttpResponse("no")
        else:
            foreUserTravelId = userTravel.objects.get(travelId=request.session['travel_id'])
            bike_lon_lat = bikeLocation.objects.get(id=request.session['bike_id'])
            travelDetail.objects.create(travelId=foreUserTravelId,
                                        lon=bike_lon_lat.bikeLongitude, lat=bike_lon_lat.bikeLatitude)
            userTravel.objects.filter(travelId=request.session['travel_id']).update(endTime=now())
            return HttpResponse("yes")
        finally:
            del request.session['bike_id']
            del request.session['bike_ip']
            del request.session['bike_port']
            del request.session['travel_id']


def guidePage(request):
    if request.method == 'GET':
        return render_to_response('openBike.html')


def checkBikeStatus(request):
    if request.method == 'GET':
        if common.BikeInfo.isLock():
            return HttpResponse("lock")
        else:
            return HttpResponse("unlock")


def getBikeLocationByid(request):
    if request.method == 'GET':
        bike_id = request.session['bike_id']
        data = bikeLocation.objects.filter(bikeId=bike_id)
        for i in data.values_list('bikeLatitude', 'bikeLongitude'):
            lat, lon = i
        return_list = [lat, lon]

        # print("data values : {}".format(data.values()))
        return HttpResponse(json.dumps(return_list))


def myTrip(request):
    if request.method == 'GET':
        return render_to_response("myTrip/myTrip.html")


def tripDetail(request):
    if request.method == 'GET':
        tripId = request.GET.get('tripId')
        bikeId = request.GET.get('bikeId')
        travelDetail.objects.filter(travelId=tripId)
        print tripId, bikeId
        return render_to_response("myTrip/detail.html")


def getTripInfo(request):
    if request.method == 'GET':
        phoneId = request.session['phoneId']
        foreUserInfo = userInfomation.objects.get(userId=phoneId)
        data = userTravel.objects.filter(userId=foreUserInfo)

        print data.values_list()
        return_list = []
        for i in data.values_list():
            userId, travelId, bikeId, startDate, startTime, endTime, lockStatus = i
            timeRange = datetime.timedelta(hours=endTime.hour, minutes=endTime.minute, seconds=endTime.second) - \
                        datetime.timedelta(hours=startTime.hour, minutes=startTime.minute, seconds=endTime.second)
            table_row = {'travelId': travelId, 'bikeId': bikeId,
                         'startDate': "{}-{}-{}".format(startDate.year, startDate.month, startDate.day),
                         'startTime': "{}:{}".format(startTime.hour, startTime.minute),
                         'how_long_minute': timeRange.seconds / 60
                         }
            return_list.append(table_row)
        json_list = json.dumps(return_list)
        return HttpResponse(json_list)


def getBikeHistoryPoint(request):
    if request.method == 'POST':
        tripId = request.POST.get('tripId')
        return_list = []
        data = travelDetail.objects.filter(travelId=tripId).order_by("timeStamp")
        for i in data.values_list():
            lon, lat = i[3], i[4]
            location_tuple = (lon, lat)
            return_list.append(location_tuple)

        return HttpResponse(json.dumps(return_list))


def graphingAdmin_login(request):
    if request.method == 'POST':
        print request.POST
        username = request.POST.get('username')
        password = request.POST.get('password')
        sha256pass = User.objects.filter(username=username).values('password')
        sha256pass = [i['password'] for i in sha256pass]
        isMatch = check_password(password, str(sha256pass[0]))

        print isMatch
        if isMatch:
            request.session['admin_username'] = username

            return HttpResponse('ok')
        else:
            return HttpResponse('no')


def graphingAdmin(request):
    if request.method == 'GET':
        return render_to_response('graphlogin.html')


def BMS(request):
    if request.method == 'GET':
        try:
            username = request.session['admin_username']
        except KeyError:
            return render_to_response('graphlogin.html')
        else:
            return render_to_response('BMS-index.html')


def getAdminUserName(request):
    if request.method == 'GET':
        admin_username = request.session['admin_username']
        return HttpResponse(admin_username)


def exitBMS(request):
    print 'enter exitBMS'
    if request.method == 'GET':
        try:
            del request.session['admin_username']
        except Exception as e:
            print(e)
            return HttpResponse('no')
        else:
            print("yes")
            return HttpResponse('ok')


def removeBikeLocation(request):
    if request.method == 'POST':
        print(request.POST)
        bikeId = request.POST.get('bikeId')
        foreBikeId = bikeData.objects.get(id=bikeId)
        try:
            bikeLocation.objects.filter(bikeId=foreBikeId).delete()
        except Exception as e:
            return HttpResponse('no')
        else:
            return HttpResponse('ok')


def updateBikeLocation(request):
    if request.method == 'POST':
        lon = request.POST.get('lon')
        lat = request.POST.get('lat')
        bikeId = request.POST.get('id')
        foreBikeId = bikeData.objects.get(id=bikeId)
        data = bikeLocation.objects.filter(bikeId=foreBikeId)
        r_lon, r_lat = None, None
        for i in data.values_list():
            r_lon, r_lat = i[2], i[3]
        print str(r_lon) == str(lon)
        print r_lat == lon

        if str(r_lon) == str(lon) and str(r_lat) == str(lat):

            return HttpResponse('no')
        else:
            bikeLocation.objects.filter(bikeId=foreBikeId).update(bikeLongitude=lon, bikeLatitude=lat)

            return HttpResponse('ok')
