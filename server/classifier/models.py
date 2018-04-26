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
    category = models.ForeignKey('ClassificationCategory', on_delete=models.CASCADE)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    photo = models.FileField(upload_to='')

    def to_dict(classification):
        ret = model_to_dict(classification)
        ret['id'] = classification.id
        ret['photo'] = settings.MEDIA_URL + classification.photo.__str__()
        ret['category'] = classification.category.to_dict()
        ret['result'] = list(ClassificationResult.objects.filter(
            classification=classification.id).values('value', 'confidence'))
        ret['user_id'] = ret['user']
        del ret['user']
        return ret

class ClassificationResult(models.Model):
    classification = models.ForeignKey('Classification', on_delete=models.CASCADE)
    value = models.CharField(max_length=100)
    confidence=models.CharField(max_length=100)

    def to_dict(result):
        return model_to_dict(result)
        
class ClassificationCategory(models.Model):
    value = models.CharField(max_length=100)
    
    def to_dict(category):
        return model_to_dict(category)