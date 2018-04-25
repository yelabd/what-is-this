import base64
import json

from django.core import serializers
from django.core.files.base import ContentFile
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.conf.urls import url
from django.http import HttpResponse

from tastypie import fields
from tastypie.authorization import ReadOnlyAuthorization
from tastypie.authentication import ApiKeyAuthentication
from tastypie.http import HttpUnauthorized, HttpForbidden
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash
from tastypie.models import ApiKey

from classifier.authorization import UserOnlyAuthorization, ClassificationOnlyAuthorization
from classifier.models import Classification, ClassificationCategory, ClassificationResult
from classifier.models import User

from model_controller import classify_image

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        excludes = ['email', 'first_name', 'last_name',  'is_staff',
        'groups', 'password', 'is_superuser', 'is_active', 'user_permission']
        allowed_methods = ['get']
        authentication = ApiKeyAuthentication()
        authorization = UserOnlyAuthorization()

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/login%s$" %
                (self._meta.resource_name, trailing_slash()), self.wrap_view('login'), name="user_login"),
            url(r"^(?P<resource_name>%s)/register%s$" % 
                (self._meta.resource_name, trailing_slash()), self.wrap_view('register'), name="user_register"),
            url(r"^(?P<resource_name>%s)/logout%s$" %
                (self._meta.resource_name, trailing_slash()), self.wrap_view('logout'), name="user_logout"),
            url(r"^(?P<resource_name>%s)/(?P<userid>\d+)/classifications%s$" %
                (self._meta.resource_name, trailing_slash()), self.wrap_view('list_classifications'), name="user_classifications")
        ]

    def login(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format = request.META.get('CONTENT_TYPE', 'application/json'))

        username = data.get('username', '')
        password = data.get('password', '')

        user = authenticate(username=username, password=password)

        if user:
            if user.is_active:
                login(request, user)
                api_key = ApiKey.objects.get_or_create(user=user)
                return self.create_response(request, {
                    'success': True,
                    'api_key': api_key[0].key,
                    'user': user.to_dict(),
                })
            else:
                return self.create_response(request, {
                    'success': False,
                    'reason': 'disabled',
                    }, HttpForbidden )
        else:
            return self.create_response(request, {
                'success': False,
                'reason': 'incorrect username/password',
                }, HttpUnauthorized )
    
    def register(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format = request.META.get('CONTENT_TYPE', 'application/json'))

        username = data.get('username', '')
        password = data.get('password', '')

        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            user = User.objects.create_user(username=username, password=password)
            if user:
                login(request, user)
                api_key = ApiKey.objects.get_or_create(user=user)
                return self.create_response(request, {
                    'success': True,
                    'api_key': api_key[0].key,
                    'user': user.to_dict()
                })
            else: 
                return self.create_response(request, {
                'success': False,
                'reason': 'failed',
                }, HttpForbidden )
        else:
            return self.create_response(request, {
                    'success': False,
                    'reason': 'User already exists!',
                    }, HttpForbidden )
    
    def logout(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        self.is_authenticated(request)

        if  request.user and request.user.is_authenticated:
            api_key = ApiKey.objects.get(user=request.user)
            api_key.key = None
            api_key.save()
            logout(request)
            return self.create_response(request, { 'success': True })
        else:
            return self.create_response(request, { 'success': False }, HttpUnauthorized)

    def list_classifications(self, request, **kwargs):
        self.method_check(request, allowed=['get'])

        self.is_authenticated(request)
        print(kwargs['userid'])
        if  request.user and request.user.is_authenticated:
            qs = Classification.objects.filter(user=User.objects.get(id=kwargs['userid']))
            l = list()
            for c in qs:
                l.append(c.to_dict())
            return self.create_response(request, { 'success': True, 'objects': l })
        else:
            return self.create_response(request, { 'success': False }, HttpUnauthorized)  

class ClassificationResource(ModelResource):
    class Meta:
        queryset = Classification.objects.all()
        resource_name = 'classification'
        authentication = ApiKeyAuthentication()
        authorization = ClassificationOnlyAuthorization()

    def obj_get_list(self, bundle, **kwargs):
        return []

    def get_list(self, bundle, **kwargs):
        resp = super(ClassificationResource, self).get_list(bundle, **kwargs)
        data = json.loads(resp.content.decode('utf-8'))
        #data = {}

        l = list()
        for c in Classification.objects.all():
            l.append(c.to_dict())
        data['objects'] = l

        data = json.dumps(data)
        return HttpResponse(data, content_type='application/json', status=200)

    def get_detail(self, request, **kwargs):
        resp = super(ClassificationResource, self).get_detail(request, **kwargs)

        data = json.loads(resp.content.decode('utf-8'))

        print(kwargs)
        data['result'] = list(ClassificationResult.objects.filter(
            classification=kwargs['pk']).values('value', 'confidence'))

        data = json.dumps(data)

        return HttpResponse(data, content_type='application/json', status=200)

    def dehydrate(self, bundle):
        bundle.data['user_id'] = bundle.obj.user_id
        return bundle

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/create%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('create'), name="classification_create")
        ]

    def create(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format = request.META.get('CONTENT_TYPE', 'application/json'))

        category_id = data.get('category_id', '')
        b64 = data.get('photo', '')

        self.is_authenticated(request)
        if  request.user and request.user.is_authenticated:
            
            format, imgstr = b64.split(';base64,') 
            ext = format.split('/')[-1] 
            
            category = ClassificationCategory.objects.get(pk=category_id)
            c = Classification.objects.create(category=category, user=request.user)
            c.save()
            photo = ContentFile(base64.b64decode(imgstr), name= str(c.id) + '.' + ext)
            c.photo = photo
            c.save()

            x = classify_image(c.photo.path, category_id-1, settings.ML_ROOT)
            for value, confidence in x.items():
                result = ClassificationResult.objects.create(value=value, confidence=confidence,
                    classification=c)
                result.save()
            
            return self.create_response(request, { 'success': True , 'classification': c.to_dict() })
        else:
            return self.create_response(request, { 'success': False }, HttpUnauthorized)

class ClassificationCategoryResource(ModelResource):
    class Meta:
        queryset = ClassificationCategory.objects.all()
        resource_name = 'classification_category'
        authentication = ApiKeyAuthentication()
        authorization = ReadOnlyAuthorization()

