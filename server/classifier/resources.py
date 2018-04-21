from django.contrib.auth import authenticate, login, logout
from django.conf.urls import url
from django.http import HttpResponse

from tastypie.authentication import ApiKeyAuthentication
from tastypie.http import HttpUnauthorized, HttpForbidden
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash
from tastypie.models import ApiKey

from classifier.authorization import UserOnlyAuthorization, ClassificationOnlyAuthorization
from classifier.models import Classification
from classifier.models import User

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        excludes = ['email', 'password', 'is_superuser']
        allowed_methods = ['get']
        authentication = ApiKeyAuthentication()
        authorization = UserOnlyAuthorization()

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/login%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('login'), name="user_login"),
            url(r"^(?P<resource_name>%s)/register%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('register'), name="user_register"),
            url(r"^(?P<resource_name>%s)/logout%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('logout'), name="user_logout"),
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
                    'username': user.username
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
                    'username': user.username
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

class ClassificationResource(ModelResource):
    class Meta:
        queryset = Classification.objects.all()
        resource_name = 'classification'
        authentication = ApiKeyAuthentication()
        authorization = ClassificationOnlyAuthorization()

