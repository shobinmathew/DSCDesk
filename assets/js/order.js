document.addEventListener("DOMContentLoaded", () => {

    let orderId = null;
    let selectedType = null;

    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");

    const btnStep1Next = document.getElementById("btnStep1Next");
    const btnStep2Next = document.getElementById("btnStep2Next");
    const btnStep2Back = document.getElementById("btnStep2Back");

    const dscType = document.getElementById("dscType");
    const renewalTokenDiv = document.getElementById("renewalTokenDiv");
    const authLetterDiv = document.getElementById("authLetterDiv");
    const onlyTokenNote = document.getElementById("onlyTokenNote");

    // Show/hide fields based on DSC type
    dscType.addEventListener("change", () => {
        selectedType = dscType.value;

        renewalTokenDiv.classList.add("hidden");
        authLetterDiv.classList.add("hidden");
        onlyTokenNote.classList.add("hidden");

        if (selectedType === "renewal") {
            renewalTokenDiv.classList.remove("hidden");
        }

        if (selectedType === "organization") {
            authLetterDiv.classList.remove("hidden");
        }

        if (selectedType === "only_token") {
            onlyTokenNote.classList.remove("hidden");
        }
    });

    // STEP 1 → Create Order
    btnStep1Next.addEventListener("click", async () => {

        const fullName = document.getElementById("fullName").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const email = document.getElementById("email").value.trim();
        const aadhaar = document.getElementById("aadhaar").value.trim();
        const pan = document.getElementById("pan").value.trim();
        const address = document.getElementById("address").value.trim();
        const state = document.getElementById("state").value.trim();
        const pin = document.getElementById("pin").value.trim();

        if (!fullName || !mobile || !email || !aadhaar || !pan || !address || !state || !pin || !selectedType) {
            alert("Please fill all fields.");
            return;
        }

        const payload = {
            fullName,
            mobile,
            email,
            aadhaar,
            pan,
            address,
            state,
            pin,
            dscType: selectedType
        };

        const res = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!data.success) {
            alert("Error creating order.");
            return;
        }

        orderId = data.orderId;

        step1.classList.add("hidden");
        step2.classList.remove("hidden");
    });

    // STEP 2 → Upload Documents
    btnStep2Next.addEventListener("click", async () => {

        if (selectedType === "only_token") {
            return showFinalScreen();
        }

        const uploadStatus = document.getElementById("uploadStatus");
        uploadStatus.innerText = "Uploading documents...";

        const filesToUpload = [];

        const aadhaarFile = document.getElementById("aadhaarFile").files[0];
        const panFile = document.getElementById("panFile").files[0];
        const photoFile = document.getElementById("photoFile").files[0];
        const authLetterFile = document.getElementById("authLetterFile")?.files[0];

        if (!aadhaarFile || !panFile || !photoFile) {
            alert("Please upload Aadhaar, PAN, and Photo.");
            return;
        }

        filesToUpload.push({ name: "aadhaar", file: aadhaarFile });
        filesToUpload.push({ name: "pan", file: panFile });
        filesToUpload.push({ name: "photo", file: photoFile });

        if (selectedType === "organization" && authLetterFile) {
            filesToUpload.push({ name: "authLetter", file: authLetterFile });
        }

        for (const item of filesToUpload) {
            const formData = new FormData();
            formData.append("file", item.file);

            const res = await fetch(`/api/upload?orderId=${orderId}&type=${item.name}`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!data.success) {
                alert(`Failed to upload ${item.name}`);
                return;
            }
        }

        uploadStatus.innerText = "All documents uploaded successfully.";

        showFinalScreen();
    });

    // Back button
    btnStep2Back.addEventListener("click", () => {
        step2.classList.add("hidden");
        step1.classList.remove("hidden");
    });

    // Final screen
    function showFinalScreen() {
        step2.classList.add("hidden");
        step3.style.display = "block";

        document.getElementById("orderIdDisplay").innerText = orderId;

        const wa = document.getElementById("whatsappLink");
        wa.href = `https://wa.me/91XXXXXXXXXX?text=I%20submitted%20a%20DSC%20application.%20My%20Order%20ID%20is%20${orderId}`;
    }
});
