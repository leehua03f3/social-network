from django.contrib import admin

from .models import User, Post, Like, Follow

# Register your models here.

class PostAdmin(admin.ModelAdmin):
	list_display = ('user', 'content', 'datetime', 'like')

class FollowAdmin(admin.ModelAdmin):
	list_display = ('user', 'followed_user','is_followed')
	list_editable = ('is_followed',)

class LikeAdmin(admin.ModelAdmin):
	list_display = ('user', 'post', 'like')
	list_editable = ('like',)

admin.site.register(User)
admin.site.register(Post, PostAdmin)
admin.site.register(Follow, FollowAdmin)
admin.site.register(Like, LikeAdmin)
