import type { User, UserRole, Subject, Module, ClassGroup } from "../models";

// Default seed data for the application

export const defaultModules: Module[] = [
  {
    id: 0,
    name: "Subjects",
    slug: "subjects",
    description: "Manage class subjects, chapters, and content.",
    isActive: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const defaultClassGroups: ClassGroup[] = [
  {
    id: 1,
    name: "Class 9-10",
    slug: "9-10",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Class 11-12",
    slug: "11-12",
    createdAt: new Date().toISOString(),
  },
];

// Sample admin user for development (password: admin123)
export const defaultAdmin: User = {
  id: 1,
  role: "admin" as UserRole,
  name: "System Administrator",
  email: "admin@freeducation.com",
  passwordHash: "$2b$10$example.hash.here", // This should be properly hashed
  dateOfBirth: "1990-01-01",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Sample subjects for development
export const defaultSubjects: Subject[] = [
  {
    id: 1,
    name: "Mathematics",
    slug: "mathematics",
    templateSlug: "mathematics",
    description: "Mathematics for secondary and higher secondary education",
    isTwoPaper: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Higher Mathematics",
    slug: "higher-mathematics",
    templateSlug: "higher-mathematics",
    description: "Advanced mathematics for higher secondary education",
    isTwoPaper: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Bangla",
    slug: "bangla",
    templateSlug: "bangla",
    description: "Bangla language and literature",
    isTwoPaper: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Database seeding functions
export const seedModules = async (DB: D1Database): Promise<void> => {
  for (const module of defaultModules) {
    try {
      await DB.prepare(`
        INSERT OR IGNORE INTO modules (name, slug, description, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        module.name,
        module.slug,
        module.description,
        module.isActive,
        module.createdAt,
        module.updatedAt
      ).run();
    } catch (error) {
      console.error(`Error seeding module ${module.name}:`, error);
    }
  }
};

export const seedClassGroups = async (DB: D1Database): Promise<void> => {
  for (const classGroup of defaultClassGroups) {
    try {
      await DB.prepare(`
        INSERT OR IGNORE INTO class_groups (name, slug, created_at)
        VALUES (?, ?, ?)
      `).bind(
        classGroup.name,
        classGroup.slug,
        classGroup.createdAt
      ).run();
    } catch (error) {
      console.error(`Error seeding class group ${classGroup.name}:`, error);
    }
  }
};

export const seedSubjects = async (DB: D1Database): Promise<void> => {
  for (const subject of defaultSubjects) {
    try {
      await DB.prepare(`
        INSERT OR IGNORE INTO subjects (name, slug, template_slug, description, is_two_paper, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        subject.name,
        subject.slug,
        subject.templateSlug,
        subject.description,
        subject.isTwoPaper,
        subject.createdAt,
        subject.updatedAt
      ).run();
    } catch (error) {
      console.error(`Error seeding subject ${subject.name}:`, error);
    }
  }
};

// Master seeding function
export const seedDatabase = async (DB: D1Database): Promise<void> => {
  console.log("Starting database seeding...");
  
  await seedModules(DB);
  await seedClassGroups(DB);
  await seedSubjects(DB);
  
  console.log("Database seeding completed.");
};
