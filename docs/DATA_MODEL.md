# Core Data Models

## User (Auth)
- Fields: academyId, email, password, role (admin/student/teacher), isFirstLogin
- Relations: 1:1 with Student/Teacher

## Student (Profile)
- Fields: studentId, name, phone, email, courseStatus (active/completed/dropped)
- Relations: 1:1 with User, 1:N with Enrollment

## Course & Franchise
- Course: syllabus, allowedFranchises
- Franchise: name, code, portalUrl
- CourseFranchiseConfig: Maps Course+Franchise to `certEntries` (fee, registrationFee, certType)

## Enrollment (CRITICAL)
- Fields: student, course, franchise, certType, feesTotal, feesPaid, isActive, certificateStatus
- Subdocs: `payments[]` (amount, date, receiptNo, remark)

## Attendance
- Index: { student: 1, enrollment: 1 } (Unique)
- Fields: course, records[] (date, status, inTime, outTime, markedVia)

## HourlyCode
- Index: { date: 1, hour: 1 } (Unique)
- TTL: expiresAt auto-delete