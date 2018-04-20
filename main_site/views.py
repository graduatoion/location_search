from django.shortcuts import render, render_to_response, HttpResponse
from main_site.models import bikeLocation, userInfomation, bikeData, userTravel, travelDetail
import json
import re
from main_site import common


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
            bikeLatitude__gt=lat_left).filter(bikeLatitude__lt=lat_right).values("bikeLongitude", "bikeLatitude")

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
                print("foreBikeId:{}".format(foreBikeId))
                userTravel.objects.create(userId=foreUserId, bikeId=foreBikeId, lockStatus=True)
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
            del request.session['bike_id']
            del request.session['bike_ip']
            del request.session['bike_port']
            return HttpResponse("yes")


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


def travelLog(request):
    if request.method == 'GET':
        return render_to_response("traveLogMap.html")
