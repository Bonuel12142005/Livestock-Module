import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { sequelize, User, Member, Livestock, LivestockHealthRecord, LivestockWeightHistory } from '../app/models/index.js';
import { createDatabaseIfNotExists } from '../config/database.js';

dotenv.config();

async function runSeed() {
  console.log('🌱 Starting Livestock Module Database Seeder...');

  try {
    await createDatabaseIfNotExists();
    await sequelize.authenticate();
    await sequelize.sync();

    // 1. Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kambac.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
    const adminName = process.env.ADMIN_NAME || 'Livestock Administrator';

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        status: 'active'
      });
      console.log(`✅ Default Administrator seeded: ${adminEmail}`);
    } else {
      console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
    }

    // 2. Seed Initial Supporting Cooperative Members (Owners of Livestock)
    const membersData = [
      {
        member_code: 'MEM-001',
        first_name: 'Juan',
        last_name: 'Dela Cruz',
        contact_number: '09171234567',
        address: 'Brgy. San Jose, Naujan, Oriental Mindoro',
        membership_status: 'active'
      },
      {
        member_code: 'MEM-002',
        first_name: 'Maria',
        last_name: 'Santos',
        contact_number: '09189876543',
        address: 'Brgy. Barcenaga, Naujan, Oriental Mindoro',
        membership_status: 'active'
      },
      {
        member_code: 'MEM-003',
        first_name: 'Pedro',
        last_name: 'Reyes',
        contact_number: '09191122334',
        address: 'Brgy. Aurora, Naujan, Oriental Mindoro',
        membership_status: 'active'
      }
    ];

    for (const mem of membersData) {
      const existing = await Member.findOne({ where: { member_code: mem.member_code } });
      if (!existing) {
        await Member.create(mem);
        console.log(`✅ Member seeded: ${mem.first_name} ${mem.last_name} (${mem.member_code})`);
      }
    }

    // 3. Seed Sample Livestock Records
    const sampleLivestock = [
      {
        livestock_code: 'LS-2025-001',
        member_code: 'MEM-001',
        animal_name: 'Bessie',
        animal_type: 'Cattle',
        breed: 'Brahman Cross',
        sex: 'Female',
        date_acquired: '2025-01-15',
        birth_date: '2023-05-10',
        initial_weight: 320.00,
        current_weight: 415.50,
        health_status: 'Healthy',
        estimated_value: 48500.00,
        archive_status: 'active'
      },
      {
        livestock_code: 'LS-2025-002',
        member_code: 'MEM-002',
        animal_name: 'Thunder',
        animal_type: 'Carabao',
        breed: 'Philippine Carabao',
        sex: 'Male',
        date_acquired: '2025-02-01',
        birth_date: '2022-11-20',
        initial_weight: 450.00,
        current_weight: 520.00,
        health_status: 'Needs Monitoring',
        estimated_value: 65000.00,
        archive_status: 'active'
      },
      {
        livestock_code: 'LS-2025-003',
        member_code: 'MEM-003',
        animal_name: 'Billy',
        animal_type: 'Goat',
        breed: 'Boer Cross',
        sex: 'Male',
        date_acquired: '2025-03-10',
        birth_date: '2024-06-01',
        initial_weight: 25.00,
        current_weight: 38.50,
        health_status: 'Healthy',
        estimated_value: 8500.00,
        archive_status: 'active'
      }
    ];

    for (const ls of sampleLivestock) {
      const existing = await Livestock.findOne({ where: { livestock_code: ls.livestock_code } });
      if (!existing) {
        const owner = await Member.findOne({ where: { member_code: ls.member_code } });
        if (owner) {
          const created = await Livestock.create({
            livestock_code: ls.livestock_code,
            member_id: owner.id,
            animal_name: ls.animal_name,
            animal_type: ls.animal_type,
            breed: ls.breed,
            sex: ls.sex,
            date_acquired: ls.date_acquired,
            birth_date: ls.birth_date,
            initial_weight: ls.initial_weight,
            current_weight: ls.current_weight,
            health_status: ls.health_status,
            estimated_value: ls.estimated_value,
            archive_status: ls.archive_status
          });

          await LivestockWeightHistory.create({
            livestock_id: created.id,
            weight: ls.initial_weight,
            recorded_date: ls.date_acquired,
            remarks: 'Initial registered intake weight'
          });

          await LivestockHealthRecord.create({
            livestock_id: created.id,
            health_condition: ls.health_status,
            diagnosis: 'Initial registration inspection',
            treatment: 'Routine inspection & vaccination',
            record_date: ls.date_acquired,
            remarks: 'Livestock registered into cooperative database'
          });

          console.log(`✅ Livestock seeded: ${ls.livestock_code} - ${ls.animal_name}`);
        }
      }
    }

    console.log('🎉 Livestock Module database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await sequelize.close();
  }
}

runSeed();
