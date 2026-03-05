document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("petition-form");
    const formContainer = document.getElementById("form-container");
    const successMsg = document.getElementById("already-signed-msg");
    const signatureList = document.getElementById("signature-list");
    const sigCountSpan = document.getElementById("sig-count");

    // We will use this array to mock a database for now
    let signatures = [
        { name: "Jane Doe", reason: "This is crucial for our future." },
        { name: "John Smith", reason: "Fully support this initiative." }
    ];

    // Check if the device has already signed using LocalStorage
    const hasSigned = localStorage.getItem("hasSignedPetition");

    if (hasSigned) {
        // Hide form, show success message
        formContainer.classList.add("hidden");
        successMsg.classList.remove("hidden");
    }

    // Render the initial mock signatures
    renderSignatures();

    // Handle form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page reload

        const nameInput = document.getElementById("name").value.trim();
        const reasonInput = document.getElementById("reason").value.trim();

        if (nameInput) {
            // 1. Add to our local list
            signatures.unshift({ name: nameInput, reason: reasonInput });
            
            // 2. Mark this device as having signed
            localStorage.setItem("hasSignedPetition", "true");
            
            // 3. Update the UI
            formContainer.classList.add("hidden");
            successMsg.classList.remove("hidden");
            renderSignatures();
        }
    });

    // Function to draw the signatures to the screen
    function renderSignatures() {
        signatureList.innerHTML = ""; // Clear current list
        sigCountSpan.innerText = signatures.length;

        signatures.forEach(sig => {
            const card = document.createElement("div");
            card.classList.add("signature-card");
            
            const nameEl = document.createElement("div");
            nameEl.classList.add("signature-name");
            nameEl.innerText = sig.name;
            
            card.appendChild(nameEl);

            if (sig.reason) {
                const reasonEl = document.createElement("div");
                reasonEl.classList.add("signature-reason");
                reasonEl.innerText = `"${sig.reason}"`;
                card.appendChild(reasonEl);
            }

            signatureList.appendChild(card);
        });
    }
});
