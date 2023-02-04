from django.db import models

# Create your models here.

class Users(models.Model):
    user_id = models.CharField(max_length=256,null=True)
    user_phone = models.CharField(max_length=256,null=True)
    user_password = models.CharField(max_length=256,null=True)
    user_created_on =  models.DateField(auto_now_add=True)

    class Meta:
        db_table = "users_tank"