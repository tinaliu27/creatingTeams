# Generated by Django 4.2.18 on 2025-03-13 05:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_student_remove_team_diversify_gender_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="team",
            name="students",
            field=models.ManyToManyField(related_name="teams", to="api.student"),
        ),
    ]
