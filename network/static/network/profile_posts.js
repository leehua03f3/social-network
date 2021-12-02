window.addEventListener("DOMContentLoaded", (event) => {

	console.log('DOM fully loaded and parsed');

	const current_user = document.querySelector("strong").innerHTML;

	const username = document.querySelector('h2').innerHTML;

	console.log(username)

	fetch(`/profile_posts/${username}`)
	.then(response => response.json())
	.then(posts => {
		console.log(posts[1])
		posts.forEach(post => {

			console.log("pass fetch")
			let like_num = post['like'];
			const datetime = post['datetime'];
			const content = post['content'];
			const post_id = post['id'];
			

			const html_post = document.createElement('div');
			html_post.className = 'post';
			html_post.id = post_id;
			html_post.innerHTML = `
				<p class="title"><a href="profile/${username}">${username}</a></p>
				<p class="datetime">${datetime}</p>
			`

			// Create content
			const html_content = document.createElement("p")
			html_content.className = "content"
			html_content.innerHTML = content

			// Create edit button
			const edit_btn = document.createElement('button')
			edit_btn.className = "btn btn-outline-secondary btn-sm"
			edit_btn.innerHTML = "Edit"

			const edit_content = document.createElement('textarea')
			edit_content.className = "edit-content form-control"
			edit_content.value = content

			const save_btn = document.createElement('button')
			save_btn.className = "btn btn-outline-primary btn-sm"
			save_btn.innerHTML = "Save"

			// Onclick edit btn
			edit_btn.onclick = () => {
				html_content.parentNode.replaceChild(edit_content, html_content)
				edit_btn.parentNode.replaceChild(save_btn, edit_btn)

				save_btn.onclick = () => {
					fetch("/edit_post", {
						method: "POST",
						credentials: 'same-origin',
						body: JSON.stringify ({
							new_content: edit_content.value,
							post_id: post_id,
						})
					}) // End of fetch

					console.log("save clicked and fetched")

					html_content.innerHTML = edit_content.value
					edit_content.parentNode.replaceChild(html_content, edit_content)
					save_btn.parentNode.replaceChild(edit_btn, save_btn)
				}

			} // End of edit btn onclick

			// Create like
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

			html_post.append(html_content);
			html_post.append(like);
			html_post.append(like_count);

			// Condition for appending edit btn
			if (current_user == username) {
				html_post.append(edit_btn);
			}
			document.querySelector(".allpost").append(html_post);
		})

	}) // End of posts Json

}); // End of DOMContentloaded