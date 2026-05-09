console.log("UI Loaded 🚀");

// future enhancement: active link highlight
const links = document.querySelectorAll(".link");

links.forEach(link => {
  link.addEventListener("click", () => {
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});