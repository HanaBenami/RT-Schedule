# Generated by Django 4.2.3 on 2023-08-12 08:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('calls', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='call',
            old_name='addedAt',
            new_name='added_at',
        ),
        migrations.RenameField(
            model_name='call',
            old_name='driverEmail',
            new_name='driver_email',
        ),
        migrations.RenameField(
            model_name='call',
            old_name='driverNotes',
            new_name='driver_notes',
        ),
        migrations.RenameField(
            model_name='call',
            old_name='externalId',
            new_name='external_id',
        ),
        migrations.RenameField(
            model_name='call',
            old_name='internalId',
            new_name='internal_id',
        ),
        migrations.RenameField(
            model_name='call',
            old_name='isDone',
            new_name='is_done',
        ),
        migrations.RenameField(
            model_name='call',
            old_name='scheduledDate',
            new_name='scheduled_date',
        ),
        migrations.RenameField(
            model_name='call',
            old_name='scheduledOrder',
            new_name='scheduled_order',
        ),
    ]
