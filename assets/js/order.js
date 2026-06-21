// order.js – DSC Desk order flow (Step 1 + Step 2 + backend integration)

// -----------------------------
// State
// -----------------------------
let selectedDscType = null;
let currentOrderId = null;

// -----------------------------
// Helpers
// -----------------------------
function getValue(id) {
    return document.getElementById(id).value.trim();
}

function showStep(step) {
    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.add("hidden");

    if (step === 1) {
        document.getElementById("step1").classList.remove("hidden");
    } else if (step === 2) {
        document.getElementById("step2").classList.remove("hidden");
    }
}

// -----------------------------
// DSC type change → renewal + org/only_token UI
// -----------------------------
document.getElementById("dscType").addEventListener("change", function () {
    const renewalDiv = document.getElementById("renewalTokenDiv");
    const authDiv = document.getElementById("authLetterDiv");
    const onlyTokenNote = document.getElementById("onlyTokenNote");

    selectedDscType = this.value;

    // Renewal token question
    if (this.value === "renewal") {
        renewalDiv.classList.remove("hidden");
    } else {
        renewalDiv.classList.add("hidden");
    }

    // Org auth letter + only token note
    authDiv.classList.add("hidden");
    onlyTokenNote.classList.add("hidden");

    if (selectedDscType === "organization") {
        authDiv.classList.remove("hidden");
    }

    if (selectedDscType === "only_token") {
        onlyTokenNote.classList.remove("hidden");
    }
});

// -----------------------------
// Step 1 → Step 2 (create order)
// -----------------------------
document.getElementById("btnStep1Next").addEventListener("click", async function () {
    const required = ["fullName", "mobile", "email", "aadhaar", "pan", "address", "state", "pin", "dscType"];

    for (let id of required) {
        if (!getValue(id)) {
            alert("Please fill all required fields.");
            return;
        }
    }

    // Renewal extra validation
    if (getValue("dscType") === "renewal") {
        if (!getValue("renewalToken")) {
            alert("Please specify if you have a working token.");
            return;
        }
    }

    selectedDscType = getValue("dscType");

    // Configure Step 2 visibility based on DSC type
    const authDiv = document.getElementById("authLetterDiv");
    const onlyTokenNote = document.getElementById("onlyTokenNote");

    authDiv.classList.add("hidden");
    onlyTokenNote.classList.add("hidden");

    if (selectedDscType === "organization") {
        authDiv.classList.remove("hidden");
    }

    if (selectedDscType === "only_token") {
        onlyTokenNote.classList.remove("hidden");
    }

    // -----------------------------
    // Create order in backend
    // -----------------------------
    const uploadStatus = document.getElementById("uploadStatus");
    uploadStatus.textContent = "Creating your order… please wait.";

    const orderPayload = {
        name: getValue("fullName"),
        phone: getValue("mobile"),
        email: getValue("email"),
        dsc_type: selectedDscType,
        aadhaar_last4: getValue("aadhaar"),
        pan: getValue("pan"),
        address: getValue("address"),
        state: getValue("state"),
        pin: getValue("pin"),
        renewal_token_choice: getValue("renewalToken") || null
    };

    try {
        // Adjust this path if your Worker is on a custom route
        const res = await fetch("/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload)
        });

        if (!res.ok) {
            throw new Error("Order creation failed");
        }

        const data = await res.json();
        currentOrderId = data.order_id;

        uploadStatus.textContent = "Order created successfully. Now upload your documents.";

        // Move to Step 2
        showStep(2);
    } catch (err) {
        console.error(err);
        uploadStatus.textContent = "Error creating order. Please try again.";
        alert("There was an error creating your order. Please try again.");
    }
});

// -----------------------------
// Step 2 → Back to Step 1
// -----------------------------
document.getElementById("btnStep2Back").addEventListener("click", function () {
    showStep(1);
});

// -----------------------------
// Step 2 → Upload & continue
// -----------------------------
document.getElementById("btnStep2Next").addEventListener("click", async function () {
    const uploadStatus = document.getElementById("uploadStatus");

    if (!currentOrderId) {
        alert("Order not found. Please go back and try again.");
        return;
    }

    // For "only_token", skip upload
    if (selectedDscType === "only_token") {
        uploadStatus.textContent = "No documents required for Only Token. Proceeding to payment step…";
        // TODO: navigate to Step 3 (payment)
        return;
    }

    const aadhaarFile = document.getElementById("aadhaarFile").files[0];
    const panFile = document.getElementById("panFile").files[0];
    const photoFile = document.getElementById("photoFile").files[0];
    const authLetterFile = document.getElementById("authLetterFile")?.files[0];

    if (!aadhaarFile || !panFile || !photoFile) {
        alert("Please upload Aadhaar, PAN, and Photo.");
        return;
    }

    if (selectedDscType === "organization" && !authLetterFile) {
        alert("Authorization Letter is required for Organization DSC.");
        return;
    }

    const formData = new FormData();
    formData.append("order_id", currentOrderId);
    formData.append("aadhaar", aadhaarFile);
    formData.append("pan", panFile);
    formData.append("photo", photoFile);
    if (authLetterFile) formData.append("auth_letter", authLetterFile);
    formData.append("dsc_type", selectedDscType);

    uploadStatus.textContent = "Uploading documents… please wait.";

    try {
        // Adjust this path if your Worker is on a custom route
        const res = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            throw new Error("Upload failed");
        }

        const data = await res.json();
        console.log("Uploaded document metadata:", data);

        uploadStatus.textContent = "Documents uploaded successfully. Proceeding to payment…";

        // TODO: navigate to Step 3 (payment)
    } catch (err) {
        console.error(err);
        uploadStatus.textContent = "Error uploading documents. Please try again.";
        alert("There was an error uploading your documents.");
    }
});
