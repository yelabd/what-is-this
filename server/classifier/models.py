from django.db import models
from django.contrib.auth.models import AbstractUser
from django.forms.models import model_to_dict
from whatisthis import settings

# Create your models here.

class User(AbstractUser):
    def to_dict(user):
        ret = model_to_dict(user)
        del ret['email']
        del ret['first_name']
        del ret['last_name']
        del ret['groups']
        del ret['password']
        del ret['is_superuser']
        del ret['is_active']
        del ret['is_staff']
        del ret['user_permissions']
        return ret

class Classification(models.Model):
    result = models.CharField(max_length=100)
    confidence = models.CharField(max_length=100)
    photo = models.FileField(upload_to='')
    user = models.ForeignKey('User', on_delete=models.CASCADE)

    def to_dict(classification):
        ret = model_to_dict(classification)
        ret['photo'] = settings.MEDIA_URL + classification.photo.__str__()
        ret['user_id'] = ret['user']
        del ret['user']
        return ret
        
