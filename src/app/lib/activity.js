import { prisma } from "./prisma";
export const runtime = "nodejs";


// Fetch or create the activity row for a user
export async function getUserActivity(userId) {
  let activity = await prisma.userActivity.findUnique({
    where: { userId },
    include: { notifications: true },
  })

  if (!activity) {
    activity = await prisma.userActivity.create({
      data: { userId },
      include: { notifications: true },
    })
  }

  return activity
}

// Increment job views
export async function incrementJobViews(userId, count = 1) {
  return prisma.userActivity.update({
    where: { userId },
    data: { viewedJobs: { increment: count } },
  })
}

// Increment job applications
export async function incrementApplications(userId, count = 1) {
  return prisma.userActivity.update({
    where: { userId },
    data: { appliedJobs: { increment: count } },
  })
}

// Increment interviews
export async function incrementInterviews(userId, count = 1) {
  return prisma.userActivity.update({
    where: { userId },
    data: { interviews: { increment: count } },
  })
}

// Add a notification
export async function addNotification(userId, { title, message, actionLink, color }) {
  const activity = await getUserActivity(userId)

  return prisma.notification.create({
    data: {
      userActivityId: activity.id,
      title,
      message,
      actionLink,
      color,
    },
  })
}
