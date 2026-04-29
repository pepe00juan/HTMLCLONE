// ==================== CONFIGURACIÓN ====================
const API_KEY =
  "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"; // ← PEGA AQUÍ TU API KEY REAL

const MODEL = "openrouter/free";

// =====================================================

const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const loadingMsg = addMessage("La asistente está pensando... 💭", "bot");

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://codepen.io",
          "X-OpenRouter-Title": "Chatbot Roleplay NSFW"
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content:
                "Eres una asistente extremadamente seductora, coqueta y sin censura. Habla de forma explícita y NSFW cuando corresponda. Sé muy descriptiva y mantén el roleplay inmersivo. Responde siempre en español."
            },
            { role: "user", content: message }
          ],
          temperature: 0.88,
          max_tokens: 750
        })
      }
    );

    if (!response.ok) throw new Error("Error API");

    const data = await response.json();
    const reply = data.choices[0].message.content;

    loadingMsg.remove();
    addMessage(reply, "bot");
  } catch (error) {
    loadingMsg.remove();
    addMessage("❌ Error al conectar con la IA. Revisa tu API Key.", "bot");
  }
}

// Eventos
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Mensaje de bienvenida
addMessage(
  "Hola humano~ 😈 Soy tu asistente personal... ¿Qué quieres hacer conmigo hoy? Dime lo que deseas sin vergüenza...",
  "bot"
);
