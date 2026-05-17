import {
  renderNewMessage,
  createStreamingMessage,
  updateStreamingMessage,
  showTypingIndicator,
  removeTypingIndicator,
} from "./dom.js";

const input =
  document.getElementById("user-input");

const button =
  document.getElementById("submit-btn");

async function agent(query) {
  // render user message
  await renderNewMessage(query, "user");

  // disable typing
  setLoading(true);

  // show typing animation
  const typingId =
    showTypingIndicator();

  try {
    const response = await fetch(
      "http://localhost:3000/api/chat",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          message: query,
        }),
      }
    );

    // remove typing dots
    removeTypingIndicator(typingId);

    // create empty assistant message
    const messageId =
      createStreamingMessage();

    // STREAM READER
    const reader =
      response.body.getReader();

    const decoder =
      new TextDecoder();

    let fullText = "";

    while (true) {
      const { done, value } =
        await reader.read();

      if (done) break;

      const chunk =
        decoder.decode(value);

      fullText += chunk;

      updateStreamingMessage(
        messageId,
        fullText
      );
    }
  } catch (err) {
    console.error(err);

    await renderNewMessage(
      "Something went wrong",
      "assistant"
    );
  } finally {
    setLoading(false);
  }
}

function setLoading(state) {
  input.disabled = state;

  button.disabled = state;

  input.placeholder = state
    ? "AI is thinking..."
    : "Type message here...";
}

document
  .getElementById("form")
  .addEventListener(
    "submit",
    async function (event) {
      event.preventDefault();

      const formData =
        new FormData(event.target);

      const query =
        formData.get("user-input");

      if (!query.trim()) return;

      event.target.reset();

      await agent(query);
    }
  );