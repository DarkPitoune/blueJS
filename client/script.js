const SERVER_URL = "https://blue-js-api.vercel.app/";

const getUserName = () => localStorage.getItem("username") || "Anonymous";

const defaultPhoto = `https://static.vecteezy.com/system/resources/previews/016/770/602/original/click-here-button-on-transparent-background-free-png.png`;
const getUserPhoto = () => localStorage.getItem("photo") || defaultPhoto;

/* -------------------------------------------------------------------------- */
/*                       Services (link to the backend)                       */
/* -------------------------------------------------------------------------- */

class MessageServerService {
    async sendMessage(message) {
        const res = await fetch(SERVER_URL + "msg/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });

        const data = await res.json();
        addMessageAndRefresh(data);
    }

    getMessages() {
        return fetch(
            SERVER_URL + "msg/chn/" + appStateRegistry.openChannel
        ).then((res) => res.json());
    }

    getMessage(id) {
        return fetch(SERVER_URL + "msg/" + id).then((res) => res.json());
    }
}

class ChannelServerService {
    getChannels() {
        return fetch(SERVER_URL + "chn/")
            .then((res) => res.json())
            .then((channels) =>
                channels.map((channel) => ({
                    ...channel,
                    upToDate: true,
                }))
            );
    }

    createChannel(name) {
        return fetch(SERVER_URL + "chn/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
    }
}

const messageServerService = new MessageServerService();
const channelServerService = new ChannelServerService();

/* -------------------------------------------------------------------------- */
/*                              State managements                             */
/* -------------------------------------------------------------------------- */

class AppStateRegistry {
    messages = [];
    channels = [];
    openChannel = 1;

    fetchAndRenderMessages() {
        messageServerService
            .getMessages()
            .then((messages) => {
                this.messages = [...messages];
                updateMessages(this.messages);
            })
            .then(scrollToBottom);
    }

    fetchAndRenderChannels() {
        channelServerService.getChannels().then((channels) => {
            this.channels = [...channels];
            updateChannels(this.channels);
        });
    }

    createAndRefetchChannels(name) {
        channelServerService.createChannel(name).then(() => {
            channelServerService.getChannels().then((channels) => {
                this.channels = [];
                this.channels.push(...channels);
                updateChannels(this.channels);
            });
        });
    }

    changeChannel(channelId) {
        if (channelId === this.openChannel) return;
        this.openChannel = channelId;
        this.markAsUpToDate(channelId);
        this.fetchAndRenderMessages();
    }

    addMessage(message) {
        this.messages.push(message);
    }

    findChannelById(channelId) {
        return this.channels.find((c) => c.id === channelId);
    }

    markAsUpToDate(channelId) {
        const channel = this.findChannelById(channelId);
        if (channel !== undefined) {
            channel.upToDate = true;
            updateChannels(this.channels);
        }
    }

