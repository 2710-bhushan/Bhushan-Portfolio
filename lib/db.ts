import fs from "fs";
import path from "path";
import { getMongoClientPromise } from "./mongodb";

const JSON_DB_DIR = path.join(process.cwd(), "public", "data");
const JSON_DB_PATH = path.join(JSON_DB_DIR, "portfolio_db.json");

// Structure of our local database file
interface LocalDB {
  hero: any | null;
  about: any | null;
  experience: any[] | null;
  education: any[] | null;
  projects: any[] | null;
  skills: any[] | null;
  techBubbles: string[] | null;
  certifications: any[];
  achievements: any[];
  media: any[];
  mediaSlider?: any[];
}

const DEFAULT_DB: LocalDB = {
  hero: null,
  about: null,
  experience: null,
  education: null,
  projects: null,
  skills: null,
  techBubbles: null,
  certifications: [],
  achievements: [],
  media: [],
  mediaSlider: [],
};

// Helper to ensure JSON DB exists and return its contents
function getLocalDB(): LocalDB {
  if (!fs.existsSync(JSON_DB_DIR)) {
    fs.mkdirSync(JSON_DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(JSON_DB_PATH)) {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf8");
    return DEFAULT_DB;
  }
  try {
    const data = fs.readFileSync(JSON_DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read JSON DB:", error);
    return DEFAULT_DB;
  }
}

// Helper to save JSON DB
function saveLocalDB(data: LocalDB) {
  if (!fs.existsSync(JSON_DB_DIR)) {
    fs.mkdirSync(JSON_DB_DIR, { recursive: true });
  }
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

// Check if we should use MongoDB or fallback
async function getDbClient() {
  try {
    const client = await getMongoClientPromise();
    return client;
  } catch (error) {
    // Falls back to JSON database if MONGODB_URI is not set
    return null;
  }
}

// Generic database interfaces
export async function getPortfolioData() {
  const client = await getDbClient();
  if (client) {
    try {
      const db = client.db();
      const settings = await db.collection("settings").findOne({ id: "portfolio" });
      const certifications = await db.collection("certifications").find({}).toArray();
      const achievements = await db.collection("achievements").find({}).toArray();
      const media = await db.collection("media").find({}).toArray();
      const mediaSlider = await db.collection("mediaSlider").find({}).toArray();
      
      return {
        hero: settings?.hero || null,
        about: settings?.about || null,
        experience: settings?.experience || null,
        education: settings?.education || null,
        projects: settings?.projects || null,
        skills: settings?.skills || null,
        techBubbles: settings?.techBubbles || null,
        certifications: certifications.map(c => ({ ...c, id: c._id.toString() })),
        achievements: achievements.map(a => ({ ...a, id: a._id.toString() })),
        media: media.map(m => ({ ...m, id: m._id.toString() })),
        mediaSlider: mediaSlider.map(m => ({ ...m, id: m._id.toString() })),
      };
    } catch (e) {
      console.error("MongoDB error, falling back to JSON:", e);
    }
  }

  // Fallback to JSON
  const db = getLocalDB();
  return db;
}

export async function updateSection(
  section: "hero" | "about" | "experience" | "education" | "projects" | "skills" | "techBubbles",
  data: any
) {
  const client = await getDbClient();
  if (client) {
    try {
      const db = client.db();
      const updateObj: any = {};
      updateObj[section] = data;
      await db.collection("settings").updateOne(
        { id: "portfolio" },
        { $set: updateObj },
        { upsert: true }
      );
      return { success: true };
    } catch (e) {
      console.error("MongoDB error, writing to JSON:", e);
    }
  }

  // Fallback to JSON
  const db = getLocalDB();
  (db as any)[section] = data;
  saveLocalDB(db);
  return { success: true };
}

// Certifications Operations
export async function getCertifications() {
  const data = await getPortfolioData();
  return data.certifications;
}

export async function addCertification(cert: any) {
  const client = await getDbClient();
  const id = Math.random().toString(36).substring(2, 9);
  const newCert = { ...cert, _id: id, id };

  if (client) {
    try {
      const db = client.db();
      await db.collection("certifications").insertOne({ ...cert, _id: id });
      return newCert;
    } catch (e) {
      console.error("MongoDB error, adding to JSON:", e);
    }
  }

  const db = getLocalDB();
  db.certifications.push(newCert);
  saveLocalDB(db);
  return newCert;
}

export async function updateCertification(id: string, cert: any) {
  const client = await getDbClient();
  const { _id, id: _, ...updateData } = cert;
  if (client) {
    try {
      const db = client.db();
      await db.collection("certifications").updateOne({ _id: id as any }, { $set: updateData });
      return { success: true };
    } catch (e) {
      console.error("MongoDB error, updating in JSON:", e);
    }
  }

  const db = getLocalDB();
  db.certifications = db.certifications.map(c => (c.id === id ? { ...c, ...cert } : c));
  saveLocalDB(db);
  return { success: true };
}

export async function deleteCertification(id: string) {
  const client = await getDbClient();
  if (client) {
    try {
      const db = client.db();
      await db.collection("certifications").deleteOne({ _id: id as any });
      return { success: true };
    } catch (e) {
      console.error("MongoDB error, deleting from JSON:", e);
    }
  }

  const db = getLocalDB();
  db.certifications = db.certifications.filter(c => c.id !== id);
  saveLocalDB(db);
  return { success: true };
}

// Achievements Operations
export async function getAchievements() {
  const data = await getPortfolioData();
  return data.achievements;
}

export async function addAchievement(ach: any) {
  const client = await getDbClient();
  const id = Math.random().toString(36).substring(2, 9);
  const newAch = { ...ach, _id: id, id };

  if (client) {
    try {
      const db = client.db();
      await db.collection("achievements").insertOne({ ...ach, _id: id });
      return newAch;
    } catch (e) {
      console.error("MongoDB error, adding to JSON:", e);
    }
  }

  const db = getLocalDB();
  db.achievements.push(newAch);
  saveLocalDB(db);
  return newAch;
}

export async function updateAchievement(id: string, ach: any) {
  const client = await getDbClient();
  const { _id, id: _, ...updateData } = ach;
  if (client) {
    try {
      const db = client.db();
      await db.collection("achievements").updateOne({ _id: id as any }, { $set: updateData });
      return { success: true };
    } catch (e) {
      console.error("MongoDB error, updating in JSON:", e);
    }
  }

  const db = getLocalDB();
  db.achievements = db.achievements.map(a => (a.id === id ? { ...a, ...ach } : a));
  saveLocalDB(db);
  return { success: true };
}

export async function deleteAchievement(id: string) {
  const client = await getDbClient();
  if (client) {
    try {
      const db = client.db();
      await db.collection("achievements").deleteOne({ _id: id as any });
      return { success: true };
    } catch (e) {
      console.error("MongoDB error, deleting from JSON:", e);
    }
  }

  const db = getLocalDB();
  db.achievements = db.achievements.filter(a => a.id !== id);
  saveLocalDB(db);
  return { success: true };
}

// Media Slider Operations
export async function getMediaSlider() {
  const data = await getPortfolioData();
  return data.mediaSlider || [];
}

export async function addMediaSliderItem(item: any) {
  const client = await getDbClient();
  const id = Math.random().toString(36).substring(2, 9);
  const newItem = { ...item, _id: id, id };

  if (client) {
    try {
      const db = client.db();
      await db.collection("mediaSlider").insertOne({ ...item, _id: id });
      return newItem;
    } catch (e) {
      console.error("MongoDB error, adding to JSON:", e);
    }
  }

  const db = getLocalDB();
  if (!db.mediaSlider) db.mediaSlider = [];
  db.mediaSlider.push(newItem);
  saveLocalDB(db);
  return newItem;
}

export async function updateMediaSliderItem(id: string, item: any) {
  const client = await getDbClient();
  const { _id, id: _, ...updateData } = item;
  if (client) {
    try {
      const db = client.db();
      await db.collection("mediaSlider").updateOne({ _id: id as any }, { $set: updateData });
      return { success: true };
    } catch (e) {
      console.error("MongoDB error, updating slider in JSON:", e);
    }
  }

  const db = getLocalDB();
  if (!db.mediaSlider) db.mediaSlider = [];
  db.mediaSlider = db.mediaSlider.map(m => (m.id === id ? { ...m, ...item } : m));
  saveLocalDB(db);
  return { success: true };
}

export async function deleteMediaSliderItem(id: string) {
  const client = await getDbClient();
  
  // Find URL to delete file if it's local
  let url = "";
  const currentSlider = await getMediaSlider();
  const found = currentSlider.find((m: any) => m.id === id);
  if (found) {
    url = found.url;
  }

  if (url && url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", url);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete file from disk:", err);
      }
    }
  }

  if (client) {
    try {
      const db = client.db();
      await db.collection("mediaSlider").deleteOne({ _id: id as any });
      return { success: true };
    } catch (e) {
      console.error("MongoDB error, deleting from JSON:", e);
    }
  }

  const db = getLocalDB();
  if (!db.mediaSlider) db.mediaSlider = [];
  db.mediaSlider = db.mediaSlider.filter(m => m.id !== id);
  saveLocalDB(db);
  return { success: true };
}

