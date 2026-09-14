import { connectDB, closeDB } from './config/db';
import { UserModel } from './models';
import { USER_ROLES } from './constants';
import logger from './utils/logger';

/**
 * Seeds initial admin and regular user accounts.
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();

    const adminEmail = 'admin@example.com';
    const existingAdmin = await UserModel.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await UserModel.create({
        name: 'System Administrator',
        email: adminEmail,
        passwordHash: 'Admin@12345', // Pre-save hook will hash this
        role: USER_ROLES.ADMIN,
        isActive: true,
      });
      logger.info(`✅ Seeded Admin User: ${adminEmail} / Admin@12345`);
    } else {
      logger.info(`ℹ️ Admin user already exists: ${adminEmail}`);
    }

    const demoUserEmail = 'user@example.com';
    const existingUser = await UserModel.findOne({ email: demoUserEmail });

    if (!existingUser) {
      await UserModel.create({
        name: 'Demo User',
        email: demoUserEmail,
        passwordHash: 'User@12345',
        role: USER_ROLES.USER,
        isActive: true,
      });
      logger.info(`✅ Seeded Standard User: ${demoUserEmail} / User@12345`);
    } else {
      logger.info(`ℹ️ Standard user already exists: ${demoUserEmail}`);
    }

    logger.info('🎉 Database seeding completed successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Database seeding failed: ${message}`);
    process.exit(1);
  } finally {
    await closeDB();
  }
};

// Execute if run directly from command line
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

export default seedDatabase;
