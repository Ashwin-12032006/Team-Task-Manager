const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear DB
  await prisma.task.deleteMany({});
  await prisma.boardColumn.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.pastWork.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@taskflow.app",
      role: "Product Lead",
      initials: "JD",
      color: "from-indigo-500 to-blue-600",
      phone: "+1 (555) 123-4567",
      bio: "Leading product vision and strategy. Passionate about creating intuitive user experiences and driving team success.",
      tasksCompleted: 142,
      rating: 4.9,
      velocity: "24 pts/sprint",
      onTimeRate: "98%",
      pastWork: {
        create: [
          { title: "V1 Launch Coordination", date: "May 2026", impact: "High" },
          { title: "Client Portal Strategy", date: "Apr 2026", impact: "Medium" }
        ]
      }
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Alice Smith",
      email: "alice@taskflow.app",
      role: "Senior Designer",
      initials: "AS",
      color: "from-purple-500 to-pink-600",
      phone: "+1 (555) 234-5678",
      bio: "Specializes in UI/UX design and design systems. Bringing visual excellence to all TaskFlow products.",
      tasksCompleted: 284,
      rating: 5.0,
      velocity: "32 pts/sprint",
      onTimeRate: "100%",
      pastWork: {
        create: [
          { title: "Mobile App Redesign", date: "Mar 2026", impact: "High" },
          { title: "Marketing Site Assets", date: "Feb 2026", impact: "High" }
        ]
      }
    }
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Bob Johnson",
      email: "bob@taskflow.app",
      role: "Frontend Engineer",
      initials: "BJ",
      color: "from-emerald-500 to-teal-600",
      phone: "+1 (555) 345-6789",
      bio: "React and Next.js expert. Obsessed with web performance, accessibility, and smooth animations.",
      tasksCompleted: 195,
      rating: 4.8,
      velocity: "28 pts/sprint",
      onTimeRate: "95%",
      pastWork: {
        create: [
          { title: "Authentication Flow", date: "Jan 2026", impact: "Critical" },
          { title: "Dashboard Dashboard", date: "Dec 2025", impact: "High" }
        ]
      }
    }
  });

  // 2. Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Overhaul the main corporate website for 2026.",
      color: "from-indigo-500 to-blue-600",
      progress: 75,
      members: {
        create: [
          { userId: user1.id },
          { userId: user2.id },
          { userId: user3.id }
        ]
      }
    }
  });

  // 3. Create Columns and Tasks
  const col1 = await prisma.boardColumn.create({
    data: { title: "To Do", order: 0, projectId: project1.id }
  });
  const col2 = await prisma.boardColumn.create({
    data: { title: "In Progress", order: 1, projectId: project1.id }
  });
  const col3 = await prisma.boardColumn.create({
    data: { title: "Review", order: 2, projectId: project1.id }
  });
  const col4 = await prisma.boardColumn.create({
    data: { title: "Done", order: 3, projectId: project1.id }
  });

  await prisma.task.createMany({
    data: [
      { content: "Design System setup", priority: "High", status: "To Do", order: 0, columnId: col1.id, authorId: user2.id },
      { content: "Homepage Wireframes", priority: "Medium", status: "To Do", order: 1, columnId: col1.id, authorId: user2.id },
      { content: "Authentication Flow", priority: "High", status: "In Progress", order: 0, columnId: col2.id, authorId: user3.id },
      { content: "User Profile Mockups", priority: "Low", status: "Done", order: 0, columnId: col4.id, authorId: user1.id },
    ]
  });

  console.log("Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
