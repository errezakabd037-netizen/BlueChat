const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chat = document.getElementById("chat");

// رابط Webhook الخاص بـ n8n
const webhookURL = "https://abdou01.app.n8n.cloud/webhook/bluechat"

async function sendMessage() {

    const text = messageInput.value.trim();

    if (text === "") return;


    // عرض رسالة المستخدم
    const userMsg = document.createElement("div");

    userMsg.className = "user-message";

    userMsg.textContent = text;

    chat.appendChild(userMsg);

    messageInput.value = "";

    chat.scrollTop = chat.scrollHeight;


    // إرسال الرسالة إلى n8n
    try {

        const response = await fetch(webhookURL, {

    method: "POST",

    body: JSON.stringify({
        message: text
    })

});


        const data = await response.json();

console.log("رد n8n:", data);

const botMsg = document.createElement("div");
botMsg.className = "bot-message";
botMsg.textContent = data.reply;

chat.appendChild(botMsg);
chat.scrollTop = chat.scrollHeight;


    } catch (error) {

        console.error("حدث خطأ:", error);

    }

}


// زر الإرسال
sendBtn.addEventListener("click", sendMessage);


// الضغط على Enter
messageInput.addEventListener("keypress", function(e) {

    if (e.key === "Enter") {

        sendMessage();

    }

});