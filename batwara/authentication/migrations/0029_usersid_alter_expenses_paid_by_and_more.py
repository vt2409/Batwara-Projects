# Generated by Django 4.1.3 on 2023-04-21 19:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0028_alter_users_table'),
    ]

    operations = [
        migrations.CreateModel(
            name='UsersID',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(max_length=512, unique=True)),
                ('user_phone', models.CharField(max_length=256, null=True)),
                ('user_created_on', models.DateField(auto_now_add=True)),
                ('full_name', models.CharField(max_length=512, null=True)),
                ('nation', models.CharField(max_length=256, null=True)),
                ('password', models.CharField(max_length=1024, null=True)),
                ('is_deleted', models.BooleanField(default=False, null=True)),
            ],
            options={
                'db_table': 'users_ids',
            },
        ),
        migrations.AlterField(
            model_name='expenses',
            name='paid_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.usersid', to_field='user_id'),
        ),
        migrations.AlterField(
            model_name='expensesshares',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.usersid', to_field='user_id'),
        ),
        migrations.AlterField(
            model_name='usergroup',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.usersid', to_field='user_id'),
        ),
        migrations.DeleteModel(
            name='Users',
        ),
    ]
