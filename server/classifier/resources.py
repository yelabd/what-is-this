from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.conf.urls import url
from django.http import HttpResponse

from tastypie.authorization import DjangoAuthorization
from tastypie.authorization import Authorization
from tastypie.authentication import ApiKeyAuthentication

from tastypie.http import HttpUnauthorized, HttpForbidden

from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash

from tastypie.models import ApiKey

from classifier.models import Classification
from classifier.models import User

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        excludes = ['email', 'password', 'is_superuser']
        allowed_methods = ['post', 'get']
        authentication = ApiKeyAuthentication()
        authorization = Authorization()

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/login%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('login'), name="user_login"),
            url(r"^(?P<resource_name>%s)/register%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('register'), name="user_register"),
            url(r"^(?P<resource_name>%s)/logout%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('logout'), name="user_logout"),
        ]

    def login(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format = request.META.get('CONTENT_TYPE', 'application/json'))

        username = data.get('email', '')
        password = data.get('password', '')
        user = authenticate(username=username, password=password)

        if user:
            if user.is_active:
                login(request, user)
                api_key = ApiKey.objects.get_or_create(user=user)
                return self.create_response(request, {
                    'success': True,
                    'apikey': api_key[0].key
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
        pass
    
    def logout(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        if request.user and request.user.is_authenticated():
            logout(request)
            return self.create_response(request, { 'success': True })
        else:
            return self.create_response(request, { 'success': False }, HttpUnauthorized)

class ClassificationResource(ModelResource):
    class Meta:
        queryset = Classification.objects.all()
        resource_name = 'classification'
        authentication = ApiKeyAuthentication()
        authorization = Authorization()

