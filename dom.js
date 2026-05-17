import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({
  breaks: true,
  gfm: true,
});

export async function renderNewMessage(text, role) {
  const id = createMessage(role);

  updateStreamingMessage(id, text);

  return id;
}

export function createStreamingMessage() {
  return createMessage("assistant");
}

function createMessage(role) {
  const conversationContainer = document.getElementById("conversation");

  const row = document.createElement("div");

  const id = "msg-" + Date.now();

  row.className = `message-row ${role}`;

  row.id = id;

  const article = document.createElement("article");

  article.className = role === "assistant" ? "ai-message" : "user-message";

  row.appendChild(article);

  conversationContainer.appendChild(row);

  scrollToBottom();

  return id;
}

export function updateStreamingMessage(id, text) {
  const row = document.getElementById(id);

  if (!row) return;

  const article = row.querySelector("article");

  try {
    const rawHtml = marked.parse(text || "");

    const cleanHtml = DOMPurify.sanitize(rawHtml);

    article.innerHTML = cleanHtml;
  } catch (err) {
    article.textContent = text;
  }

  scrollToBottom();
}

export function showTypingIndicator() {
  const id = createMessage("assistant");

  const row = document.getElementById(id);

  const article = row.querySelector("article");

  article.innerHTML = `
    <div class="typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  return id;
}

export function removeTypingIndicator(id) {
  const el = document.getElementById(id);

  if (el) el.remove();
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    const container = document.getElementById("conversation");

    container.scrollTop = container.scrollHeight;
  });
}
