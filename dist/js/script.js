const jsonPath = "assets/json/data.json";

// Navbar
const checkbox = document.querySelector(".nav-mobile input");
const navMobile = document.querySelector(".nav-links-mobile");

checkbox.addEventListener("click", function () {
  navMobile.classList.toggle("active");
});

// Projects
// Function to fetch portfolios
async function getPortfolios() {
  try {
    let response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    return data.portfolios;
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return []; // Return empty array or handle error accordingly
  }
}

// Function to render projects with animation
async function renderProjects() {
  try {
    const projects = await getPortfolios();
    const projectsContainer = document.querySelector(".projects-container");

    projects.forEach((project, index) => {
      // Create project item elements
      const projectItem = document.createElement("div");
      projectItem.classList.add("project-item");
      projectItem.classList.add("hidden"); // Initially hide project

      // Project image
      const image = document.createElement("img");
      image.src = `./assets/img/works/${project.image}`;
      image.alt = project.name;
      projectItem.appendChild(image);

      // Project title
      const title = document.createElement("h3");
      title.textContent = project.name;
      projectItem.appendChild(title);

      // Project tools badges
      const tools = document.createElement("div");
      tools.classList.add("tools");

      // Split tools into an array (assuming they are comma-separated)
      const toolsArray = project.tools.split(", ");

      // Create badge for each tool
      toolsArray.forEach((tool) => {
        const badge = document.createElement("span");
        badge.classList.add("badge");
        badge.textContent = tool;
        tools.appendChild(badge);
      });

      projectItem.appendChild(tools);

      // Project description
      const description = document.createElement("p");
      description.textContent = project.desc;
      projectItem.appendChild(description);

      // View website button
      if (project.webLink) {
        const webLinkBtn = document.createElement("a");
        webLinkBtn.classList.add("button");
        webLinkBtn.textContent = "View Website";
        webLinkBtn.href = project.webLink;
        webLinkBtn.target = "_blank";
        projectItem.appendChild(webLinkBtn);
      }

      // View code button
      if (project.codeLink) {
        const codeLinkBtn = document.createElement("a");
        codeLinkBtn.classList.add("button");
        codeLinkBtn.classList.add("code");
        codeLinkBtn.textContent = "View Code";
        codeLinkBtn.href = project.codeLink;
        codeLinkBtn.target = "_blank";
        projectItem.appendChild(codeLinkBtn);
      }

      // Append project item to container
      projectsContainer.appendChild(projectItem);
    });

    // Add scroll event listener to trigger animation
    window.addEventListener("scroll", revealProjects);

    // Function to reveal projects when scrolled into view
    function revealProjects() {
      const projects = document.querySelectorAll(".project-item");

      projects.forEach((project) => {
        if (
          isElementInViewport(project) &&
          project.classList.contains("hidden")
        ) {
          project.classList.remove("hidden");
          project.classList.add("show");
        }
      });
    }

    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // Calculate the threshold for the element to be considered in viewport
      const threshold = rect.height / 2; // 50% threshold

      return (
        rect.top + threshold >= 0 && rect.bottom - threshold <= windowHeight
      );
    }

    // Initially trigger animation for projects in view
    revealProjects();
  } catch (error) {
    console.error("Error rendering projects:", error);
  }
}

// Call the function to render projects with animation
renderProjects();

// About - Skills
const skillsContainer = document.querySelector(".skills-container");

// Function to fetch tools data
function fetchTools(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching the tools:", error);
      throw error;
    });
}

// Function to render tools as badges
function renderTools(tools, container) {
  tools.forEach((tool) => {
    const badge = document.createElement("div");
    badge.classList.add("badge");
    badge.classList.add("fade-in-up");

    const icon = document.createElement("i");
    icon.className = tool.icon; // Use icon class from JSON

    badge.appendChild(icon);
    badge.appendChild(document.createTextNode(tool.name));

    container.appendChild(badge);
  });
}

// Main function to initialize fetching and rendering
function initializeSkills() {
  const skillsContainer = document.querySelector(".skills-container");
  fetchTools(jsonPath).then((data) => {
    renderTools(data.tools, skillsContainer);
  });
}

initializeSkills();

// Contact - Form
const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const message = document.getElementById("message");
const btnSubmit = document.querySelector(".btn-submit");
const formControls = document.querySelectorAll(".form-control");

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

    // Show loader and hide submit text
    btnSubmit.classList.add("loading");

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((response) => {
        // Handle success
        btnSubmit.classList.remove("loading");
        btnSubmit.classList.add("success");
        btnSubmit.querySelector(".button--text").innerText =
          "Sent successfully";

        // Reset form and any validation classes
        form.reset();

        formControls.forEach(function (formControl) {
          formControl.classList = "form-control";
        });

        console.log("Success!", response);
      })
      .catch((error) => {
        // Handle error
        console.error("Error!", error);
        btnSubmit.classList.remove("loading");
        btnSubmit.querySelector(".button--text").innerText = "Send";
      });
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

// Animasi
document.addEventListener("DOMContentLoaded", function () {
  // Hero Text
  document
    .querySelector("#hero .container .fade-in-down")
    .classList.add("active");

  // Footer
  const footerLogo = document.querySelector(".footer-logo");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        footerLogo.classList.add("animate");
        observer.unobserve(footerLogo); // stop observing once animation is triggered
      }
    });
  });

  observer.observe(footerLogo);
});

function addActiveClass(sectionId, offset, fadeClass) {
  var section = document.getElementById(sectionId);
  var sectionOffsetTop = section.offsetTop;
  if (window.scrollY > sectionOffsetTop - offset) {
    section.classList.add("active");
    document
      .querySelectorAll(`#${sectionId} .container .${fadeClass}`)
      .forEach(function (element) {
        element.classList.add("active");
      });
  }
}

document.addEventListener("scroll", function () {
  addActiveClass("projects", 400, "fade-in-up");
  addActiveClass("about", 400, "fade-in-up");
  addActiveClass("contact", 400, "fade-in-up");
  addActiveClass("contact", 400, "fade-in-right");
});
