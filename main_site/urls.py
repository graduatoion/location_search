from django.conf.urls import url, include
from main_site.views import main, getBikeLatLng, signUp, login, test_sign, \
    isLogin, getPhoneId, logOut, scanQr, openBike, guidePage, checkBikeStatus, \
    getBikeLocationByid, closeBike, myTrip, tripDetail, getTripInfo

urlpatterns = [
    url(r'test/$', main),
    url(r'getBikeLatLng', getBikeLatLng),
    url(r'signUp/$', signUp),
    url(r'login/$', login),
    url(r'test_sign/$', test_sign),
    url(r'isLogin/$', isLogin),
    url(r'getPhoneId/$', getPhoneId),
    url(r'logOut/$', logOut),
    url(r'scanQr/$', scanQr),
    url(r'openBike/$', openBike),
    url(r'guidePage/$', guidePage),
    url(r'checkBikeStatus/$', checkBikeStatus),
    url(r'getBikeLocationByid/$', getBikeLocationByid),
    url(r'closeBike/$', closeBike),
    url(r'myTrip/$', myTrip),
    url(r'tripDetail/$', tripDetail),
    url(r'getTripInfo/$', getTripInfo),

]
