# Academy ERP Architecture

## Stack
- Next.js 16.1.6 (App Router, Turbopack)
- React 19.2.3, TypeScript 5
- MongoDB + Mongoose 9.2.3 (maxPoolSize: 10)
- Auth: Custom JWT (jsonwebtoken + jose), Resend for Email OTP

## Core Design Patterns
1. **Enrollment is the Source of Truth**: Ek student ke multiple courses honge. Hamesha `Enrollment` model ke through course, fee, aur attendance access karna hai. `User.courseId` legacy field hai, ignore karna hai.
2. **CourseFranchiseConfig**: Har Course + Franchise ka ek config hota hai jisme `certEntries` (CertificateType wise fees) store hote hain.
3. **Attendance Document**: Ek student ke ek enrollment ka sirf EK Attendance document hota hai. Usme `records` array hoti hai jisme daily status (present/absent/holiday), inTime, outTime push hota hai.
4. **Payments Array**: `Enrollment.payments` me offline/online payments store hote hain. Koi alag Transaction model nahi hai (unless added later).

## Environment
- Vercel Hosting (Free Plan currently)
- Cron: `/api/cron/generate-codes` runs at 18:30 daily.
- Cloudinary for image uploads.