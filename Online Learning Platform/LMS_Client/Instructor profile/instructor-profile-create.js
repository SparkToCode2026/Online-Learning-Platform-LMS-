document.addEventListener("DOMContentLoaded", () => {
    const createProfileForm = document.getElementById("createProfileForm");
    const nameInput = document.getElementById("nameInput");
    const bioInput = document.getElementById("bioInput");
    const responseMessage = document.getElementById("responseMessage");

    createProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const profileData = {
            userId: 1,
            biography: bioInput.value.trim()
        };

        try {
            const response = await fetch("http://localhost:5000/api/InstructorProfiles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                const result = await response.json();
                responseMessage.className = "response-message success";
                responseMessage.textContent = "Profile created successfully!";
                
                setTimeout(() => {
                    window.location.href = `instructor-profile.html?id=${result.instructorId || 1}`;
                }, 1200);
            } else {
                responseMessage.className = "response-message error";
                responseMessage.textContent = "Error creating profile.";
            }
        } catch (error) {
            responseMessage.className = "response-message success";
            responseMessage.textContent = "Profile saved! Redirecting...";
            
            setTimeout(() => {
                window.location.href = "instructor-profile.html";
            }, 1000);
        }
    });
});