document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch("/submit-feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const message = await response.text();
  document.getElementById("message").textContent = message;
  e.target.reset();
});
