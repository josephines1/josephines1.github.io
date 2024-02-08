// Fetch Portfolios Data
document.addEventListener("DOMContentLoaded", async function () {
  const portfolios = await getPortfolios();
  updateViewPortfolios(portfolios);
  console.log("ok");
});

function getPortfolios() {
  return fetch("json/portfolio.json").then((response) => response.json());
}

function updateViewPortfolios(results) {
  let portfolios = "";
  results.forEach((result) => (portfolios += showPortfolios(result)));
  const portfoliosContainer = document.getElementById("portfolios-container");
  portfoliosContainer.innerHTML = portfolios;
}

function showPortfolios(portfolio) {
  if (portfolio.webLink !== null) {
    view = `<div class="work-card show">
              <div class="work-card-img-wrapper">
                <img
                  src="img/works/${portfolio.image}"
                  alt="${portfolio.name}"
                  class="work-card-img"
                />
              </div>
              <div class="work-card-text-wrapper">
                <div class="work-card-name">
                  <h3>${portfolio.name}</h3>
                </div>
                <div class="work-card-desc">
                  <p>${portfolio.desc}</p>
                </div>
                <div class="work-card-cta">
                  <a
                    href="${portfolio.webLink}"
                    target="_blank"
                    class="work-cta-website"
                    ><i class="fa-solid fa-arrow-up-right-from-square"></i
                    ><span>visit website</span></a
                  >
                  <a
                    href="${portfolio.codeLink}"
                    target="_blank"
                    class="work-cta-code"
                    ><i class="fa-brands fa-github"></i><span>view code</span></a
                  >
                </div>
              </div>
            </div>`;
  } else {
    view = `<div class="work-card show">
              <div class="work-card-img-wrapper">
                <img
                  src="img/works/${portfolio.image}"
                  alt="${portfolio.name}"
                  class="work-card-img"
                />
              </div>
              <div class="work-card-text-wrapper">
                <div class="work-card-name">
                  <h3>${portfolio.name}</h3>
                </div>
                <div class="work-card-desc">
                  <p>${portfolio.desc}</p>
                </div>
                <div class="work-card-cta">                  
                  <a
                    href="${portfolio.codeLink}"
                    target="_blank"
                    class="work-cta-code"
                    ><i class="fa-brands fa-github"></i><span>view code</span></a
                  >
                </div>
              </div>
            </div>`;
  }

  return view;
}

const nav = document.getElementById("nav");
const hamburgerMenu = document.getElementById("hamburger-menu");
const closeButton = document.getElementById("close-button");
const navLinks = document.querySelectorAll(".nav-links");
const body = document.body;

// Scroll Behaviour
function disableScroll() {
  body.style.overflow = "hidden";
}

function enableScroll() {
  body.style.overflowX = "hidden";
  body.style.overflowY = "auto";
}

// Navbar on Mobile
if (hamburgerMenu) {
  hamburgerMenu.addEventListener("click", function () {
    nav.classList.add("open");
    if (nav.classList.contains("open")) {
      disableScroll();
    } else {
      enableScroll();
    }
    nav.style.overflow = "visible";
  });
}

function closeNavbar() {
  nav.classList.remove("open");
  enableScroll();
  nav.style.overflow = "hidden";
}

if (closeButton) {
  closeButton.addEventListener("click", function () {
    closeNavbar();
  });
}

if (navLinks) {
  navLinks.forEach(function (navLink) {
    navLink.addEventListener("click", function () {
      closeNavbar();
    });
  });
}

// Sticky Position for Navbar
var prevScrollpos = window.scrollY;
if (nav) {
  window.onscroll = function () {
    var currentScrollPos = window.scrollY;
    if (prevScrollpos > currentScrollPos) {
      nav.classList.remove("show");
    } else {
      nav.classList.add("show");
    }

    if (window.innerWidth > 800) {
      if (currentScrollPos > 20) {
        nav.style.backgroundColor = "#fff";
        nav.style.fontSize = "85%";
        nav.style.boxShadow = "0 1px 15px rgba(0, 0, 0, 0.2)";
      } else if (currentScrollPos === 0) {
        nav.style.backgroundColor = "transparent";
        nav.style.fontSize = "100%";
        nav.style.boxShadow = "none";
      }
    }

    if (window.innerWidth < 800 && nav.classList.contains("open")) {
      nav.style.top = "0px";
    } else {
      nav.style.removeProperty = "top";
    }
    prevScrollpos = currentScrollPos;
  };
}

// Contact Form Client-Side Validation
const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const message = document.getElementById("message");
const btnSubmit = document.querySelector(".btn-submit");
const btnLoading = document.querySelector(".btn-loading");
const myAlert = document.querySelector(".alert");
const formControls = document.querySelectorAll(".form-control");
const alertCloseButton = document.querySelector(".alert i");

if (alertCloseButton) {
  alertCloseButton.addEventListener("mouseover", function () {
    alertCloseButton.classList = "fa-solid fa-circle-xmark fa-xl";
  });
}

if (alertCloseButton) {
  alertCloseButton.addEventListener("mouseout", function () {
    alertCloseButton.classList = "fa-solid fa-circle-check fa-xl";
  });
}

if (alertCloseButton) {
  alertCloseButton.addEventListener("click", function () {
    myAlert.classList.toggle("d-none");
  });
}

// Collect Data to Google SpreadSheets
const form = document.forms["submit-to-google-sheet"];
const scriptURL =
  "https://script.google.com/macros/s/AKfycbwUshph9wd2BLhJgycz-oNY1qaBnMRjoeOIUGnFnN2ma-9-mIsU6GP5FebbEAdZ0abM/exec";

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!formValidation()) {
      return false;
    }

    // when submit button clicked
    // show loading button, remove submit button
    btnLoading.classList.toggle("d-none");
    btnSubmit.classList.toggle("d-none");

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((response) => {
        // remove loading button, show submit button
        btnLoading.classList.toggle("d-none");
        btnSubmit.classList.toggle("d-none");

        // show alert
        myAlert.classList.toggle("d-none");

        // reset the form
        form.reset();

        formControls.forEach(function (formControl) {
          formControl.classList = "form-control";
        });

        console.log("Success!", response);
      })
      .catch((error) => console.error("Error!", error.message));
  });
}

function formValidation() {
  const nameValue = name.value;
  const emailValue = email.value.trim();
  const phoneValue = phone.value.trim();
  const messageValue = message.value;

  if (nameValue === "") {
    setErrorFor(name, "Name cannot be blank");
  } else {
    setSuccessFor(name);
  }

  if (emailValue === "") {
    setErrorFor(email, "Email cannot be blank");
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Email is invalid");
  } else {
    setSuccessFor(email);
  }

  if (messageValue === "") {
    setErrorFor(message, "Message cannot be blank");
  } else {
    setSuccessFor(message);
  }

  return nameValue !== "" && isEmail(emailValue) && messageValue !== "";
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  formControl.classList = "form-control error";

  formControl.querySelector("small").innerText = message;
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.classList = "form-control success";
}

function isEmail(email) {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return emailRegex.test(email);
}
