from django.conf.urls import url, include
from main_site.views import main, getBikeLatLng, signUp, login, test_sign, isLogin, getPhoneId, logOut

urlpatterns = [
    url(r'test/$', main),
    url(r'getBikeLatLng', getBikeLatLng),
    url(r'signUp/$', signUp),
    url(r'login/$', login),
    url(r'test_sign/$', test_sign),
    url(r'isLogin/$', isLogin),
    url(r'getPhoneId/$', getPhoneId),
    url(r'logOut/$', logOut),

]
