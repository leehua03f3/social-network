window.addEventListener("DOMContentLoaded", (event) => {

	console.log('DOM fully loaded and parsed');

	const current_user = document.querySelector("strong").innerHTML;

	fetch("/posts")
	.then(response => response.json())
	.then(posts => {

		console.log(posts[0])

		posts.forEach(post => {

			let like_num = post['like'];
			const username = post['username'];
			const datetime = post['datetime'];
			const content = post['content'];
			const post_id = post['id'];

			// Create post
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
			
			html_post.append(html_content);
			html_post.append(like);
			html_post.append(like_count);

			// Condition for appending edit btn
			if (current_user == username) {
				html_post.append(edit_btn);
			}
			document.querySelector(".allpost").append(html_post);
		})

	}) // End of .then posts

	.then(() => {

		console.log("passing fetch posts")

		// Get all the posts
		const html_posts = document.querySelectorAll('.post');

		console.log(html_posts)

		// Define posts per page
		const posts_per_page = 5;
		let steps = posts_per_page;

		// Add next button
		const next_btn = document.createElement('button')
		next_btn.className = "btn btn-primary next";
		next_btn.innerHTML = "Next";

		if (html_posts.length > posts_per_page) {
			next_btn.style.display = 'block';
		} else {
			next_btn.style.display = 'none';
		}

		// Add previous buttom
		const previous_btn = document.createElement('button')
		previous_btn.className = "btn btn-primary previous";
		previous_btn.innerHTML = "Previous";
		previous_btn.style.display = 'none';

		// Hide all posts
		html_posts.forEach(post => {
			post.style.display = "none";
		})

		// Display only posts_in_page posts
		for (let i = 0; i < posts_per_page; i++) {
			html_posts[i].style.display = "block";
			// console.log(`show ${posts[i].id}`)
		}

		// Onclick Next button
		next_btn.onclick = function() {
			previous_btn.style.display = 'inline';
			let count = 0;

			// Hide all posts
			for (let i = 0; i < html_posts.length; i++) {
				html_posts[i].style.display = "none";
				// console.log(`hide ${posts[i].id}`)
			}

			// Display next page
			for (let i = steps; i < html_posts.length; i++) {
				html_posts[i].style.display = "block";
				count++;
				console.log(`show ${html_posts[i].id}`)
				console.log(i)
				if (count === posts_per_page) {
					break;
				}
			}

			steps += count;

			if (steps >= html_posts.length) {
				steps = html_posts.length;
				next_btn.style.display = 'none';
			}
		} // End of next btn click

		// Onclick previous btn
		previous_btn.onclick = function() {

			next_btn.style.display = 'block';
			let count = 0;

			if (steps % posts_per_page != 0 && steps === html_posts.length) {
				steps -= steps % posts_per_page + 1
			} 
			else if (steps % posts_per_page === 0 && steps === html_posts.length) {
				steps -= posts_per_page + 1
			}

			console.log(steps)
			

			// Hide all posts
			for (let i = 0; i < html_posts.length; i++) {
				html_posts[i].style.display = "none";
			}

			// Display previous page
			for (let i = steps; i >= 0; i--) {
				html_posts[i].style.display = "block";
				console.log(i)
				console.log(`Show ${html_posts[i].id}`)
				count++;
				if (count === posts_per_page) {
					break;
				}
			}
			steps -= count

			if (steps <= 0) {
				steps = posts_per_page;
				previous_btn.style.display = 'none';
			}
		}

		document.querySelector(".allpost").append(previous_btn);
		document.querySelector(".allpost").append(next_btn);
		
	}) // End of pagination

}); // End of DOMContentloaded