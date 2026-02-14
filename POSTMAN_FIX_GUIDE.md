# 🔧 Postman Registration Fix - Quick Guide

## ❌ The Problem

Backend expects **different field names** than what was in the original collection:

| What You Sent (OLD ❌)                   | What Backend Expects (NEW âœ…)    |
| ---------------------------------------- | --------------------------------- |
| `name`                                   | `firstName` + `lastName`          |
| `role`                                   | `userType`                        |
| `section`, `rollNumber`, `parentContact` | _(Not in current backend schema)_ |

## ✅ The Solution

### ✅ Fixed Files:

1. **IoT_Student_Engagement_Postman_Collection.json** - âœ… Updated
2. **POSTMAN_TESTING_GUIDE.md** - âœ… Updated

## 📝 Correct Registration Fields

### Student Registration

```json
{
  "firstName": "Atharva",
  "lastName": "Student",
  "email": "atharva.student@test.com",
  "password": "Test@1234",
  "userType": "student",
  "phone": "+919876543210",
  "grade": "10",
  "school": "Test High School",
  "dateOfBirth": "2008-05-15"
}
```

**Required Fields:**

- ✅ `firstName` (String)
- ✅ `lastName` (String)
- ✅ `email` (String - valid email)
- ✅ `password` (String - min 6 characters)
- ✅ `userType` (String - one of: 'student', 'parent', 'teacher', 'admin')

**Optional Fields:**

- `phone` (String)
- `grade` (String)
- `school` (String)
- `dateOfBirth` (Date - format: "YYYY-MM-DD")

---

### Parent Registration

```json
{
  "firstName": "Shreya",
  "lastName": "Parent",
  "email": "shreya.parent@test.com",
  "password": "Parent@1234",
  "userType": "parent",
  "phone": "+919876543210",
  "school": "Test High School"
}
```

---

### Teacher Registration

```json
{
  "firstName": "Rakesh",
  "lastName": "Sharma",
  "email": "sharma.teacher@test.com",
  "password": "Teacher@1234",
  "userType": "teacher",
  "phone": "+919876543211",
  "school": "Test High School"
}
```

---

## 📊 Expected Response Structure

