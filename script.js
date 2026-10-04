const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chat = document.getElementById("chat");

// رابط Webhook الخاص بـ n8n
const webhookURL = "https://abdou01.app.n8n.cloud/webhook/bluechat";


// =========================
// ارتفاع الشاشة مع لوحة المفاتيح
// =========================

function updateViewportHeight() {

    if (window.visualViewport) {

        document.documentElement.style.setProperty(
            "--app-height",
            window.visualViewport.height + "px"
        );

    } else {

        document.documentElement.style.setProperty(
            "--app-height",
            window.innerHeight + "px"
        );

    }
}

updateViewportHeight();

if (window.visualViewport) {

    window.visualViewport.addEventListener(
        "resize",
        updateViewportHeight
    );

}

window.addEventListener(
    "resize",
    updateViewportHeight
);


// =========================
// تكبير خانة الكتابة
// =========================

function resizeMessageInput() {

    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 140) + "px";
}


// =========================
// إرسال الرسالة
// =========================

async function sendMessage() {

    const text = messageInput.value.trim();

    if (text === "") return;


    // عرض رسالة المستخدم
    const userMsg = document.createElement("div");

    userMsg.className = "user-message";

    userMsg.textContent = text;

    chat.appendChild(userMsg);


    // تفريغ خانة الكتابة
    messageInput.value = "";

    messageInput.style.height = "48px";


    // النزول إلى آخر رسالة
    chat.scrollTop = chat.scrollHeight;


    // =========================
    // إرسال الرسالة إلى n8n
    // =========================

    try {

        const response = await fetch(webhookURL, {

            method: "POST",

            body: JSON.stringify({
                message: text
            })

        });


        const data = await response.json();

        console.log("رد n8n:", data);


        // عرض رد البوت
        const botMsg = document.createElement("div");

        botMsg.className = "bot-message";

        botMsg.textContent = data.reply;

        chat.appendChild(botMsg);

        chat.scrollTop = chat.scrollHeight;


    } catch (error) {

        console.error("حدث خطأ:", error);

    }

}


// =========================
// زر الإرسال
// =========================

sendBtn.addEventListener(
    "click",
    sendMessage
);


// =========================
// الكتابة
// =========================

messageInput.addEventListener(
    "input",
    resizeMessageInput
);


// =========================
// Enter = إرسال
// Shift + Enter = سطر جديد
// =========================

messageInput.addEventListener(
    "keydown",
    function(e) {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            sendMessage();

        }

    }
);