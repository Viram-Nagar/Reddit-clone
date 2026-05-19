const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ─── Trending Score Formula ────────────────────────────
// score = (upvotes - downvotes) / (age_in_hours + 2)^1.5
// This is a simplified version of Reddit's "Hot" algorithm
const calculateTrendingScore = (post, now = new Date()) => {
  const upvotes = post.votes.filter((v) => v.type === "UP").length;
  const downvotes = post.votes.filter((v) => v.type === "DOWN").length;
  const score = upvotes - downvotes;

  const ageInHours = (now - new Date(post.createdAt)) / (1000 * 60 * 60);
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  const seconds = (new Date(post.createdAt) - new Date("2024-01-01")) / 1000;

  // Wilson score lower bound for trending
  const trendingScore = sign * order + seconds / 45000 - ageInHours * 0.1;

  return trendingScore;
};

// ─── Helper: enrich posts ─────────────────────────────
const enrichPosts = (posts, userId = null) =>
  posts.map((post) => {
    const upvotes = post.votes.filter((v) => v.type === "UP").length;
    const downvotes = post.votes.filter((v) => v.type === "DOWN").length;
    const userVote = userId
      ? post.votes.find((v) => v.userId === userId)?.type || null
      : null;
    const { votes, ...rest } = post;
    return {
      ...rest,
      voteScore: upvotes - downvotes,
      userVote,
    };
  });

// ─── Home Feed (All posts paginated) ──────────────────
const getHomeFeed = async (req, res, next) => {
  try {
    const {
      sort = "hot",
      page = 1,
      limit = 15,
      cursor, // for cursor-based pagination
    } = req.query;

    const userId = req.user?.id || null;
    const take = parseInt(limit);
    const skip = cursor ? 1 : (parseInt(page) - 1) * take;

    const queryOptions = {
      take,
      skip: cursor ? 1 : skip,
      ...(cursor && { cursor: { id: cursor } }),
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        community: { select: { id: true, name: true, slug: true } },
        votes: { select: { type: true, userId: true } },
        _count: { select: { comments: true } },
      },
    };

    // Apply sort strategy
    if (sort === "new") {
      queryOptions.orderBy = { createdAt: "desc" };
    } else if (sort === "top") {
      queryOptions.orderBy = { createdAt: "desc" };
    } else {
      // hot / rising — sort by createdAt, rerank after
      queryOptions.orderBy = { createdAt: "desc" };
    }

    const posts = await prisma.post.findMany(queryOptions);
    let enriched = enrichPosts(posts, userId);

    // Re-rank for hot/rising after enriching
    if (sort === "hot") {
      const now = new Date();
      enriched = enriched
        .map((p) => ({
          ...p,
          _trendingScore: calculateTrendingScore(
            { ...p, votes: posts.find((x) => x.id === p.id)?.votes || [] },
            now,
          ),
        }))
        .sort((a, b) => b._trendingScore - a._trendingScore)
        .map(({ _trendingScore, ...p }) => p);
    } else if (sort === "top") {
      enriched = enriched.sort((a, b) => b.voteScore - a.voteScore);
    } else if (sort === "rising") {
      // Rising: new posts (< 24h old) sorted by vote velocity
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      enriched = enriched
        .filter((p) => new Date(p.createdAt) > cutoff)
        .sort((a, b) => b.voteScore - a.voteScore);
    }

    const total = await prisma.post.count();
    const nextCursor =
      posts.length === take ? posts[posts.length - 1].id : null;

    res.json({
      posts: enriched,
      total,
      nextCursor,
      hasMore: !!nextCursor,
      page: parseInt(page),
    });
  } catch (error) {
    next(error);
  }
};

// ─── Following Feed (Communities user joined) ─────────
const getFollowingFeed = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cursor, limit = 15 } = req.query;
    const take = parseInt(limit);

    // Get communities the user is a member of
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: { select: { id: true } },
      },
    });

    const communityIds = user.memberships.map((c) => c.id);

    if (communityIds.length === 0) {
      return res.json({
        posts: [],
        hasMore: false,
        nextCursor: null,
        isEmpty: true,
      });
    }

    const queryOptions = {
      take,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      where: { communityId: { in: communityIds } },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        community: { select: { id: true, name: true, slug: true } },
        votes: { select: { type: true, userId: true } },
        _count: { select: { comments: true } },
      },
    };

    const posts = await prisma.post.findMany(queryOptions);
    const enriched = enrichPosts(posts, userId);
    const nextCursor =
      posts.length === take ? posts[posts.length - 1].id : null;

    res.json({
      posts: enriched,
      hasMore: !!nextCursor,
      nextCursor,
      isEmpty: false,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Trending Communities ─────────────────────────────
const getTrendingCommunities = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    // Communities with most posts in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const communities = await prisma.community.findMany({
      include: {
        _count: {
          select: { members: true, posts: true },
        },
        posts: {
          where: { createdAt: { gte: sevenDaysAgo } },
          select: { id: true },
        },
      },
    });

    // Sort by recent post activity + member count
    const ranked = communities
      .map((c) => ({
        ...c,
        activityScore: c.posts.length * 2 + c._count.members,
      }))
      .sort((a, b) => b.activityScore - a.activityScore)
      .slice(0, parseInt(limit))
      .map(({ posts, activityScore, ...c }) => c); // clean up

    res.json({ communities: ranked });
  } catch (error) {
    next(error);
  }
};

// ─── Search Posts + Communities ───────────────────────
const search = async (req, res, next) => {
  try {
    const { q, type = "all", limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ posts: [], communities: [] });
    }

    const query = q.trim();
    const results = {};

    if (type === "all" || type === "posts") {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, username: true } },
          community: { select: { id: true, name: true, slug: true } },
          _count: { select: { comments: true } },
          votes: { select: { type: true } },
        },
      });

      results.posts = posts.map((p) => {
        const voteScore =
          p.votes.filter((v) => v.type === "UP").length -
          p.votes.filter((v) => v.type === "DOWN").length;
        const { votes, ...rest } = p;
        return { ...rest, voteScore };
      });
    }

    if (type === "all" || type === "communities") {
      results.communities = await prisma.community.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: parseInt(limit),
        include: {
          _count: { select: { members: true, posts: true } },
        },
      });
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHomeFeed,
  getFollowingFeed,
  getTrendingCommunities,
  search,
};
