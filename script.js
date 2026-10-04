alert("BlueChat JS is working!");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chat = document.getElementById("chat");

// رابط Webhook الخاص بـ n8n
const webhookURL = "https://abdou01.app.n8n.cloud/webhook/bluechat";


/* =========================
   ارتفاع الشاشة الحقيقي
   يتعامل مع لوحة مفاتيح الهاتف
========================= */

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

    window.visualViewport.addEventListener(
        "scroll",
        updateViewportHeight
    );

}

window.addEventListener(
    "resize",
    updateViewportHeight
);


/* =========================
   تمرير المحادثة للأسفل
========================= */

function scrollChatToBottom() {

    requestAnimationFrame(() => {

        chat.scrollTop = chat.scrollHeight;

    });

}


/* =========================
   تكبير خانة الكتابة
========================= */

function resizeMessageInput() {

    messageInput.style.height = "auto";

    const newHeight = Math.min(
        messageInput.scrollHeight,
        140
    );

    messageInput.style.height = newHeight + "px";
}


/* =========================
   إرسال الرسالة
========================= */

async function sendMessage() {

    const text = messageInput.value.trim();

    if (text === "") return;


    /* =========================
       عرض رسالة المستخدم
    ========================= */

    const userMsg = document.createElement("div");

    userMsg.className = "user-message";

    userMsg.textContent = text;

    chat.appendChild(userMsg);


    /* =========================
       تنظيف خانة الكتابة
    ========================= */

    messageInput.value = "";

    messageInput.style.height = "48px";


    scrollChatToBottom();


    /* =========================
       إرسال الرسالة إلى n8n
    ========================= */

    try {

        const response = await fetch(webhookURL, {

            method: "POST",

            body: JSON.stringify({
                message: text
            })

        });


        const data = await response.json();

console.log("رد n8n:", data);
alert(JSON.stringify(data));

        /* =========================
           عرض رد BlueChat
        ========================= */

        const botMsg = document.createElement("div");

        botMsg.className = "bot-message";

        botMsg.textContent = data.reply;

        chat.appendChild(botMsg);


        scrollChatToBottom();


    } catch (error) {

        console.error("حدث خطأ:", error);

    }

}


/* =========================
   زر الإرسال
========================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);


/* =========================
   الكتابة داخل textarea
========================= */

messageInput.addEventListener(
    "input",
    resizeMessageInput
);


/* =========================
   Enter / Shift + Enter
========================= */

messageInput.addEventListener(
    "keydown",
    function(e) {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            sendMessage();

        }

    }
);


/* =========================
   عند فتح لوحة المفاتيح
========================= */

messageInput.addEventListener(
    "focus",
    function() {

        setTimeout(() => {

            updateViewportHeight();

            scrollChatToBottom();

        }, 250);

    }
);