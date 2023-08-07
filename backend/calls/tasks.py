from celery import shared_task

from .models import Call


@shared_task(name="Delete old calls")
def delete_old_calls():
    deleted_calls_external_id = Call.delete_old_calls()
    result = {
        "Delete calls external IDs": deleted_calls_external_id,
        "Total deleted calls": len(deleted_calls_external_id),
    }
    return result
