
function getSelectedCommunityPostId() {
	let search = new URLSearchParams(window.location.search)
	let communityMessageId = search.get('communityMessageId')
	return communityMessageId
}
async function getCommunityPosts(postId) {

	let res = await fetch(`/community/post/${postId}`)

	if (res.ok) {
		let data = await res.json()
		console.log(data2)

		return {

			title: '',
			content: ''
		}
	}
}
function renderPostsUI() {
	document.querySelector('.card-columns.listfeaturedtag')
	popTodayContainer.innerHTML = ''
	for (let popTodayPost of popToday) {
		popTodayContainer.innerHTML += /* HTML */`
                <div class="card">
						<div class="row">
							<div class="col-md-5 wrapthumbnail">
								<!-- <a href="post-details.html?communityMessageId="> -->
								<div class="thumbnail" style="background-image:url(/community-img/${popTodayPost.media});">
									<button class="button button-like">
										<i class="fa fa-heart"></i>
										<span>Like</span>
									</button>
								</div>
								</a>
							</div>
							<div class="col-md-7">
								<div class="card-block">
									<h2 class="card-title"><a href="/community/post-details.html?communityMessageId=${popTodayPost.community_post_id}">${popTodayPost.title}</a></h2>
									<h4 class="card-text">${popTodayPost.content}</h4>
									<div class="metafooter">
										<div class="wrapfooter">
											<span class="meta-footer-thumb">
											</span>
											<span class="author-meta">
												<span class="post-name"><a href="author.html">${popTodayPost.username}</a></span><br />
												<span class="post-date">${popTodayPost.created_at}</span><span
													class="dot"></span><span class="post-read">6 min read</span>
											</span>
											<span class="post-read-more"><a href="post-details.html?communityMessageId=${popTodayPost.community_post_id}" title="Read Story"><svg
														class="svgIcon-use" width="25" height="25" viewbox="0 0 25 25">
														<path
															d="M19 6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v14.66h.012c.01.103.045.204.12.285a.5.5 0 0 0 .706.03L12.5 16.85l5.662 4.126a.508.508 0 0 0 .708-.03.5.5 0 0 0 .118-.285H19V6zm-6.838 9.97L7 19.636V6c0-.55.45-1 1-1h9c.55 0 1 .45 1 1v13.637l-5.162-3.668a.49.49 0 0 0-.676 0z"
															fill-rule="evenodd"></path>
													</svg></a></span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
    
    
    
    
    `
	}
}

async function init() {

	let communityMessageId = getSelectedCommunityPostId()
	let data = await getCommunityPosts(communityMessageId)

	renderPostsUI(data)
}

init()