// Media Operations
export async function getMedia() {
  const data = await getPortfolioData();
  return data.media;
}

export async function addMedia(item: any) {
  const client = await getDbClient();
  const id = Math.random().toString(36).substring(2, 9);
  const newItem = { ...item, _id: id, id };

  if (client) {
    try {
      const db = client.db();
      await db.collection("media").insertOne({ ...item, _id: id });
      return newItem;
    } catch (e) {
      console.error("MongoDB error, adding to JSON:", e);
    }
  }

  const db = getLocalDB();
  db.media.push(newItem);
  saveLocalDB(db);
  return newItem;
}

export async function deleteMedia(id: string) {
  const client = await getDbClient();
  
  // Find URL to delete file if it's local
  let url = "";
  const currentMedia = await getMedia();
  const found = currentMedia.find((m: any) => m.id === id);
  if (found) {
    url = found.url;
  }

  if (url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", url);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete file from disk:", err);
      }
    }
  }

  if (client) {
    try {
      const db = client.db();
      await db.collection("media").deleteOne({ _id: id as any });
      return { success: true };
    } catch (e) {
      console.error("MongoDB error, deleting from JSON:", e);
    }
  }

  const db = getLocalDB();
  db.media = db.media.filter(m => m.id !== id);
  saveLocalDB(db);
  return { success: true };
}
