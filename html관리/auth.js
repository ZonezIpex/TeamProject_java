// 회원가입 함수
function signup() {
    let username = document.getElementById("newUsername").value;
    let password = document.getElementById("newPassword").value;
    let nickname = document.getElementById("nickname").value;
    let email = document.getElementById("email").value;
    let signupDate = new Date().toLocaleString(); // 가입 시간 기록

    if (!username || !password || !nickname || !email) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    if (localStorage.getItem(username)) {
        alert("이미 존재하는 아이디입니다.");
        return;
    }

    let userData = {
        username: username,
        password: password,
        nickname: nickname,
        email: email,
        signupDate: signupDate
    };

    localStorage.setItem(username, JSON.stringify(userData));

    // 회원 정보 리스트에도 추가
    let storedUsers = localStorage.getItem("loginUsers");
    let users = storedUsers ? JSON.parse(storedUsers) : [];
    users.push(userData);
    localStorage.setItem("loginUsers", JSON.stringify(users));

    // 회원 정보 HTML 저장
    saveUserInfoToHTML(userData);

    alert("회원가입이 완료되었습니다. 로그인 해주세요.");
    location.href = "Login.html"; // 로그인 페이지로 이동
}

// 회원 정보를 LoginInformation.html에 저장하는 함수
function saveUserInfoToHTML(userData) {
    let storedUsers = localStorage.getItem("loginUsers");
    let users = storedUsers ? JSON.parse(storedUsers) : [];

    users.push(userData);
    localStorage.setItem("loginUsers", JSON.stringify(users));

    // LoginInformation.html을 업데이트
    let loginInfoPage = localStorage.getItem("loginInformation");
    let loginHTML = loginInfoPage ? JSON.parse(loginInfoPage) : [];

    loginHTML.push(`
        <tr>
            <td>${userData.username}</td>
            <td>${userData.nickname}</td>
            <td>${userData.email}</td>
            <td>${userData.signupDate}</td>
        </tr>
    `);

    localStorage.setItem("loginInformation", JSON.stringify(loginHTML));
}

// 로그인 함수
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (!username || !password) {
        alert("아이디와 비밀번호를 입력해주세요.");
        return;
    }

    let storedUsers = localStorage.getItem("loginUsers");
    if (!storedUsers) {
        alert("회원가입 정보가 없습니다.");
        return;
    }

    let users = JSON.parse(storedUsers);
    let userData = users.find(user => user.username === username);

    if (!userData) {
        alert("존재하지 않는 아이디입니다.");
        return;
    }

    if (userData.password !== password) {
        alert("비밀번호가 틀렸습니다.");
        return;
    }

    localStorage.setItem("loggedInUser", username); // 로그인한 유저 저장
    alert("로그인 성공!");
    location.href = "CreateResume.html"; // 로그인 성공 후 이력서 작성 화면으로 이동
}

// 회원 탈퇴 함수
function deleteAccount() {
    let username = localStorage.getItem("loggedInUser");
    if (!username) {
        alert("로그인이 필요합니다.");
        location.href = "Login.html";
        return;
    }

    let userData = JSON.parse(localStorage.getItem(username));
    let nickname = userData.nickname;

    let confirmDelete = prompt(`정말로 삭제하시겠습니까?\n계정을 삭제하려면 닉네임 '${nickname}'을 입력하세요.`);
    
    if (confirmDelete === null) {
        return; // 사용자가 취소 버튼을 누르면 탈퇴 중단
    }

    if (confirmDelete !== nickname) {
        alert("닉네임이 일치하지 않습니다. 탈퇴가 취소되었습니다.");
        return;
    }

    // 계정 삭제
    localStorage.removeItem(username);

    // 전체 회원 목록에서도 삭제
    let storedUsers = localStorage.getItem("loginUsers");
    if (storedUsers) {
        let users = JSON.parse(storedUsers);
        let updatedUsers = users.filter(user => user.username !== username);
        localStorage.setItem("loginUsers", JSON.stringify(updatedUsers));
    }

    localStorage.removeItem("loggedInUser"); // 현재 로그인 상태 삭제
    alert("계정이 삭제되었습니다.");
    location.href = "Login.html"; // 로그인 화면으로 이동
}

// 이력서 DOCX 첫 페이지를 이미지로 변환 후 미리보기 적용
function loadResumePreviews() {
    let resumeFiles = [
        { docx: "../file관리/2018 최신 이력서 기본형.docx", img: "2018_최신_이력서_기본형.png", id: "resume1" },
        { docx: "../file관리/2018 최신 이력서 기본형2.docx", img: "2018_최신_이력서_기본형2.png", id: "resume2" },
        { docx: "../file관리/2018 최신 이력서 라인형.docx", img: "2018_최신_이력서_라인형.png", id: "resume3" }
    ];

    resumeFiles.forEach(file => {
        convertDocxToImage(file.docx, file.img, file.id);
    });
}

// DOCX → 이미지 변환 API 연동 (예제)
async function convertDocxToImage(docxPath, outputPath, imageId) {
    const response = await fetch(docxPath);
    const blob = await response.blob();
    
    let formData = new FormData();
    formData.append("file", blob, "document.docx");

    fetch("https://api.example.com/convert", { // DOCX → Image 변환 API (예제)
        method: "POST",
        body: formData
    })
    .then(response => response.blob())
    .then(imageBlob => {
        let imgURL = URL.createObjectURL(imageBlob);
        saveImage(outputPath, imgURL, imageId);
    })
    .catch(error => console.error("문서 변환 오류:", error));
}

function saveImage(outputPath, imgURL, imageId) {
    localStorage.setItem(outputPath, imgURL);
    document.getElementById(imageId).src = imgURL;
}
