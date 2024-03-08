const msgs = [];

document
    .getElementById("newMessageForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();
        const form = e.target;
        const message = new FormData(form).get("message");
        form.reset();
        msgs.push({ msg: message });
        update(msgs);
    });

function update(arrayOfMessages) {
    var parent = document.getElementById("messages");
    parent.innerHTML = "";
    console.log(arrayOfMessages);

    arrayOfMessages.forEach(function (message) {
        var article = document.createElement("article");
        var div = document.createElement("div");
        div.className = "flex justify-between";
        var h3 = document.createElement("h3");
        var span = document.createElement("span");
        h3.innerText = message.msg;
        span.innerText = "Jean Michel";
        div.appendChild(h3);
        div.appendChild(span);
        article.appendChild(div);
        parent.appendChild(article);
    });
}
