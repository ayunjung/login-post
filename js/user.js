// 사용자 관련 데이터와 메소드를 캡슐화하는 User 클래스
class User {
    constructor({ username, password, email }) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    usernameValidate() {
        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/; // 최소 3자 이상, 알파벳과 숫자 허용
        return usernameRegex.test(this.username)
    }

    passwordValidate() {
        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/; // 최소 8자, 하나 이상의 숫자와 알파벳 포함
        return passwordRegex.test(this.password)
    }

    emailValidate() {
        const emailRegex = /^[^@]+@\w+(\.\w+)+\w$/; // 기본적인 이메일 형식
        return emailRegex.test(this.email)
    }

    // 입력값의 유효성 검사
    signUpValidate() {
        const usernameMsg = document.getElementById("msg-username");
        const passwordMsg = document.getElementById("msg-password");
        const emailMsg = document.getElementById("msg-email");
        if(this.usernameValidate()){
            usernameMsg.setAttribute("class", "hide")
        } else {
            usernameMsg.setAttribute("class", "errorMsg")
        }
        if(this.passwordValidate()){
            passwordMsg.setAttribute("class", "hide")
        } else {
            passwordMsg.setAttribute("class", "errorMsg")
        }
        if(this.emailValidate()){
            emailMsg.setAttribute("class", "hide")
        } else {
            emailMsg.setAttribute("class", "errorMsg")
        }
        return this.usernameValidate() &&
            this.passwordValidate() &&
            this.emailValidate();
    }

    // 회원 가입 메소드
    signUp() {
        if (!this.signUpValidate()) {
            // alert('입력값이 유효하지 않습니다.');
            return false;
        }
        return UserService.signUp(this)
    }

    // 입력값의 유효성 검사
    loginValidate() {
        const usernameMsg = document.getElementById("msg-login-username");
        const passwordMsg = document.getElementById("msg-login-password");
        if(this.usernameValidate()){
            usernameMsg.setAttribute("class", "hide")
        } else {
            usernameMsg.setAttribute("class", "errorMsg")
        }
        if(this.passwordValidate()){
            passwordMsg.setAttribute("class", "hide")
        } else {
            passwordMsg.setAttribute("class", "errorMsg")
        }
        return this.usernameValidate() &&
            this.passwordValidate();
    }

    login() {
        if (!this.loginValidate()) {
            // alert('입력값이 유효하지 않습니다.');
            return false;
        }
        return UserService.login(this)
    }

    read() {
        return UserService.read()
    }
}

class UserService {
    static baseUrl = 'https://testapi.io/api/scott';
    static async signUp(user) {
        // REST API를 호출하여 회원 가입 처리
        return await fetch(`${UserService.baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Sign Up Successful:', data);
                alert('회원가입 성공')
                location.replace('./login.html')
            })
            .catch(error => {
                console.error('Sign Up Error:', error);
                alert('회원가입 실패')
            });
    }

    static async login({ username, password }) {
        const reqData = { username, password }
        // REST API를 호출하여 로그인 처리
        return await fetch(`${UserService.baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed: ' + response.statusText);
                }
                console.log(response);
                return response.json();
            })
            .then(data => {
                console.log('Login Successful:', data);
                localStorage.setItem("username", username);
                return data
            })
            .catch(error => {
                console.error('Login Error:', error);
                return { success: false }
            });
    }

    static async read() {
        return await fetch(`${UserService.baseUrl}/users`).then(response => response.json());
    }
}

// 폼 제출 처리
document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    const newUser = new User({ username, password, email });
    newUser.signUp().finally(() => {
        document.getElementById('username').value = ''
        document.getElementById('password').value = ''
        document.getElementById('email').value = ''
    });
});

document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const newUser = new User({ username, password });
    newUser.login({ username, password }).then(login => {
        console.log(login);
    });
    const result = await newUser.login();
    if (result.success) {
        location.replace('./post.html')
    } else {
        alert('로그인 실패')
    }
});

document.getElementById('change-login-btn').addEventListener('click', (ev) => {
    document.getElementById('signup-container').classList.add('hide')
    document.getElementById('login-container').classList.remove('hide')
})
document.getElementById('change-signup-btn').addEventListener('click', (ev) => {
    document.getElementById('login-container').classList.add('hide')
    document.getElementById('signup-container').classList.remove('hide')

})