const msgs = [];

document
    .getElementById("newMessageForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();
        const form = e.target;
        const message = new FormData(form).get("message");
        form.reset();
        msgs.push({
            msg: message,
            date: new Date(),
            username: "Anonymous",
            photo: `https://i.pravatar.cc/150?img=${Math.floor(
                Math.random() * 70
            )}`,
        });
        update(msgs);
    });

function update(arrayOfMessages) {
    var parent = document.getElementById("messages");
    parent.innerHTML = "";
    console.log(arrayOfMessages);

    arrayOfMessages.forEach(function (message, index) {
        var template = document.querySelector("#messageRowTemplate");
        var clone = document.importNode(template.content, true);

        console.log(clone);

        clone.querySelector(".messageRowTemplate_content").textContent =
            message.msg;
        clone.querySelector(".messageRowTemplate_date").textContent =
            message.date.toLocaleTimeString();
        clone.querySelector(".messageRowTemplate_username").textContent =
            message.username;
        clone.querySelector(".messageRowTemplate_photo").src = message.photo;
        parent.appendChild(clone);

        if (index === arrayOfMessages.length - 1) {
            clone.scrollIntoView({ behavior: "smooth" });
        }
    });
}
