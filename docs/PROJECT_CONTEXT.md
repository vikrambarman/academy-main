# 🚀 SCA-WEB Academy ERP - Master Context & Project State

**Instructions for AI:** 
1. Read this entire document before responding.
2. Act as an Expert Next.js 16+ Full-Stack Developer.
3. **Rule 1:** Provide modern, scalable, production-ready code (Next.js 16+ App Router, TypeScript, Mongoose).
4. **Rule 2:** Keep all code in English, but keep explanations/descriptions in clear, practical **Hinglish**.
5. **Rule 3:** DO NOT ASSUME ANYTHING. If you need to see a file, schema, or API route, ask for it explicitly before writing code.
6. **Rule 4:** Always update the "Current Progress" section mentally or explicitly when a task is completed.

---

## 1. Project Overview
- **Name:** SCA-WEB Academy ERP
- **Purpose:** A comprehensive management system for a computer academy handling Public Portal, Admin Portal, Teacher Portal, and Student Portal.
- **Tech Stack:** Next.js 16.1.6 (App Router, Turbopack), React 19, TypeScript, MongoDB, Mongoose 9.x, Tailwind CSS, Resend (Email), Cloudinary (Images), Vercel (Hosting).
- **Design System:** Custom CSS variables + Tailwind. Public portal has a separate layout from role-based portals (Admin/Teacher/Student).

---

## 2. Core Data Models (Brief)
- **User:** Auth base (academyId, email, password, role: 'admin' | 'teacher' | 'student').
- **Student:** Profile details (studentId, name, courseStatus: 'active' | 'completed' | 'dropped').
- **Course & Franchise:** Courses have module-wise syllabus. `CourseFranchiseConfig` maps a Course + Franchise to specific Certificate Types and Fees.
- **Enrollment:** Links Student + Course + Franchise. Contains `feesTotal`, `feesPaid`, and `payments[]` array.
- **Attendance:** Links Student + Enrollment + Course. Contains `records[]` array with `date`, `status` ('pending' | 'present' | 'absent' | 'late' | 'rejected' | 'holiday' | 'leave'), `inTime`, `outTime`, `markedVia`, `verifiedBy`, `verifiedAt`.
- **HourlyCode:** 4-digit code generated hourly for attendance scanning, with TTL expiration.

---

## 3. Current Completed Features (Phase 1A: Attendance System) ✅
The attendance system is now **production-ready** and pushed to the `main` branch. Key implementations:
1. **Multi-Course Support:** Students with multiple enrollments can select the specific course while scanning.
2. **Scan Flow:** Student scans IN (using Hourly Code) → Status: `pending`. Student scans OUT → Status: `pending`.
3. **Verification Flow:** Teacher/Admin can verify single or bulk attendance from their dashboard. On verify, status changes to `present`. 
4. **Rejection Handling:** If a teacher rejects an attendance, the student can re-scan IN, which resets the record to `pending` for re-verification.
5. **Automated Crons (Vercel):** 
   - `8:00 PM`: Auto-verifies pending records that have both IN and OUT times.
   - `9:00 PM`: Marks active enrollments without any scan as `absent` (skips weekends/holidays).
6. **UI/UX Fixes:** Public scan page is now compact, professional, and handles JSON parsing errors gracefully. Admin/Teacher redirect loops were fixed by implementing case-insensitive role checks (`role.toLowerCase().trim()`).

---

## 4. Current Workflow (How it works right now)
1. **Student Entry:** Goes to `/attendance/scan`, enters Student ID.
2. **Course Selection:** If multiple courses, selects one. Enters 4-digit Hourly Code.
3. **Mark IN:** System records `inTime`, sets status to `pending`.
4. **Student Exit:** Student scans again, enters Hourly Code. System records `outTime`, status remains `pending`.
5. **Teacher Action:** Teacher opens `/dashboard/teacher/attendance` (or Admin does). Sees a real-time list of "Pending" students. Clicks "Verify" (or "Bulk Verify").
6. **Completion:** Status becomes `present`. Student portal reflects this instantly via polling.

---

## 5. Next Phase Goals (Phase 1B: Fees, Receipts & Payments) 🎯
We are now moving to fix the Fee Collection and Receipt system.
**Objectives:**
1. **Fee Collection & Receipts:** 
   - Admin can record offline payments (Cash/UPI).
   - System must generate a professional PDF receipt (with Academy Logo, Student Details, Amount, Receipt No., Date).
   - Student can view and download their receipt from `/dashboard/student/fees`.
2. **Dropped Student Earning Fix:** Ensure analytics/earning dashboards exclude or properly categorize fees from students with `courseStatus: 'dropped'`.
3. **Cashfree Payment Gateway Integration:** 
   - Setup Cashfree (Sandbox first) for online fee payments.
   - Create payment order API.
   - Handle Webhook (`/api/webhooks/cashfree`) to update enrollment `feesPaid` and auto-generate receipt on success.
4. **Notification System (Future):** Prepare hooks for Email (Resend) and WhatsApp (Fast2SMS) notifications on payment success.

---

## 6. Rules of Engagement for This Chat
- Before modifying any logic, **ask me to share the specific file or model** you need to see.
- When providing code, provide the **full file content** or clearly state "Replace lines X to Y".
- Always consider edge cases (e.g., network failures, duplicate payments, invalid enrollment states).
- Keep responses direct and practical. Skip basic tutorials unless explicitly asked.

---
**Current Chat Trigger:** "I have read the context. I am ready to start Phase 1B. Please share the current `Enrollment.ts` model and the existing fee/transaction API routes so we can begin implementing the Receipt and Cashfree integration."