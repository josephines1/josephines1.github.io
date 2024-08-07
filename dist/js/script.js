const jsonPath = "assets/json/data.json";

// Navbar
const checkbox = document.querySelector(".nav-mobile input");
const navLinksMobile = document.querySelector(".nav-links-mobile");
const navToggle = document.querySelector(".nav-mobile");

checkbox.addEventListener("click", function () {
  navLinksMobile.classList.toggle("active");
});

document.addEventListener("scroll", function () {
  const navbar = document.querySelector("nav");
  if (window.scrollY === 0) {
    navbar.classList.remove("scrolled");
  } else {
    navbar.classList.add("scrolled");
  }
});

document.addEventListener("click", function (e) {
  if (!navToggle.contains(e.target) && !navLinksMobile.contains(e.target)) {
    navLinksMobile.classList.remove("active");
    checkbox.checked = false;
  }
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
async function renderProjects(filterType = "all") {
  try {
    const projects = await getPortfolios();
    const projectsContainer = document.querySelector(".projects-container");

    projectsContainer.innerHTML = ""; // Clear previous projects

    projects.forEach((project) => {
      if (filterType === "all" || project.type === filterType) {
        // Create project item elements
        const projectItem = document.createElement("div");
        projectItem.classList.add("project-item");
        projectItem.classList.add("hidden"); // Initially hide project

        // Project type
        const typeBadge = document.createElement("div");
        typeBadge.classList.add("type-badge", project.type);
        typeBadge.innerHTML = `
            <span class="icon">&#9432;</span>
            ${
              project.type === "client-project"
                ? "Client Project"
                : "Self Project"
            }
        `;

        projectItem.appendChild(typeBadge);

        // Project image
        const image = document.createElement("img");
        image.src = `./assets/img/works/${project.image}`;
        image.alt = project.name;
        projectItem.appendChild(image);

        // Project details
        const details = document.createElement("div");
        details.classList.add("details");
        projectItem.appendChild(details);

        // Project title
        const title = document.createElement("h3");
        title.textContent = project.name;
        details.appendChild(title);

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

        details.appendChild(tools);

        // Project description
        const description = document.createElement("p");
        description.textContent = project.desc;
        details.appendChild(description);

        // Project links
        const links = document.createElement("div");
        links.classList.add("links");
        details.appendChild(links);

        // View code button
        if (project.codeLink) {
          const codeLinkBtn = document.createElement("a");
          codeLinkBtn.classList.add("project-link");
          codeLinkBtn.classList.add("code");
          codeLinkBtn.innerHTML = "<i class='fa-brands fa-github'></i>";
          codeLinkBtn.href = project.codeLink;
          codeLinkBtn.target = "_blank";
          links.appendChild(codeLinkBtn);
        }

        // View website button
        if (project.webLink) {
          const webLinkBtn = document.createElement("a");
          webLinkBtn.classList.add("project-link");
          webLinkBtn.innerHTML = "&#8599;";
          webLinkBtn.href = project.webLink;
          webLinkBtn.target = "_blank";
          links.appendChild(webLinkBtn);
        }

        if (!project.webLink && !project.codeLink) {
          const noLinkBtn = document.createElement("p");
          noLinkBtn.classList.add("no-link");
          noLinkBtn.textContent =
            "There is no direct link available for this project.";
          links.appendChild(noLinkBtn);
        }

        // Append project item to container
        projectsContainer.appendChild(projectItem);
      }
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

// Add event listeners to filter buttons
document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    const filterType = e.target.getAttribute("data-filter");

    // Remove active class from all buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });

    // Add selected class to the clicked button
    e.target.classList.add("selected");

    renderProjects(filterType);
  });
});

// Call the function to render projects with animation
renderProjects();

// About - Skills
const skillsContainer = document.querySelector(".skills-container");

// Function to fetch skills data
function fetchSkills(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching the skills:", error);
      throw error;
    });
}

// Function to render skills as badges
function renderSkills(skills, container) {
  skills.forEach((skill) => {
    const badge = document.createElement("div");
    badge.classList.add("badge");
    badge.classList.add("skill-badge");
    badge.classList.add("fade-in-up");

    const icon = document.createElement("i");
    icon.className = skill.icon; // Use icon class from JSON

    const textName = document.createElement("span");
    textName.textContent = skill.name;

    const scaleBar = document.createElement("div");
    scaleBar.className = "scale-bar";
    scaleBar.setAttribute("data-scale", `${(skill.scale / 4) * 100}%`);

    const tooltip = document.createElement("div");
    tooltip.className = "skill-tooltip";
    tooltip.textContent = `${(skill.scale / 4) * 100}%`;

    badge.appendChild(icon);
    badge.appendChild(scaleBar);
    badge.appendChild(textName);
    badge.appendChild(tooltip);

    container.appendChild(badge);

    // Observe the section for animation
    const aboutSection = document.querySelector("#about");

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const scaleBars = document.querySelectorAll(".scale-bar");
          scaleBars.forEach((scaleBar) => {
            scaleBar.style.width = scaleBar.getAttribute("data-scale");
            scaleBar.classList.add("animate");
          });
          observer.unobserve(entry.target); // Stop observing once the animation is triggered
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    observer.observe(aboutSection);
  });
}

// Main function to initialize fetching and rendering
function initializeSkills() {
  const skillsContainer = document.querySelector(".skills-container");
  fetchSkills(jsonPath).then((data) => {
    renderSkills(data.skills, skillsContainer);
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
