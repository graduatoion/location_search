from django.shortcuts import render, render_to_response, HttpResponse
from main_site.models import bikeLocation, userInfomation
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
        print(request.POST)
        lon_left = request.POST.get("lon_left")
        lon_right = request.POST.get("lon_right")
        lat_left = request.POST.get("lat_left")
        lat_right = request.POST.get("lat_right")

        data = bikeLocation.objects.filter(bikeLongitude__gt=lon_left).filter(bikeLongitude__lt=lon_right).filter(
            bikeLatitude__gt=lat_left).filter(bikeLatitude__lt=lat_right).values("bikeLongitude", "bikeLatitude")

        print(data)
        d = [i for i in data]
        print(d)
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
