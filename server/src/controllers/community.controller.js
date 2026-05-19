const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ─── Get All Communities ───────────────────────────────
const getAllCommunities = async (req, res, next) => {
  try {
    const communities = await prisma.community.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: { id: true, username: true },
        },
        _count: {
          select: { posts: true, members: true },
        },
      },
    });

    res.json({ communities });
  } catch (error) {
    next(error);
  }
};

// ─── Get Single Community by Slug ─────────────────────
const getCommunityBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        creator: {
          select: { id: true, username: true },
        },
        _count: {
          select: { posts: true, members: true },
        },
      },
    });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.json({ community });
  } catch (error) {
    next(error);
  }
};

// ─── Create Community ─────────────────────────────────
const createCommunity = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase();

    // Check if name/slug already taken
    const existing = await prisma.community.findFirst({
      where: {
        OR: [{ name: { equals: name, mode: "insensitive" } }, { slug }],
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Validation failed",
        errors: [{ field: "name", message: "Community name already taken" }],
      });
    }

    const community = await prisma.community.create({
      data: {
        name,
        slug,
        description,
        creatorId: req.user.id,
        // Auto-join creator as first member
        members: { connect: { id: req.user.id } },
      },
      include: {
        creator: {
          select: { id: true, username: true },
        },
        _count: {
          select: { posts: true, members: true },
        },
      },
    });

    res.status(201).json({
      message: "Community created successfully",
      community,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Join Community ───────────────────────────────────
const joinCommunity = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if already a member
    const isMember = await prisma.community.findFirst({
      where: {
        slug,
        members: { some: { id: req.user.id } },
      },
    });

    if (isMember) {
      // Leave community (toggle)
      await prisma.community.update({
        where: { slug },
        data: { members: { disconnect: { id: req.user.id } } },
      });
      return res.json({ message: "Left community", joined: false });
    }

    // Join community
    await prisma.community.update({
      where: { slug },
      data: { members: { connect: { id: req.user.id } } },
    });

    res.json({ message: "Joined community", joined: true });
  } catch (error) {
    next(error);
  }
};

// ─── Check Membership ─────────────────────────────────
const checkMembership = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const isMember = await prisma.community.findFirst({
      where: {
        slug,
        members: { some: { id: req.user.id } },
      },
    });

    res.json({ isMember: !!isMember });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCommunities,
  getCommunityBySlug,
  createCommunity,
  joinCommunity,
  checkMembership,
};
