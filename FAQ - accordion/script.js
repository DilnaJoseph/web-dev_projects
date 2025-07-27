
toggleButtons = document.querySelectorAll(".toggle-btn");


toggleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const qaItem = btn.closest(".qa"); 
    const answer = qaItem.querySelector(".answer");
    const icon = btn.querySelector("img");

    // if it is showing it closses otherwise it opens
    answer.classList.toggle("show");

    // check if currently showing if yes change icon
    if (answer.classList.contains("show")) {
      icon.src = "icon-minus.svg";
    } else {
      icon.src = "icon-plus.svg";
    }
  });
});