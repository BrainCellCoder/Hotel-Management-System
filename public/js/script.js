const formCheckInput = document.querySelectorAll(".guest-number");
const numberOfGuest = document.querySelector(".number-of-guest");

for(let i=0;i<formCheckInput.length;i++){
    formCheckInput[i].addEventListener("click", ()=>{
        let number = formCheckInput[i].value;
        numberOfGuest.innerHTML = `<span>${number}</span> ${number > 1 ? "Guests" : "Guest"}`;
    })
}