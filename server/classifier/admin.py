from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User
from .models import Classification, ClassificationResult, ClassificationCategory

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Classification)
admin.site.register(ClassificationResult)
admin.site.register(ClassificationCategory)