### âœ… Correct Response (201 Created):

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65f8a1b2c3d4e5f6g7h8i9j0",
    "firstName": "Atharva",
    "lastName": "Student",
    "email": "atharva.student@test.com",
    "userType": "student",
    "grade": "10",
    "phone": "+919876543210",
    "createdAt": "2026-02-14T10:30:00.000Z"
  }
}
```

**Key Differences from Previous:**

- ❌ OLD: `data.token` → âœ… NEW: `token` (at root level)
- ❌ OLD: `data.user` → âœ… NEW: `user` (at root level)
- ❌ OLD: `user.name` → âœ… NEW: `user.firstName` + `user.lastName`
- ❌ OLD: `user.role` → âœ… NEW: `user.userType`

---

## 🚀 How to Test Now

### Option 1: Re-Import Updated Collection (RECOMMENDED)

1. **Delete old collection** in Postman
2. **Re-import**: `IoT_Student_Engagement_Postman_Collection.json`
3. **Test**: Run `2. Authentication` → `Register Student`
4. **Success!** Token and Student ID will auto-save

### Option 2: Manual Fix (If you want to keep your old collection)

In your existing Postman requests:

**Change Body From:**

```json
{
  "name": "Atharva Student",
  "role": "student",
  ...
}
```

**To:**

```json
{
  "firstName": "Atharva",
  "lastName": "Student",
  "userType": "student",
  ...
}
```

**Also Update Auto-Save Script (Tests tab):**

OLD:

```javascript
pm.environment.set("AUTH_TOKEN", jsonData.data.token);
pm.environment.set("STUDENT_ID", jsonData.data.user._id);
```

NEW:

```javascript
pm.environment.set("AUTH_TOKEN", jsonData.token);
pm.environment.set("STUDENT_ID", jsonData.user._id);
```

---

## 🧪 Quick Test (Copy-Paste Ready)

### Test in Postman RIGHT NOW:

**POST** `http://localhost:5000/api/auth/register`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test.user@example.com",
  "password": "Test@1234",
  "userType": "student",
  "phone": "+919999999999",
  "grade": "10",
  "school": "Test School"
}
```

**Expected:** âœ… Status 201 + Token + User object

---

## âŒ Common Errors & Solutions

### Error 1: "Invalid value" for firstName/lastName/userType

**Cause:** Using old field names (`name`, `role`)  
**Solution:** âœ… Use `firstName`, `lastName`, `userType`

### Error 2: "User already exists"

**Cause:** Email already registered in database  
**Solution:** Change email to `test123@example.com` or similar

### Error 3: "Password must be at least 6 characters"

**Cause:** Password too short  
**Solution:** Use minimum 6 characters (e.g., `Test@1234`)

### Error 4: "Invalid email"

**Cause:** Email format incorrect  
**Solution:** Use format: `name@domain.com`

### Error 5: Token not auto-saving

**Cause:** Auto-save script looking for `jsonData.data.token`  
**Solution:** âœ… Update to `jsonData.token` (already fixed in new collection)

---

## đź"‹ Validation Rules

The backend validates:

1. **Email:**
   - âœ… Valid format required
   - âœ… Must be unique (no duplicates)
   - âœ… Auto-normalized (lowercase)

2. **Password:**
   - âœ… Minimum 6 characters
   - âś… Recommended: Include uppercase, lowercase, numbers, special chars

3. **firstName & lastName:**
   - âœ… Cannot be empty
   - âœ… Whitespace trimmed automatically

4. **userType:**
   - âœ… Must be one of: `'student'`, `'parent'`, `'teacher'`, `'admin'`
   - ❌ Case-sensitive (use lowercase)

5. **Phone (optional):**
   - âś… Format: `+91XXXXXXXXXX` or `XXXXXXXXXX`

6. **dateOfBirth (optional):**
   - âś… Format: `YYYY-MM-DD` (e.g., `2008-05-15`)

---

## đź'ˇ Pro Tips

1. **Use Different Emails:** For each test, use unique email addresses
   - Student: `student1@test.com`, `student2@test.com`
   - Parent: `parent1@test.com`, `parent2@test.com`
   - Teacher: `teacher1@test.com`, `teacher2@test.com`

2. **Save Tokens Immediately:** After registration/login, token is valid for 7 days

3. **Test Order:**
   1. Register Student
   2. Login with Student
   3. Create Session
   4. Record Sensor Data
   5. Get Predictions

4. **Environment Variables:** Make sure you've set up:
   - `BACKEND_URL = http://localhost:5000`
   - `AUTH_TOKEN` (auto-filled after login)
   - `STUDENT_ID` (auto-filled after registration)

---

## âś… Testing Checklist

### Before Testing:

- [ ] Backend running on port 5000
- [ ] MongoDB connected (check terminal logs)
- [ ] Postman environment created
- [ ] Updated collection imported

### Test Sequence:

- [ ] Backend Health Check (should return 200)
- [ ] Register Student (should return 201 + token)
- [ ] Login (should return 200 + token)
- [ ] Token auto-saved in environment

### If All Pass:

✅ **You're ready to test the full API!** Proceed with sessions, sensor data, and predictions.

---

## 🎯 Summary

**Core Changes:**

- ❌ `name` → âœ… `firstName` + `lastName`
- ❌ `role` → âœ… `userType`
- ❌ `data.token` → âœ… `token`
- ❌ `data.user` → âœ… `user`

**Files Updated:**

- âœ… Postman Collection JSON
- âœ… Testing Guide MD
- âœ… This Fix Document

**Next Step:**
Re-import the collection and test registration! 🚀

---

**Last Updated:** February 14, 2026  
**Status:** âś… All fixes applied and tested
