# Security Specification & Threat Model (ABAC Zero-Trust)

## 1. Data Invariants

- **Identity & Profile Isolation**: A user's profile (`/profiles/{userId}`) can only be written by the authenticated user (`request.auth.uid == userId`) or an admin. Users cannot modify their own active status or self-assign privileged roles.
- **RBAC Immutability**: Role assignments (`/user_roles/{roleId}`) are managed strictly by authorized administrative accounts (`admin` or `owner`).
- **Student Record Integrity**: Student records (`/students/{studentId}`) cannot be created or modified without valid identifiers, bounded strings, and authorized staff roles.
- **Attendance Accountability**: Attendance records (`/attendance/{attendanceId}`) must have a valid student reference, a valid date, an allowed status (`present`, `absent`, `sick`, `late`), and recorded_by attributed to the authenticated staff member.
- **Financial Auditability**: Fee payment logs (`/payments/{paymentId}`) require positive monetary amounts, valid categories, and can only be recorded by authenticated staff/finance officers.
- **Audit Logs Append-Only**: System audit entries (`/audit_logs/{auditId}`) can be written by authenticated callers to record actions, but can never be modified or deleted.

## 2. The "Dirty Dozen" Threat Payloads

1. **Self-Escalation**: Normal user attempts to insert `{ role: "admin", user_id: normal_user_id }` into `/user_roles`. (Expected: REJECT)
2. **Ghost Field Poisoning**: Inserting a student record with unauthorized hidden attributes like `{ isAdmin: true, backdoor: "open" }`. (Expected: REJECT)
3. **ID Traversal Poisoning**: Accessing `/students/{studentId}` with a 2KB junk character string or directory traversal sequence. (Expected: REJECT)
4. **Attendance Spoofing**: Submitting attendance with `recorded_by: "victim_teacher_id"` while authenticated as a student. (Expected: REJECT)
5. **Invalid Attendance Status**: Setting attendance status to `"vacation"` or invalid enum string. (Expected: REJECT)
6. **Payment Tampering**: Modifying an existing payment record to reduce `amount` from 500 to 0. (Expected: REJECT)
7. **Negative Payment Injection**: Creating a payment entry with negative tuition `{ amount: -1000 }`. (Expected: REJECT)
8. **Audit Log Tampering**: Overwriting or deleting an existing `/audit_logs` record to erase traces of an action. (Expected: REJECT)
9. **Unauthenticated Read**: Attempting to read `/attendance` or `/students` without authentication. (Expected: REJECT)
10. **Profile Cross-Write**: User A attempting to update User B's `/profiles/{userB}`. (Expected: REJECT)
11. **Excessive String Payload**: Injecting a 2MB string into announcement title or body causing Denial-of-Wallet. (Expected: REJECT)
12. **Class Impersonation**: Modifying class teacher assignments without administrative permissions. (Expected: REJECT)
