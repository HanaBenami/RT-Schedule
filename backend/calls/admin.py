from django.contrib import admin
from .models import Call, Contact


class ContactAdminInline(admin.TabularInline):
    model = Contact


@admin.register(Call)
class CallAdmin(admin.ModelAdmin):
    save_as = True
    inlines = (ContactAdminInline,)
    list_display = (
        "external_id",
        "customer",
        "driver_email",
        "driverUser",
        "scheduled_date",
        "scheduled_order",
        "is_done",
    )
    actions = ["reopen_call"]

    @admin.action(description="Reopen call")
    def reopen_call(self, request, queryset):
        queryset.update(is_done=False)
