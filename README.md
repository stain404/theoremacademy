# Trading academy website

React + Vite + Tailwind CSS v4. Forex, crypto and equity courses; Dubai, India and online.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## What's built

| Section | Route | Notes |
| --- | --- | --- |
| Home | `/` | Hero, programs overview, teaching method, mentors preview, a student story, call to action |
| Programs | `/programs` | All four programs plus a side-by-side comparison table |
| Program page | `/programs/:programId` | Who it is for, outcomes, module-by-module curriculum (from `curriculum.js`), fees, mentor, apply |
| About | `/about` | Teaching method, classroom story, photo gallery, what students leave with |
| Mentors | `/mentors` | Full mentor profiles; `/mentors#farhan` links to one |
| Contact | `/contact` | Dubai / India / Online locations and hours, direct contacts, enquiry form (`?program=crypto` preselects) |
| Registration + onboarding | `/register` | Account → program, attendance mode, experience → payment. `?program=crypto` preselects a program |
| Login | `/login` | Redirects back to the page you came from |
| Payment | `/checkout/:programId` | INR or AED, card / UPI / Apple Pay, success and failed popups |
| Student portal | `/portal` | Course progress, per-module lessons, notes download, quizzes (70% pass mark), certificate, help and support tickets |

## Editing content

- **Academy name, contact, addresses, mentors, programs, prices:** `src/config/site.js`
- **Lessons and quiz questions:** `src/config/curriculum.js`
- **Colors and fonts:** the `@theme` block in `src/index.css`

Placeholders that still need real data: academy name (`Pipwise Academy`), email, phone, both office addresses, mentor photos and bios.

## Backend: currently mocked

`src/lib/api.js` is the only file that talks to "the backend". Right now it saves everything to `localStorage` so every flow can be clicked through. Once a backend is chosen, rewrite the functions in that file and keep their signatures; no page needs to change.

Demo payment rule: a card number ending in **0002** is declined, and any other card succeeds.

**Do not deploy the mock to real students.** It stores passwords in plain text in the browser, and it lets the browser mark a payment as paid.

### What the real backend needs

- Auth (email + password, ideally phone OTP for WhatsApp-first students)
- Postgres tables: `profiles`, `programs`, `modules`, `lessons`, `enrollments`, `orders`, `lesson_progress`, `quiz_results`, `tickets`
- File storage for notes PDFs and class recordings
- One server function to create payment orders and one webhook to verify them and create the enrollment
- Payment gateways: **Razorpay** for INR (UPI, cards, netbanking) and **Stripe** or **Telr** for AED
