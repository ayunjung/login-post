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

    // 포스트 목록을 조회합니다.
    fetchPosts() {
        return fetch(`${this.apiUrl}/posts`).then(response => response.json());
    }

    // 단일 포스트를 조회합니다.
    fetchPost(id) {
        return fetch(`${this.apiUrl}/posts/${id}`).then(response => response.json());
    }

    // 새 포스트를 작성합니다.
    createPost(postData) {
        return fetch(`${this.apiUrl}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then(response => {
            console.log(response);
            response.json()});
    }

    // 포스트를 수정합니다.
    updatePost(id, postData) {
        return fetch(`${this.apiUrl}/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then(response => response.json());
    }

    // 포스트를 삭제합니다.
    deletePost(id) {
        return fetch(`${this.apiUrl}/posts/${id}`, {
            method: 'DELETE'
        }).then(response => response);
    }
}

const api = new PostService('https://testapi.io/api/scott/resource');
const posts = []

document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById('current-user-info');
    if (localStorage.length > 0) {
        userInfo.innerText = "로그아웃";
    } else {
        userInfo.innerText = "로그인";
    }
    userInfo.addEventListener('click', function(event) {
        event.preventDefault();
        if(userInfo.value === '로그인'){
            location.replace('./login.html')
        } else {
            location.replace('./login.html');
            localStorage.clear();
        }
    // userInfo.innerText = localStorage.getItem("username");
    });
});

// document.addEventListener("DOMContentLoaded", () => {
//     document.getElementById('current-user-info').addEventListener('click', function(event) {
//         event.preventDefault();
//         const userInfo = document.getElementById('current-user-info').value;
//         if(userInfo === '로그인'){
//             location.replace('./login.html')
//         } else {
//             location.replace('./login.html');
//             localStorage.clear();
//             console.log(localStorage);
//         }
//     });
// });

const drawPost = () => {
    const postItems = document.querySelectorAll('.post-item')
    postItems.forEach(post => document.querySelector('.posts-list').removeChild(post))
    if(posts.length == 0){
        let div = document.createElement('div');
        div.className = 'post-item'
        let titleEl = document.createElement('h3');
        titleEl.textContent = '데이터가 없습니다.'
        div.appendChild(titleEl)
        document.querySelector('.posts-list').appendChild(div)
    }
    posts.forEach(post => {
        const postItem = drawPostItem(post)
        document.querySelector('.posts-list').appendChild(postItem)
    })
}

const drawPostItem = ({id, title, content}) => {
    let div = document.createElement('div');
    div.className = 'post-item'
    let titleEl = document.createElement('h3');
    titleEl.textContent = `${title} - ${id}`
    let contentEl = document.createElement('p');
    contentEl.textContent = content
    let removeEl = document.createElement('button');
    removeEl.className = 'delete-btn'
    removeEl.textContent = '삭제'
    removeEl.addEventListener('click', () => {
        deletePostById(id)
    })
    div.appendChild(titleEl)
    div.appendChild(contentEl)
    div.appendChild(removeEl)
    return div;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('create-post').addEventListener('click', function(event) {
        event.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        if(title === '' || content === ''){
            return alert('입력값이 유효하지 않습니다.');
        }
        document.getElementById('post-title').value = ''
        document.getElementById('post-content').value = ''
        api.createPost({title, content}).then(createdPost => {
            console.log(createdPost);
            getPosts()
        });
    });

    getPosts()
});

// 포스트 목록 조회
const getPosts = () => {
    api.fetchPosts().then(resData => {
        posts.splice(0)
        console.log('posts :', resData.data);
        resData.data.forEach(post => {
            posts.push(post)
        })
        drawPost()
    });
}

const getPostById = (id) => {
    // 단일 포스트 조회
    api.fetchPost(id).then(post => {
        console.log(post);
    });    
}

const updatedPostById = ({id, title, content}) => {
    // 포스트 수정
    const updatedPost = { title, content };
    api.updatePost(1, updatedPost).then(updated => {
        console.log(updated);
    }); 
}

const deletePostById = (id) => {
    api.deletePost(id).then(response => {
        if(response.ok){
            console.log('remove post success');
            getPosts()
        }else{
            console.log('remove post fail : ', response.statusText);
        }
    })
}