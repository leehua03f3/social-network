window.addEventListener("DOMContentLoaded", (event) => {

	console.log('DOM fully loaded and parsed');

	fetch("/get_following_posts")
	.then(response => response.json())
	.then(posts => {
		console.log(posts[1])
		posts.forEach(post => {

			console.log("pass fetch")
			let like_num = post['like'];
			const datetime = post['datetime'];
			const username = post['username'];
			const content = post['content'];
			const post_id = post['id'];
			

			const html_post = document.createElement('div');
			html_post.className = 'post';
			html_post.id = post_id;
			html_post.innerHTML = `
				<p class="title"><a href="profile/${username}">${username}</a></p>
				<p class="datetime">${datetime}</p>
				<p class="content">${content}</p>
			`

			const like = document.createElement('a');
			like.href = "#";
			like.className = "like";

			// Get the status of the post
			fetch(`/get_like/${post_id}`)
			.then(response => response.text())
			.then(text => {
				if (text == "True") {
					like_status = true;
					like.innerHTML = "Unlike"
					console.log("like is true")
				} else {
					like_status = false;
					like.innerHTML = "Like"
					console.log("like is false")
				}
			})

			// Create new element for number of likes
			const like_count = document.createElement('p')
			like_count.innerHTML = like_num
			like_count.className = 'like_count'

			like.onclick = () => {
				fetch("/like", {
					method: "POST",
					credentials: 'same-origin',
					body: JSON.stringify ({
						post_id: post_id,
					})
				})
				if (like.innerHTML == "Like") {
					like.innerHTML = "Unlike";
					like_num += 1;
					like_count.innerHTML = like_num
					console.log(like_num)
				} else {
					like.innerHTML = "Like"
					like_num -= 1;
					like_count.innerHTML = like_num
				}
			} // End of like onclick

			html_post.append(like);
			html_post.append(like_count);
			document.querySelector(".allpost").append(html_post);
		})

	}) // End of posts Json

}); // End of DOMContentloaded