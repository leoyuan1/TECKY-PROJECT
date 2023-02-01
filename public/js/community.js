// const { resourceLimits } = require("worker_threads")
const newPost = document.querySelector('#postaddbtn')



function registerEventListener() {
    newPost.addEventListener('click', async () => {
        await Swal.fire({
            title: '建立帖子',
            html: `<form id="new-post-form"><input type="text" id="title" class="swal2-input" name="title" placeholder="Title">
            <textarea type="text" id="content" class="swal2-input" name="content" placeholder="tpye here"></textarea> 
            <button class="icon">Media upload<input type="file" name="image" id="media" /></button>
            </form>
            `,

            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                'Comfirm!',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            preConfirm: async () => {
                const title = Swal.getPopup().querySelector('#title').value
                const text = Swal.getPopup().querySelector('#content').value
                const file = Swal.getPopup().querySelector('#media').value
                if (!title || !text) {
                    Swal.showValidatoinMessage(`Please fill the text area and title!`)
                    return
                }
                let formData = new FormData(document.querySelector('#new-post-form'))
                let res = await fetch('/community', {
                    method: 'POST',
                    body: formData,
                })
                if (res.ok) {
                    getCommunityPosts()
                }
            },

            willClose: async () => {
            }
        })
    })

}

async function getCommunityPosts() {

    let res = await fetch('/community/posts')
    let data = await res.json()
    renderPostsUI(data.data)
}

function renderPostsUI({ popToday, allStories }) {
    renderPopTodayPost(popToday)
    renderAllStories(allStories)

}

function renderPopTodayPost(popToday) {
    let popTotdayContainer = document.querySelector('.card-columns.listfeaturedtag')
    popTotdayContainer.innerHTML = ''
    for (let popTodayPost of popToday) {
        popTotdayContainer.innerHTML += /* HTML */`
                <div class="card">
						<div class="row">
							<div class="col-md-5 wrapthumbnail">
								<!-- <a href="post.html"> -->
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
									<h2 class="card-title"><a href="post.html">${popTodayPost.title}</a></h2>
									<h4 class="card-text">${popTodayPost.content}</h4>
									<div class="metafooter">
										<div class="wrapfooter">
											<span class="meta-footer-thumb">
												<a href="author.html">
                                                    <img class="author-thumb"
														src="${popTodayPost.icon}"
														alt="Sal"></a>
											</span>
											<span class="author-meta">
												<span class="post-name"><a href="author.html">${popTodayPost.username}</a></span><br />
												<span class="post-date">${popTodayPost.created_at}</span><span
													class="dot"></span><span class="post-read">6 min read</span>
											</span>
											<span class="post-read-more"><a href="post.html" title="Read Story"><svg
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

function renderAllStories(allStories) {

    let allStoriesContainer = document.querySelector('.card-columns.listrecent')
    allStoriesContainer.innerHTML = ''
    for (let storyPost of allStories) {
        allStoriesContainer.innerHTML += /* HTML */`
        <div class="card">
        <a href="post.html">
            <img class="img-fluid" src="/community-img/${storyPost.media}" alt="">
        </a>
        <div class="card-block">
            <h2 class="card-title"><a href="post.html">${storyPost.title}</a>
            </h2>
            <h4 class="card-text">${storyPost.content}</h4>
            <div class="metafooter">
                <div class="wrapfooter">
                    <span class="meta-footer-thumb">
                        <a href="author.html">
                        <img class="author-thumb"
                                src="/user-img/${storyPost.icon}"
                                alt="Sal"></a>
                    </span>
                    <span class="author-meta">
                        <span class="post-name"><a href="author.html">${storyPost.username}</a></span><br />
                        <span class="post-date">${storyPost.created_at}</span><span class="dot"></span><span
                            class="post-read">6 min read</span>
                    </span>
                    <span class="post-read-more"><a href="post.html" title="Read Story"><svg
                                class="svgIcon-use" width="25" height="25" viewbox="0 0 25 25">
                                <path
                                    d="M19 6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v14.66h.012c.01.103.045.204.12.285a.5.5 0 0 0 .706.03L12.5 16.85l5.662 4.126a.508.508 0 0 0 .708-.03.5.5 0 0 0 .118-.285H19V6zm-6.838 9.97L7 19.636V6c0-.55.45-1 1-1h9c.55 0 1 .45 1 1v13.637l-5.162-3.668a.49.49 0 0 0-.676 0z"
                                    fill-rule="evenodd"></path>
                            </svg></a></span>
                </div>
            </div>
        </div>
    </div>
        
        
        
        
        `
    }
}

function init() {
    registerEventListener()
    getCommunityPosts()
}

init()