# DSCDesk
My DSC Desk website
📘 DSC Desk – Frontend Coding Standards
A simple, clean, scalable coding standard for the DSC Desk project.
This ensures consistency, maintainability, and professional engineering practices across all pages.

🗂️ 1. Project Structure
Code
/assets
    /css
        tailwind.css
        order.css
    /js
        order.js
        upload.js
        payment.js
    /img
        logo.png
        icons.svg

/order.html
/admin/orders.html
Rules:

All folders lowercase

All filenames lowercase

Use hyphens for multi‑word filenames
Example: order-form.js, admin-orders.js

🎨 2. HTML Standards
HTML contains only structure and Tailwind classes

No inline CSS

No inline JavaScript

Use semantic HTML (<section>, <header>, <main>, <footer>)

Example:

html
<script src="/assets/js/order.js"></script>
<link rel="stylesheet" href="/assets/css/order.css">
🎨 3. CSS Standards
All custom CSS goes into /assets/css/*.css

Tailwind handles layout, spacing, typography

Custom CSS only for:

Overrides

Animations

Component‑specific styling

Naming:

Lowercase

Hyphens for multi‑word names
Example: order.css

⚙️ 4. JavaScript Standards
All JS lives in /assets/js/*.js

No inline event handlers (onclick="")

Use addEventListener for all events

Group logic by module:

order.js → multi‑step form logic

upload.js → R2 upload logic

payment.js → Razorpay logic

Example:

javascript
document.getElementById("btnNext").addEventListener("click", handleNextStep);
🔌 5. API Standards
All backend calls use fetch()

API endpoints under /api/*

JSON in, JSON out

No business logic in frontend

Example:

javascript
const res = await fetch("/api/upload-documents", {
    method: "POST",
    body: formData
});
🔐 6. Security Standards
No secrets in frontend JS

Razorpay:

Only public key in frontend

Private key stays in backend

Admin panel protected (Cloudflare Access or password)

Validate all inputs on backend even if validated on frontend

🧪 7. Validation Standards
Frontend validation for UX

Backend validation for security

Required fields must be checked in both places

🧾 8. Version Control Standards
Use GitHub for all commits

Commit small, meaningful changes

Commit messages follow:

Code
feat: added step 2 document upload UI
fix: corrected PAN validation regex
refactor: moved JS to separate file
Never commit:

.env

API keys

Secrets

🚀 9. Performance Standards
JS and CSS loaded as external files (cached by browser)

Minimize DOM manipulation

Use async/await for API calls

Compress images before uploading to /assets/img

📦 10. Deployment Standards
Hosted on Cloudflare Pages

Backend functions under /functions

R2 for document storage

D1 for order database

Razorpay for payments

✅ Summary
This coding standard ensures:

Clean architecture

Maintainable code

Professional structure

Scalable frontend

Easy onboarding for future developers
