# TaskFlow Setup Guide

## Initial Admin Account Setup

### Step 1: Create the Admin Account

The application requires **only one admin account** with the following credentials:

- **Email**: `shayanmustafahassan@gmail.com`
- **Name**: Shayan
- **Role**: admin

To create this account:

1. Navigate to the authentication page at `/auth`
2. Click on the **Sign Up** tab
3. Fill in the registration form:
   - Full Name: `Shayan`
   - Email: `shayanmustafahassan@gmail.com`
   - Password: Choose a secure password (minimum 6 characters)
   - Confirm Password: Re-enter the password
4. Click **Create Account**

The account will be automatically created with the `member` role initially. You need to manually update it to `admin` role.

### Step 2: Update to Admin Role

After signing up, you need to manually update the role in the Supabase database:

1. Open Lovable Cloud Backend (click "View Backend" in your project)
2. Navigate to the **Database** section
3. Find the `user_roles` table
4. Locate the row with your user_id
5. Update the `role` column from `member` to `admin`
6. Save the changes

Alternatively, you can run this SQL query in the SQL Editor:

```sql
-- First, find your user_id from the profiles table
SELECT id, email FROM profiles WHERE email = 'shayanmustafahassan@gmail.com';

-- Then update the role (replace YOUR_USER_ID with the actual UUID)
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = 'YOUR_USER_ID';
```

### Step 3: Verify Admin Access

1. Sign out and sign back in with the admin account
2. You should now see:
   - "Admin" label in the sidebar
   - Admin-only features like:
     - "New Project" button
     - "Create Team" button
     - "Invite Employee" button
   - Access to all admin functionalities

## Creating Employee Accounts

Once you're logged in as admin, you can create employee accounts:

1. Go to the Dashboard
2. Click **"Invite Employee"** button
3. Fill in the employee details:
   - Full Name
   - Email
   - Initial Password
4. Click **"Create Employee"**

Employees will automatically be assigned the `member` role and will have:
- View-only access to assigned tasks
- No ability to create, edit, or delete projects
- No access to admin features

## Database Structure

The application uses the following main tables:

- **profiles**: User profile information
- **user_roles**: Role assignments (admin/member)
- **teams**: Team information
- **projects**: Project details with status and progress
- **tasks**: Task assignments and tracking
- **team_members**: Junction table for team memberships
- **comments**: Task comments
- **attachments**: File attachments
- **activity_logs**: Audit trail

## Role-Based Access Control

### Admin Privileges
- Create, update, and delete teams
- Create, update, and delete projects
- Create, assign, update, and delete tasks
- Invite and manage employee accounts
- View all data and analytics
- Access to admin dashboard

### Employee Privileges
- View assigned tasks only
- View projects they're assigned to through teams
- View team information
- No create, edit, or delete permissions

## Testing Checklist

- [ ] Admin account created with correct email
- [ ] Admin role assigned in database
- [ ] Admin can log in successfully
- [ ] Admin sees admin-only UI elements
- [ ] Admin can create teams
- [ ] Admin can create projects
- [ ] Admin can invite employees
- [ ] Employee account created successfully
- [ ] Employee has view-only access
- [ ] Employee cannot see admin features
- [ ] Real-time updates working
- [ ] Analytics charts displaying correctly

## Security Features

1. **Row-Level Security (RLS)**: All tables have RLS policies enabled
2. **Role Verification**: Server-side role checks using `has_role()` function
3. **Email Confirmation**: Auto-confirmed for testing (can be disabled in production)
4. **Protected Routes**: Frontend route protection for admin pages
5. **Database Constraints**: Foreign keys and check constraints for data integrity

## Troubleshooting

### "Access Denied" Error
- Verify you're logged in with the admin email
- Check that the `user_roles` table has `admin` role assigned
- Clear browser cache and try again

### Can't See Projects/Tasks
- Ensure you have proper team membership
- Verify RLS policies are correctly set up
- Check database relationships (team_id, project_id, etc.)

### Real-time Updates Not Working
- Check browser console for errors
- Verify Supabase real-time is enabled
- Ensure you're subscribed to the correct channels

## Next Steps

After setting up the admin account:

1. Create your first team
2. Create a project and assign it to the team
3. Invite employees and add them to teams
4. Create tasks and assign them to team members
5. Monitor progress through the analytics dashboard
