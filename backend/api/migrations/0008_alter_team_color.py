# Generated by Django 4.2.18 on 2025-04-23 06:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0007_team_project"),
    ]

    operations = [
        migrations.AlterField(
            model_name="team",
            name="color",
            field=models.CharField(default="red", max_length=50),
        ),
    ]
