var msgs = [];
const chns = [];
var openChannel = 1;

const SERVER_URL = "https://blue-js-api.vercel.app/";

const randomColors = Array.from({ length: 30 }, (_a, index) => {
    return `hsl(${index * 27}, 40%, 50%)`;
});

const getUserName = () => localStorage.getItem("username") || "Anonymous";

const defaultPhoto = `https://static.vecteezy.com/system/resources/previews/016/770/602/original/click-here-button-on-transparent-background-free-png.png`;
const getUserPhoto = () => localStorage.getItem("photo") || defaultPhoto;

class MessageServerService {
    sendMessage(message) {
        fetch(SERVER_URL + "msg/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });
    }

    getMessages() {
        return fetch(SERVER_URL + "msg/chn/" + openChannel).then((res) =>
            res.json()
        );
    }
}

const messageServerService = new MessageServerService();

class ChannelServerService {
    getChannels() {
        return fetch(SERVER_URL + "chn/").then((res) => res.json());
    }
}

const channelServerService = new ChannelServerService();

const scrollToBottom = (opts = {}) => {
    const msgListEl = document.getElementById("messages");
    if (msgListEl.children.length > 0)
        msgListEl.lastElementChild.scrollIntoView(opts);
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
            channel: openChannel,
        };

        msgs.push(message);
        messageServerService.sendMessage(message);

        updateMessages(msgs);
        scrollToBottom({ behavior: "smooth" });
    });

// Attach the initial load of messages and channels
const fetchAndRenderMessages = () => {
    messageServerService
        .getMessages()
        .then((messages) => {
            msgs = messages;
            updateMessages(msgs);
        })
        .then(scrollToBottom);
};

document.addEventListener("DOMContentLoaded", function () {
    fetchAndRenderMessages();

    channelServerService.getChannels().then((channels) => {
        chns.push(...channels);
        updateChannels(chns);
    });
});

function updateMessages(arrayOfMessages) {
    var parent = document.getElementById("messages");
    parent.innerHTML = "";

    arrayOfMessages.forEach(function (message, index) {
        var template = document.querySelector("#messageRowTemplate");
        var clone = document.importNode(template.content, true);
        clone.querySelector(".messageRowTemplate_content").textContent =
            message.content;
        clone.querySelector(".messageRowTemplate_date").textContent = new Date(
            message.date
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

const changeChannel = (channelId) => {
    if (channelId === openChannel) return;
    openChannel = channelId;
    fetchAndRenderMessages();
};

function updateChannels(arrayOfChannels) {
    var parent = document.getElementById("channels");
    parent.innerHTML = "";

    arrayOfChannels.forEach(function (channel, index) {
        var template = document.querySelector("#channelRowTemplate");
        var clone = document.importNode(template.content, true);
        clone.querySelector("#channelRowTemplate_name").textContent =
            channel.name;
        clone
            .querySelector("#channelRowTemplate_button")
            .addEventListener("click", function () {
                changeChannel(channel.id);
            });
        parent.appendChild(clone);
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
    syncUsername(e.target.value)
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
