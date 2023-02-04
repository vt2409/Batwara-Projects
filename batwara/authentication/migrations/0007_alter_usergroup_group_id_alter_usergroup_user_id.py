# Generated by Django 4.1.3 on 2023-02-04 23:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0006_usergroup'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usergroup',
            name='group_id',
            field=models.ForeignKey(db_column='group_id', on_delete=django.db.models.deletion.CASCADE, to='authentication.group'),
        ),
        migrations.AlterField(
            model_name='usergroup',
            name='user_id',
            field=models.ForeignKey(db_column='user_id', on_delete=django.db.models.deletion.CASCADE, to='authentication.users'),
        ),
    ]
