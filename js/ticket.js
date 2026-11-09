
const registrationData = localStorage.getItem("registration");

if (registrationData) {

    const registration = JSON.parse(registrationData);

    document.getElementById("ticketFullName").textContent =
        registration.fullName;

    document.getElementById("ticketEmail").textContent =
        registration.email;

    const githubLink = document.getElementById("ticketGithub");

    githubLink.textContent = registration.github;

    const githubUsername = registration.github.substring(1);

    githubLink.href = "https://github.com/" + githubUsername;

    document.getElementById("ticketAvatar").src =
        registration.avatar;

} else {

    // Return to registration if no saved information exists

    window.location.href = "login.html";

}
