from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
	content = models.TextField()
	datetime = models.DateTimeField(auto_now_add=True, blank=True)
	like = models.IntegerField(default=0)
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_post")

	def __str__(self):
		return f"{self.user}: {self.content} | {self.datetime} | {self.like}"

	def serialize(self):
		return {
			"content": self.content,
			"datetime": self.datetime.strftime("%b %d %Y, %I:%M %p"),
			"like": self.like,
			"username": self.user.username,
			"id": self.id
		}

class Like(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_like")
	post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_like")
	like = models.BooleanField(default="False")

	def __str__(self):
		return f"{self.user} | {self.post} | {self.like}"

	def serialize(self):
		return {
			"like": self.like,
		}

class Follow(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_follow")
	followed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followed_user_follow")
	is_followed = models.BooleanField(default=False)

	def __str__(self):
		return f"{self.user} | {self.followed_user}"