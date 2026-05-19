const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create test users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      username: "alice",
      password: hashedPassword,
      bio: "React enthusiast and coffee lover ☕",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      username: "bob",
      password: hashedPassword,
      bio: "Backend developer by day, gamer by night 🎮",
    },
  });

  // Create communities
  const webdev = await prisma.community.upsert({
    where: { slug: "webdev" },
    update: {},
    create: {
      name: "webdev",
      slug: "webdev",
      description: "A community for web developers to share, learn, and grow.",
      creatorId: alice.id,
      members: { connect: [{ id: alice.id }, { id: bob.id }] },
    },
  });

  const javascript = await prisma.community.upsert({
    where: { slug: "javascript" },
    update: {},
    create: {
      name: "javascript",
      slug: "javascript",
      description: "All things JavaScript — frameworks, tips, memes.",
      creatorId: bob.id,
      members: { connect: [{ id: alice.id }, { id: bob.id }] },
    },
  });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: "Welcome to r/webdev! Read before posting.",
      content:
        "This is a community for web developers of all skill levels. Be kind, be helpful, and share your knowledge!",
      type: "text",
      communityId: webdev.id,
      authorId: alice.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "What is your favorite JavaScript framework in 2025?",
      content: "React, Vue, Svelte, Angular? Drop your picks and why below!",
      type: "text",
      communityId: javascript.id,
      authorId: bob.id,
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      content: "React all day, every day. The ecosystem is unbeatable.",
      postId: post2.id,
      authorId: alice.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Svelte is the future. Less boilerplate, better performance.",
      postId: post2.id,
      authorId: bob.id,
    },
  });

  // Create votes
  await prisma.vote.create({
    data: { type: "UP", userId: alice.id, postId: post2.id },
  });

  await prisma.vote.create({
    data: { type: "UP", userId: bob.id, postId: post1.id },
  });

  console.log("✅ Seed complete!");
  console.log("👤 Test users: alice@example.com / bob@example.com");
  console.log("🔑 Password for both: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
