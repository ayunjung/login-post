class Post {
	constructor(title, content){
		this.title = title
		this.content = content
	}
}

class PostService {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }
    
    // 단일 포스트를 조회합니다.
    fetchPost(id) {
        return fetch(`${this.apiUrl}/posts/${id}`).then(response => response.json());
    }

    // 포스트를 수정합니다.
    updatePost(id, postData) {
        return fetch(`${this.apiUrl}/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then(response => response);
    }

    // 포스트를 삭제합니다.
    deletePost(id) {
        return fetch(`${this.apiUrl}/posts/${id}`, {
            method: 'DELETE'
        }).then(response => response);
    }
}

const api = new PostService('https://testapi.io/api/scott/resource');
const postData = {};
// const url = document.location.href;	    // "detailPost.html?id=1"
const query = window.location.search;			// "home.html?id=1&pw=1234"
const param = new URLSearchParams(query);		// "?id=1"
const id = param.get('id');

document.addEventListener("DOMContentLoaded", () => {
    const postTitle = document.getElementById('post-title');
    const postInfo = document.getElementById('post-info');
    const postContent = document.getElementById('post-content');
    api.fetchPost(id).then(post => {
        postTitle.innerText = post.title;
        if (post.createdAt !== post.updatedAt) {
            postInfo.innerText = '등록일시 : ' + post.createdAt.split("T")[0] + '\u00a0\u00a0\u00a0수정일시 : ' + post.updatedAt.split("T")[0];
        } else {
            postInfo.innerText = '등록일시 : ' + post.createdAt.split("T")[0]
        }
        postContent.innerText = post.content;
    });
});

// 포스트 목록으로 이동
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('list-btn').addEventListener('click', function(event) {
        event.preventDefault();
        location.replace('./post.html')
    });
});

// 포스트 삭제
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('delete-btn').addEventListener('click', function(event) {
        event.preventDefault();
        deletePostById(id)
    });
});

const updatedPostById = (id, title, content) => {
    // 포스트 수정
    console.log('updatePostId : ', id);
    console.log('updatePostTit : ', title);
    console.log('updatePostContent : ', content);
    const updatedPost = { title, content };
    // api.updatePost(id, updatedPost).then(updated => {
    //     console.log(updated);
    // }); 
    api.updatePost(id, updatedPost).then(response => {
        console.log(response);
        if(response.ok){
            console.log('updated post success : ', response);
            getPosts()
        }else{
            console.log('updated post fail : ', response.statusText);
        }
    })
}

const deletePostById = (id) => {
    api.deletePost(id).then(response => {
        if(response.ok){
            console.log('remove post success');
            location.replace('./post.html')
        }else{
            console.log('remove post fail : ', response.statusText);
        }
    })
}