    markAsNotUpToDate(channelId) {
        const channel = this.findChannelById(channelId);
        if (channel !== undefined) {
            channel.upToDate = false;
            updateChannels(this.channels);
        }
    }
}

const appStateRegistry = new AppStateRegistry();

/* -------------------------------------------------------------------------- */
/*                              DOM manipulations                             */
/* -------------------------------------------------------------------------- */

function addMessage(message, parent) {
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
        message.username === getUserName() && message.username !== "Anonymous";

    clone
        .querySelector("article")
        .classList.add(didISendTheMessage ? "sent" : "received");

    parent.appendChild(clone);
}

function setMessageColor(parent, message, index) {
    var messageDiv = parent.children[index];
    messageDiv.querySelector(".messageRowTemplate_username").style.color =
        randomColors[message.username.length % randomColors.length];
}

function updateMessages(arrayOfMessages) {
    var parent = document.getElementById("messages");
    parent.innerHTML = "";

    arrayOfMessages.forEach(function (message, index) {
        addMessage(message, parent);
    });

    arrayOfMessages.forEach(function (message, index) {
        setMessageColor(parent, message, index);
    });
}

function updateChannels(arrayOfChannels) {
    var parent = document.getElementById("channels");
    parent.innerHTML = "";

    arrayOfChannels.forEach(function (channel, index) {
        var template = document.querySelector("#channelRowTemplate");
        var clone = document.importNode(template.content, true);
        clone.querySelector("#channelRowTemplate_name_text").textContent =
            channel.name;
        clone
            .querySelector("#channelRowTemplate_button")
            .addEventListener("click", function () {
                appStateRegistry.changeChannel(channel.id);
            });
        parent.appendChild(clone);
    });

    arrayOfChannels.forEach(function (channel, index) {
        var child = parent.children[index];
        child.querySelector("#channelRowTemplate_name_badge").className =
            channel.upToDate ? "invisible" : "visible";
        if (channel.id === appStateRegistry.openChannel) {
            child.querySelector("#channelRowTemplate_name_text").className =
                "font-bold pl-1";
        }
    });
}

function addMessageAndRefresh(message) {
    var parent = document.getElementById("messages");

    if (appStateRegistry.messages.find((m) => m.id === message.id)) return;
    appStateRegistry.addMessage(message);
    addMessage(message, parent);
    setMessageColor(parent, message, appStateRegistry.messages.length - 1);
    scrollToBottom({ behavior: "smooth" });
}

/* -------------------------------------------------------------------------- */
/*                                  DOM utils                                 */
/* -------------------------------------------------------------------------- */

const scrollToBottom = (opts = {}) => {
    const msgListEl = document.getElementById("messages");
    if (msgListEl.children.length > 0)
        msgListEl.lastElementChild.scrollIntoView(opts);
};

const randomColors = Array.from({ length: 30 }, (_a, index) => {
    return `hsl(${index * 27}, 40%, 50%)`;
});

/* -------------------------------------------------------------------------- */
/*                         Attach DOM event listeners                         */
/* -------------------------------------------------------------------------- */

// Attach the post message handler
document
    .getElementById("newMessageForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        form.reset();

        messageServerService.sendMessage({
            content: formData.get("message"),
            date: new Date(),
            username: getUserName(),
            photo: getUserPhoto(),
            channel: appStateRegistry.openChannel,
        });
    });

// Attach the create channel handler
document
    .getElementById("newChannelForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        form.reset();

        appStateRegistry.createAndRefetchChannels(formData.get("channelName"));
    });

document.addEventListener("DOMContentLoaded", function () {
    appStateRegistry.fetchAndRenderMessages();
    appStateRegistry.fetchAndRenderChannels();
});

/* -------------------------------------------------------------------------- */
/*                   Local storage user (to be deprecated?)                   */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                 Auth utils                                 */
/* -------------------------------------------------------------------------- */

function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}

function setCookie(name, value) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function handleAuthResponse(data) {
    setCookie("session-token", data);
    const parsedData = parseJwt(data);
    console.log(parsedData);
    localStorage.setItem("username", parsedData.given_name);
    localStorage.setItem("photo", parsedData.picture);
}

/* -------------------------------------------------------------------------- */
/*                        Realtime refresh of messages                        */
/* -------------------------------------------------------------------------- */

const realtime = new Ably.Realtime({
    authUrl: `${SERVER_URL}rt/subscribe`,
    authMethod: "POST",
});

realtime.connection.once("connected", () => {
    const channel = realtime.channels.get("messages");
    channel.subscribe("new_message", (msg) => {
        const { channelId, messageId } = msg.data;
        if (channelId !== appStateRegistry.openChannel) {
            appStateRegistry.markAsNotUpToDate(channelId);
            return;
        }

        if (appStateRegistry.messages.find((m) => m.id === messageId)) return;

        messageServerService.getMessage(messageId).then(addMessageAndRefresh);
    });
});
