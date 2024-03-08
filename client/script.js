const msgs = [];

const SERVER_URL = "https://blue-js-api.vercel.app/msg";

const randomColors = Array.from({ length: 30 }, (_a, index) => {
    return `hsl(${index * 27}, 40%, 50%)`;
});

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
            username: "Anonymous",
            photo: `https://i.pravatar.cc/150?img=${Math.floor(
                Math.random() * 70
            )}`,
        };

        msgs.push(message);
        messageServerService.sendMessage(message);

        update(msgs);

        document
            .getElementById("messages")
            .lastElementChild.scrollIntoView({ behavior: "smooth" });
    });

// Attach the initial load of messages
document.addEventListener("DOMContentLoaded", function () {
    const messageServerService = new MessageServerService();
    messageServerService.getMessages().then((messages) => {
        msgs.push(...messages);
        update(msgs);
    });
});

function update(arrayOfMessages) {
    var parent = document.getElementById("messages");
    parent.innerHTML = "";
    console.log(arrayOfMessages);

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
    });

    arrayOfMessages.forEach(function (message, index) {
        // ith message
        var messageDiv = parent.children[index];
        console.log(randomColors);
        messageDiv.querySelector(".messageRowTemplate_username").style.color =
            randomColors[message.username.length % randomColors.length];
        // arrayOfMessages[index].username;
    });
}
