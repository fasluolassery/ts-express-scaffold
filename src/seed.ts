import mongoose from 'mongoose';
import config from './config';
import User from './models/user.model';
import logger from './utils/logger';

const DEMO_USERS: Array<{
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'worker' | 'admin';
}> = [
  {
    name: 'Sarah Jenkins',
    email: 'customer@example.com',
    password: 'password123',
    role: 'customer',
  },
  {
    name: 'Marcus Vance',
    email: 'worker@example.com',
    password: 'password123',
    role: 'worker',
  },
  {
    name: 'System Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
];

async function seedDatabase() {
  try {
    logger.info('Connecting to MongoDB for seeding...');
    await mongoose.connect(config.db.uri);
    logger.info('Connected to MongoDB.');

    for (const demoUser of DEMO_USERS) {
      const existingUser = await User.findOne({ email: demoUser.email });

      if (existingUser) {
        existingUser.name = demoUser.name;
        existingUser.password = demoUser.password;
        existingUser.role = demoUser.role as 'customer' | 'worker' | 'admin';
        await existingUser.save();
        logger.info(`Updated existing seed user: ${demoUser.email} (${demoUser.role})`);
      } else {
        await User.create(demoUser);
        logger.info(`Created new seed user: ${demoUser.email} (${demoUser.role})`);
      }
    }

    logger.info('Database seeding completed successfully.');
  } catch (error) {
    logger.error(`Error during database seeding: ${error}`);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedDatabase();
