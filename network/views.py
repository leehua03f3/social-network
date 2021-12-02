import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post, Like, Follow


@login_required(login_url="login")
def index(request):
    return render(request, "network/index.html")

def newpost(request):
    if request.method == "POST":
        content = request.POST['content']
        post = Post(
            user = request.user,
            content = content
            )
        post.save()
        return HttpResponseRedirect(reverse("index"))

@csrf_exempt
def edit_post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        new_content = data.get("new_content")
        post_id = data.get("post_id")
        post = Post.objects.get(pk=int(post_id))
        post.content = new_content
        post.save()

    return HttpResponseRedirect(reverse("index"))


def profile(request, username):
    user = User.objects.get(username=username)
    posts = Post.objects.filter(user=user).order_by("-id")
    follow = Follow.objects.all()
    if follow.filter(user=request.user, followed_user=user).exists():
        check_follow = follow.get(user=request.user, followed_user=user)
    else:
        check_follow = None

    return render(request, "network/profile.html", {
            "username": username,
            "login_user": request.user,
            "posts": posts,
            "following_count": follow.filter(user=user).count(),
            "follower_count": follow.filter(followed_user=user, is_followed=True).count(),
            "check_follow": check_follow
        })

def follow(request, username):
    if request.method == "POST":
        user = User.objects.get(username=username)
        if Follow.objects.filter(user=request.user, followed_user=user).exists():
            follow = Follow.objects.get(user=request.user, followed_user=user)
            if follow.is_followed:
                follow.is_followed = False
            else:
                follow.is_followed = True
        else:
            follow = Follow(
                user = request.user,
                followed_user = user,
                is_followed = True,
                    )

        follow.save()

        return HttpResponseRedirect(reverse("profile", args=(username,)))

def following_page(request):
    posts = []
    follows = Follow.objects.filter(user=request.user, is_followed=True)
    for follow in follows:
        for post in Post.objects.filter(user=follow.followed_user).order_by("-id"):
            posts.append(post)
    return render(request, "network/following_page.html", {
            "posts": posts,
        })

def get_following_posts(request):
    posts = []
    follows = Follow.objects.filter(user=request.user, is_followed=True)
    for follow in follows:
        for post in Post.objects.filter(user=follow.followed_user).order_by("-id"):
            posts.append(post.serialize())
    return JsonResponse(posts, safe=False)


def posts(request):
    posts = Post.objects.all().order_by("-id")
    return JsonResponse([post.serialize() for post in posts], safe=False)

def profile_posts(request, username):
    user = User.objects.get(username=username)
    posts = Post.objects.filter(user=user).order_by("-id")
    return JsonResponse([post.serialize() for post in posts], safe=False)

@csrf_exempt
def like(request):
    if request.method == "POST":
        data = json.loads(request.body)
        post_id = data.get("post_id")
        post = Post.objects.get(pk=int(post_id))

        if Like.objects.filter(user=request.user, post=post).exists():
            like = Like.objects.get(user=request.user, post=post)
            if like.like:
                like.like = False
            else:
                like.like = True

        else:
            like = Like(
                user = request.user,
                post = post,
                like = True,
                )
        like.save()

        # Update post like number
        post.like = Like.objects.filter(post=post, like=True).count()
        post.save()

    return HttpResponseRedirect(reverse("index"))

def get_like(request, post_id):
    post = Post.objects.get(pk=post_id)

    if Like.objects.filter(post=post, user=request.user).exists():
        like = Like.objects.get(post=post, user=request.user)
        if like.like:
            return HttpResponse('True')
        else:
            return HttpResponse('False')
    else:
        return HttpResponse('False')
    


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
