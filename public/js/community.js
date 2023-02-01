// const { resourceLimits } = require("worker_threads")
const newPost = document.querySelector('#postaddbtn')

async function registerEventListener() {
    newPost.addEventListener('click', async () => {
        let res = await fetch('/session')
        let user = await res.json()
        if (user.message == 'no session data') {
            Swal.fire('請先登入!')
            return
        }
        await Swal.fire({
            title: '建立帖子',
            html: `<form id="new-post-form"><input type="text" id="title" class="swal2-input" name="title" placeholder="Title">
            <textarea type="text" id="content" class="swal2-input" name="content" placeholder="tpye here"></textarea> 
            <button class="icon">Image upload<input type="file" name="image" id="media" /></button>
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
                if (!title || !text || !file) {
                    Swal.fire(`Please fill the title ,text area and add the img!`)
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
    let popTodayContainer = document.querySelector('.card-columns.listfeaturedtag')
    popTodayContainer.innerHTML = ''
    for (let popTodayPost of popToday) {
        popTodayContainer.innerHTML += /* HTML */`
                <div class="card">
						<div class="row">
							<div class="col-md-5 wrapthumbnail">
								<a href="post-details.html?communityMessageId=${popTodayPost.community_post_id}">
								<div class="thumbnail" style="background-image:url(/community-img/${popTodayPost.media});">
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
												<span class="post-name"><a href="">${popTodayPost.username}</a></span><br />
												<span class="post-date">${popTodayPost.created_at}</span><span
													class="dot"></span><span class="post-read">6 min read</span>
											</span>
											<span class="post-read-more"><a href="post-details.html?communityMessageId=${popTodayPost.community_post_id}" title="Read Story"><svg
														class="svgIcon-use" width="25" height="25" viewbox="0 0 25 25">

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
        <a href="post-details.html?communityMessageId=${storyPost.community_post_id}">
            <img class="img-fluid" src="/community-img/${storyPost.media}" alt="">
        </a>
        <div class="card-block">
            <h2 class="card-title"><a href="post-details.html?communityMessageId=${storyPost.community_post_id}">${storyPost.title}</a>
            </h2>
            <h4 class="card-text">${storyPost.content}</h4>
            <div class="metafooter">
                <div class="wrapfooter">
                    </span>
                    <span class="author-meta">
                        <span class="post-name"><a href="">${storyPost.username}</a></span><br />
                        <span class="post-date">${storyPost.created_at}</span><span class="dot"></span><span
                            class="post-read">6 min read</span>
                    </span>
                    <span class="post-read-more"><a href="post-details.html?communityMessageId=${storyPost.community_post_id}" title="Read Story"><svg
                                class="svgIcon-use" width="25" height="25" viewbox="0 0 25 25">

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