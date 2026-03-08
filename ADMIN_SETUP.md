# FlashFix Admin Setup & Operations Guide

## Quick Start for Admin Account

Your admin account is automatically configured when you log in with Manus OAuth. You have full access to:

- ✅ Create and manage jobs
- ✅ Assign jobs to contractors
- ✅ Approve/reject invoices and payments
- ✅ View all properties and revenue
- ✅ Access payment dashboard

## Getting Started with Your First Customers

### Step 1: Create a Property
1. Go to Admin Dashboard
2. Click "Add Property"
3. Enter address, city, state, zip code
4. Save property

### Step 2: Create Your First Job
1. Go to Admin Dashboard → Jobs
2. Click "Create Job"
3. Fill in:
   - Job Title (e.g., "Roof Repair")
   - Description (optional)
   - Select Property
   - Enter Amount (e.g., $5,000)
4. Save job (status: pending)

### Step 3: Assign Job to Contractor
1. Go to Admin Dashboard → Jobs
2. Find the job you created
3. Click "Manage" button
4. Click "Assign to Contractor"
5. Select contractor from list
6. Confirm

### Step 4: Track Job Progress
- Contractors can accept jobs from "Find Jobs" tab
- They update status: assigned → in_progress → completed
- You receive notifications for each status change

### Step 5: Approve Invoices & Payments
1. Go to Admin Dashboard → Payments
2. View submitted invoices
3. Click "Review" on any invoice
4. Options:
   - **Approve Payment** - Marks invoice as paid
   - **Reject** - Returns to contractor for revision
5. Notifications sent automatically

## Revenue Tracking

Your Payments dashboard shows:
- **Total Invoices** - All invoices created
- **Pending Approval** - Invoices awaiting your decision
- **Paid** - Completed payments
- **Revenue** - Total revenue from paid invoices

## Contractor & Customer Roles

### Property Managers (PM)
- View assigned jobs
- Update job status
- Submit invoices for jobs
- Track their own revenue

### Subcontractors
- Browse available jobs
- Accept jobs they want to work on
- Update job progress
- Submit invoices when complete

### Homeowners
- View their properties
- See job status
- Track project progress

## Best Practices for Growth

1. **Onboard Contractors First**
   - Add contractors to your system
   - Assign them test jobs
   - Verify they understand the workflow

2. **Create Property Portfolio**
   - Add all properties you manage
   - Organize by region/client
   - Keep addresses accurate

3. **Set Clear Job Expectations**
   - Detailed descriptions
   - Accurate amounts
   - Clear deadlines

4. **Monitor Payments**
   - Review invoices promptly
   - Approve valid invoices quickly
   - Reject incomplete work

5. **Communicate**
   - Use notifications to stay informed
   - Respond to contractor questions
   - Maintain professional relationships

## API Endpoints Available

All data is automatically synced via tRPC:

**Jobs:**
- `trpc.jobs.list` - Get all jobs
- `trpc.jobs.create` - Create new job
- `trpc.jobs.updateStatus` - Update job status
- `trpc.jobs.assignToUser` - Assign to contractor

**Invoices:**
- `trpc.invoices.list` - Get all invoices
- `trpc.invoices.create` - Create invoice
- `trpc.invoices.submit` - Submit for approval
- `trpc.invoices.approve` - Approve payment
- `trpc.invoices.reject` - Reject invoice

**Properties:**
- `trpc.properties.create` - Add property
- `trpc.properties.getByOwner` - View your properties

## Notifications

You receive automatic notifications for:
- ✉️ Job assigned to contractor
- ✉️ Job marked as completed
- ✉️ Invoice submitted for review
- ✉️ Payment declared (awaiting approval)
- ✉️ Payment approved
- ✉️ Invoice rejected

## Troubleshooting

**Can't see jobs?**
- Make sure you're logged in as admin
- Jobs must be created first
- Refresh page if needed

**Invoice not showing?**
- Check job status - must be in progress or completed
- Contractor must submit invoice
- May take a few seconds to sync

**Notifications not working?**
- Check your Manus account settings
- Ensure notifications are enabled
- Try refreshing the page

## Support

For technical issues or feature requests:
1. Check this guide first
2. Review the dashboard UI for help tooltips
3. Contact Manus support if needed

---

**You're all set!** Start creating properties and jobs to get your first customers on board.
