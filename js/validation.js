
const registrationForm = document.getElementById("registrationForm");

const avatarInput = document.getElementById("avatar");
const avatarDropzone = document.getElementById("avatarDropzone");
const uploadContent = document.getElementById("uploadContent");

const avatarPreview = document.getElementById("avatarPreview");
const previewImage = document.getElementById("previewImage");
const avatarFileName = document.getElementById("avatarFileName");

const changeImage = document.getElementById("changeImage");
const removeImage = document.getElementById("removeImage");

const errorMessage = document.getElementById("errorMessage");

let selectedAvatar = null;
let avatarPreviewURL = null;

// Display and validate the selected image

function displayAvatar(file) {

    errorMessage.textContent = "";

    if (!file) {
        return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
        errorMessage.textContent =
            "Only JPG and PNG images are allowed.";

        avatarInput.value = "";
        return;
    }

    if (file.size > 500 * 1024) {
        errorMessage.textContent =
            "Your image must be smaller than 500 KB.";

        avatarInput.value = "";
        return;
    }

    selectedAvatar = file;

    if (avatarPreviewURL) {
        URL.revokeObjectURL(avatarPreviewURL);
    }

    avatarPreviewURL = URL.createObjectURL(file);

    previewImage.src = avatarPreviewURL;
    avatarFileName.textContent = file.name;

    avatarPreview.hidden = false;
    avatarDropzone.hidden = true;
}

// Open the file selector when the upload box is clicked

avatarDropzone.addEventListener("click", function() {
    avatarInput.click();
});

// Allow keyboard users to open the file selector

avatarDropzone.setAttribute("tabindex", "0");
avatarDropzone.setAttribute("role", "button");

avatarDropzone.addEventListener("keydown", function(event) {

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        avatarInput.click();
    }

});

// Display selected image

avatarInput.addEventListener("change", function() {

    const file = avatarInput.files[0];

    displayAvatar(file);

});

// Change uploaded image

changeImage.addEventListener("click", function() {
    avatarInput.click();
});

// Remove uploaded image

removeImage.addEventListener("click", function() {

    selectedAvatar = null;
    avatarInput.value = "";

    if (avatarPreviewURL) {
        URL.revokeObjectURL(avatarPreviewURL);
        avatarPreviewURL = null;
    }

    previewImage.src = "";
    avatarFileName.textContent = "";

    avatarPreview.hidden = true;
    avatarDropzone.hidden = false;

    errorMessage.textContent = "";

});

// Allow drag and drop

avatarDropzone.addEventListener("dragover", function(event) {
    event.preventDefault();
    avatarDropzone.classList.add("dragging");
});

avatarDropzone.addEventListener("dragleave", function() {
    avatarDropzone.classList.remove("dragging");
});

avatarDropzone.addEventListener("drop", function(event) {

    event.preventDefault();

    avatarDropzone.classList.remove("dragging");

    const file = event.dataTransfer.files[0];

    if (!file) {
        return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);

    avatarInput.files = transfer.files;

    displayAvatar(file);

});

// Submit registration form

registrationForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const fullName =
        document.getElementById("fullName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const github =
        document.getElementById("github").value.trim();

    errorMessage.textContent = "";

    if (fullName === "" || email === "" || github === "") {
        errorMessage.textContent = "Please complete all fields.";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        errorMessage.textContent = "Please enter a valid email address.";
        return;
    }

    if (!/^@[A-Za-z0-9-]+$/.test(github) ||
        github.length > 40 ||
        github === "@") {

        errorMessage.textContent =
            "Please enter a valid GitHub username beginning with @.";

        return;
    }

    if (!selectedAvatar) {
        errorMessage.textContent =
            "Please upload an avatar before generating your ticket.";

        return;
    }

    const reader = new FileReader();

    reader.onload = function() {

        const registration = {
            fullName: fullName,
            email: email,
            github: github,
            avatar: reader.result
        };

        try {

            localStorage.setItem(
                "registration",
                JSON.stringify(registration)
            );

            window.location.href = "ticket.html";

        } catch (error) {

            errorMessage.textContent =
                "Unable to save your information. Please try a smaller image.";

        }

    };

    reader.onerror = function() {

        errorMessage.textContent =
            "Unable to read the uploaded image. Please try another image.";

    };

    reader.readAsDataURL(selectedAvatar);

});
