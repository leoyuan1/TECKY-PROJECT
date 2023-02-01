
function getSelectedCommunityPostId() {
	console.log('testing-1');
	let search = new URLSearchParams(window.location.search)
	let communityMessageId = search.get('communityMessageId')
	return communityMessageId
}
async function getCommunityPosts(postId) {

	console.log('testing-2');

	let res = await fetch(`/community/post/${postId}`)

	if (res.ok) {
		let result = await res.json()

		console.log(result);

		return result.data;
	}
}
function renderPostsUI(post) {

	console.log('post = ', post);

	const titleElem = document.querySelector('.posttitle');

	titleElem.innerText = post.title;

	const imageElem = document.querySelector('.featured-image.img-fluid');

	imageElem.src = `/community-img/${post.media}`;

	const contentElem = document.querySelector('.article-post');

	contentElem.innerText = post.content;

}

async function init() {

	let communityMessageId = getSelectedCommunityPostId()
	let data = await getCommunityPosts(communityMessageId)

	renderPostsUI(data)
}

init()