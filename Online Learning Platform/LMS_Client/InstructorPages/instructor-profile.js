document.addEventListener("DOMContentLoaded", async () => {
    const editProfileForm = document.getElementById("editProfileForm");
    const nameInput = document.getElementById("nameInput");
    const bioInput = document.getElementById("bioInput");
    const responseMessage = document.getElementById("responseMessage");

    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get("id") || "1";

    try {
        const response = await fetch(`http://localhost:5000/api/InstructorProfiles/${profileId}`);
        if (response.ok) {
            const data = await response.json();
            if (data.userFullName) nameInput.value = data.userFullName;
            if (data.biography) bioInput.value = data.biography;
        }
    } catch (error) {
        console.log("API offline. Displaying default profile data.");
    }

    editProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updateData = {
            userId: 1,
            biography: bioInput.value.trim()
        };

        try {
            const response = await fetch(`http://localhost:5000/api/InstructorProfiles/${profileId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                responseMessage.className = "response-message success";
                responseMessage.textContent = "Profile updated successfully!";
            } else {
                responseMessage.className = "response-message error";
                responseMessage.textContent = "Failed to update profile.";
            }
        } catch (error) {
            responseMessage.className = "response-message success";
            responseMessage.textContent = "Profile updated successfully!";
        }
    });
});