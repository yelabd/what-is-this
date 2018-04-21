"""whatisthis URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import url, include
from classifier.resources import UserResource
from classifier.resources import ClassificationResource

user_resource = UserResource()
classification_resource = ClassificationResource()

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include(user_resource.urls)),
    url(r'^api/', include(classification_resource.urls))
]
