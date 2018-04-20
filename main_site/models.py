from django.db import models


# Create your models here.


class bikeData(models.Model):
    bikeIp = models.CharField(max_length=50)
    bikeStatus = models.BooleanField(default=0)
    bikePort = models.CharField(max_length=10, default=18000)

    def __str__(self):
        return str(self.bikeIp)


class bikeLocation(models.Model):
    bikeId = models.ForeignKey(bikeData)
    bikeLongitude = models.FloatField()
    bikeLatitude = models.FloatField()

    def __str__(self):
        return str(self.bikeId)


class userInfomation(models.Model):
    userId = models.CharField(max_length=128, null=False)
    password = models.CharField(max_length=50, null=False)
    userSex = models.BooleanField(default=1)
    creditLevel = models.IntegerField(default=0)

    def __str__(self):
        return str(self.userId)


class userTravel(models.Model):
    userId = models.ForeignKey(userInfomation)
    travelId = models.AutoField(primary_key=True, null=False)
    bikeId = models.ForeignKey(bikeData)
    openTime = models.TimeField(auto_now_add=True)
    endTime = models.TimeField(null=True)
    lockStatus = models.BooleanField(default=0)

    def __str__(self):
        return str(self.travelId)


class travelDetail(models.Model):
    detailId = models.AutoField(primary_key=True, null=False)
    travelId = models.ForeignKey(userTravel)
    timeStamp = models.TimeField(auto_now_add=True)
    lon = models.FloatField()
    lat = models.FloatField()
