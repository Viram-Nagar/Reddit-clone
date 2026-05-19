const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

const logger = {
  info: (...args) => {
    if (!isTest) console.log("ℹ️ ", ...args);
  },
  warn: (...args) => {
    if (!isTest) console.warn("⚠️ ", ...args);
  },
  error: (...args) => {
    if (!isTest) console.error("❌", ...args);
  },
  debug: (...args) => {
    if (isDev && !isTest) console.debug("🔍", ...args);
  },
  success: (...args) => {
    if (!isTest) console.log("✅", ...args);
  },
};

module.exports = logger;
