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
    });
});

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
    let dataDiv = document.createElement('div');
    dataDiv.className = 'data-view'
    dataDiv.addEventListener('click', () => {
        if (dataDiv.className === 'data-view') {
            location.replace(`./detailPost.html?id=${id}`)
        }
    })
    let titleEl = document.createElement('h3');
    titleEl.textContent = `${title} - ${id}`
    let contentEl = document.createElement('p');
    contentEl.textContent = content
    let updatedEl = document.createElement('button');
    updatedEl.textContent = '수정'
    updatedEl.addEventListener('click', () => {
        if( updatedEl.textContent === '수정') {
            dataDiv.className = 'data-update'
            dataDiv.innerHTML = `<input type="text" id="update-post-title" placeholder="제목" value="${title}" required /><input type="text" id="update-post-content" placeholder="내용" value="${content}" required />`
            let cancleEl = document.createElement('button');
            cancleEl.textContent = '취소'
            cancleEl.className = 'cancle-btn'
            div.appendChild(cancleEl);
            updatedEl.textContent = '수정완료'
            cancleEl.addEventListener('click', () => {
                getPosts();
            })
        } else {
            const updateTitle = document.getElementById('update-post-title').value;
            const updateContent = document.getElementById('update-post-content').value;
            if(updateTitle === '' || updateTitle === ''){
                return alert('입력값이 유효하지 않습니다.');
            }
            updatedPostById(id, updateTitle, updateContent);
        }
    })
    let removeEl = document.createElement('button');
    removeEl.className = 'delete-btn'
    removeEl.textContent = '삭제'
    removeEl.addEventListener('click', () => {
        deletePostById(id)
    })
    dataDiv.appendChild(titleEl)
    dataDiv.appendChild(contentEl)
    div.appendChild(dataDiv)
    div.appendChild(updatedEl)
    div.appendChild(removeEl)
    return div;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('create-post').addEventListener('click', function(event) {
        event.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        console.log(document.getElementById('post-title').tagName);
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

const updatedPostById = (id, title, content) => {
    // 포스트 수정
    const updatedPost = { title, content };
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
            getPosts()
        }else{
            console.log('remove post fail : ', response.statusText);
        }
    })
}