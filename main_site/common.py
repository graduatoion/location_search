import re
import requests
from threading import Thread


class common(object):
    def __init__(self):
        pass

    phoneIdRe = re.compile(r'[0-9]{11}$')


# status = False equal lock ,status = True equal unlock

class BikeInfo:
    def __init__(self):
        pass

    @classmethod
    def openBike(cls, port=18000):
        try:
            requests.get("http://127.0.0.1:{}/openBike".format(port))
        except Exception as e:
            print("request bike error : {}".format(e))

    @classmethod
    def closeBike(cls, port=18000):
        try:
            requests.get("http://127.0.0.1:{}/closeBike".format(port))
        except Exception as e:
            print("request bike error : {}".format(e))

    @classmethod
    def isLock(cls, port=18000):
        res = None
        try:
            res = requests.get("http://127.0.0.1:{}/getBikeStatus".format(port))
        except Exception as e:
            print("request bike error : {}".format(e))
        if res.content == '0':
            return True
        else:
            return False



bikeInfo = BikeInfo()

commonObj = common()
