from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    pass

class Classification(models.Model):
    result = models.CharField(max_length=100)
    confidence = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='img')
    user = models.ForeignKey('User', on_delete=models.CASCADE)
