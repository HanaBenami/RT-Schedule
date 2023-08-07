from django.contrib import admin
from .models import Call, Contact


class ContactAdminInline(admin.TabularInline):
    model = Contact


@admin.register(Call)
class CallAdmin(admin.ModelAdmin):
    save_as = True
    inlines = (ContactAdminInline,)
    list_display = (
        "externalId",
        "customer",
        "driverEmail",
        "driverUser",
        "scheduledDate",
        "scheduledOrder",
        "isDone",
    )
    actions = ["openCall"]

    @admin.action(description="Open call")
    def openCall(self, request, queryset):
        queryset.update(isDone=False)
