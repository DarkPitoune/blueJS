const msgs = [];

const SERVER_URL = "https://blue-js-api.vercel.app/msg";

const randomColors = Array.from({ length: 30 }, (_a, index) => {
    return `hsl(${index * 27}, 40%, 50%)`;
});

const getUserName = () => localStorage.getItem("username") || "Anonymous";

const randomPhoto = `https://i.pravatar.cc/150?img=${Math.floor(
    Math.random() * 70,
)}`;
const getUserPhoto = () => localStorage.getItem("photo") || randomPhoto;

class MessageServerService {
    sendMessage(message) {
        fetch(SERVER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });
    }

    getMessages() {
        return fetch(SERVER_URL).then((res) => res.json());
    }
}

const messageServerService = new MessageServerService();

const scrollToBottom = (opts = {}) => {
    document.getElementById("messages").lastElementChild.scrollIntoView(opts);
};

// Attach the post message handler
document
    .getElementById("newMessageForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        form.reset();

        const message = {
            content: formData.get("message"),
            date: new Date(),
            username: getUserName(),
            photo: getUserPhoto(),
        };

        msgs.push(message);
        messageServerService.sendMessage(message);

        update(msgs);
        scrollToBottom({ behavior: "smooth" });
    });

// Attach the initial load of messages
document.addEventListener("DOMContentLoaded", function () {
    const messageServerService = new MessageServerService();
    messageServerService
        .getMessages()
        .then((messages) => {
            msgs.push(...messages);
            update(msgs);
        })
        .then(scrollToBottom);
});

function update(arrayOfMessages) {
    var parent = document.getElementById("messages");
    parent.innerHTML = "";

    arrayOfMessages.forEach(function (message, index) {
        var template = document.querySelector("#messageRowTemplate");
        var clone = document.importNode(template.content, true);
        clone.querySelector(".messageRowTemplate_content").textContent =
            message.content;
        clone.querySelector(".messageRowTemplate_date").textContent = new Date(
            message.date,
        ).toLocaleTimeString();
        clone.querySelector(".messageRowTemplate_username").textContent =
            message.username;
        clone.querySelector(".messageRowTemplate_photo").src = message.photo;

        didISendTheMessage =
            message.username === getUserName() &&
            message.username !== "Anonymous";

        clone
            .querySelector("article")
            .classList.add(didISendTheMessage ? "sent" : "received");

        parent.appendChild(clone);
    });

    arrayOfMessages.forEach(function (message, index) {
        var messageDiv = parent.children[index];
        messageDiv.querySelector(".messageRowTemplate_username").style.color =
            randomColors[message.username.length % randomColors.length];
    });
}

// everything related to the username input
const getUserNameInput = () => document.querySelector("#usernameInput");

function syncUsername(textValue) {
    if (textValue.length > 15) textValue = textValue.slice(0, 15);
    getUserNameInput().value = textValue;
    getUserNameInput().style.width = textValue.length + "ch";
}

getUserNameInput().addEventListener("input", (e) =>
    syncUsername(e.target.value),
);

getUserNameInput().addEventListener("blur", function (e) {
    localStorage.setItem("username", e.target.value);
});

document.addEventListener("DOMContentLoaded", () => {
    syncUsername(getUserName());
});

// everything related to the photo input
const getUserPhotoInput = () => document.querySelector("#photoInput");
const getProfilePhoto = () => document.querySelector("#profilePhoto");

getUserPhotoInput().addEventListener("blur", (e) => {
    getProfilePhoto().src = e.target.value;
    localStorage.setItem("photo", e.target.value);
});

document.addEventListener("DOMContentLoaded", () => {
    getProfilePhoto().src = getUserPhoto();
});
