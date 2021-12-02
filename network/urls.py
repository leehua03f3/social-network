
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("newpost", views.newpost, name="newpost"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("follow/<str:username>", views.follow, name="follow"),
    path("posts", views.posts, name="posts"),
    path("like", views.like, name="like"),
    path("profile_posts/<str:username>", views.profile_posts, name="profile_posts"),
    path("get_like/<int:post_id>", views.get_like, name="get_like"),
    path("following_page", views.following_page, name="following_page"),
    path("get_following_posts", views.get_following_posts, name="get_following_posts"),
    path("edit_post", views.edit_post, name="edit_post")
]
