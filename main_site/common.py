import re


class common(object):
    def __init__(self):
        pass
    phoneIdRe = re.compile(r'[0-9]{11}$')


commonObj = common()
