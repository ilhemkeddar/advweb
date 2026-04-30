import { apiTester } from './apiTester';

export interface TestUser {
  email: string;
  password: string;
  fullName: string;
  role: 'Student' | 'Professor' | 'Admin';
  department?: string;
}

export interface TestWorkshop {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  department: string;
  type: string;
  capacity: number;
  status: 'pending' | 'approved' | 'rejected';
  professor: {
    name: string;
    role: string;
  };
}

export interface TestReport {
  senderName: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

export class TestDataSeeder {
  private testUsers: TestUser[] = [];
  private testWorkshops: TestWorkshop[] = [];
  private testReports: TestReport[] = [];

  async clearAllTestData() {
    console.log('🧹 Clearing test data...');

    try {
      // Clear workshops
      const workshopsResponse = await apiTester.get('/workshops');
      if (workshopsResponse.success && Array.isArray(workshopsResponse.data)) {
        for (const workshop of workshopsResponse.data) {
          await apiTester.delete(`/workshops/${workshop._id}`);
        }
      }

      // Clear reports
      const reportsResponse = await apiTester.get('/admin/reports');
      if (reportsResponse.success && Array.isArray(reportsResponse.data)) {
        for (const report of reportsResponse.data) {
          await apiTester.delete(`/admin/reports/${report._id}`);
        }
      }

      // Clear users (except admin)
      const usersResponse = await apiTester.get('/users');
      if (usersResponse.success && Array.isArray(usersResponse.data)) {
        for (const user of usersResponse.data) {
          if (user.role !== 'Admin') {
            await apiTester.delete(`/users/${user._id}`);
          }
        }
      }

      console.log('✅ Test data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing test data:', error);
      throw error;
    }
  }

  async seedTestUsers() {
    console.log('👥 Seeding test users...');

    const users: TestUser[] = [
      {
        email: 'admin@test.com',
        password: 'Admin123!',
        fullName: 'Test Admin',
        role: 'Admin',
      },
      {
        email: 'student1@test.com',
        password: 'Student123!',
        fullName: 'Test Student 1',
        role: 'Student',
        department: 'Computer Science',
      },
      {
        email: 'student2@test.com',
        password: 'Student123!',
        fullName: 'Test Student 2',
        role: 'Student',
        department: 'Mathematics',
      },
      {
        email: 'student3@test.com',
        password: 'Student123!',
        fullName: 'Test Student 3',
        role: 'Student',
        department: 'Physics',
      },
      {
        email: 'professor1@test.com',
        password: 'Professor123!',
        fullName: 'Test Professor 1',
        role: 'Professor',
        department: 'Computer Science',
      },
      {
        email: 'professor2@test.com',
        password: 'Professor123!',
        fullName: 'Test Professor 2',
        role: 'Professor',
        department: 'Mathematics',
      },
      {
        email: 'professor3@test.com',
        password: 'Professor123!',
        fullName: 'Test Professor 3',
        role: 'Professor',
        department: 'Physics',
      },
    ];

    for (const user of users) {
      const response = await apiTester.post('/users/register', user);
      if (response.success) {
        this.testUsers.push(user);
        console.log(`  ✅ Created user: ${user.email} (${user.role})`);
      } else {
        console.log(`  ⚠️  User already exists or error: ${user.email}`);
      }
    }

    console.log(`✅ Seeded ${this.testUsers.length} test users`);
    return this.testUsers;
  }

  async seedTestWorkshops() {
    console.log('📚 Seeding test workshops...');

    const workshops: TestWorkshop[] = [
      {
        title: 'Introduction to Machine Learning',
        description: 'Learn the basics of ML algorithms and applications',
        date: '2025-05-15',
        time: '10:00',
        location: 'Room 101',
        department: 'Computer Science',
        type: 'Workshop',
        capacity: 30,
        status: 'pending',
        professor: {
          name: 'Test Professor 1',
          role: 'Professor',
        },
      },
      {
        title: 'Advanced Calculus',
        description: 'Deep dive into calculus concepts',
        date: '2025-05-20',
        time: '14:00',
        location: 'Room 205',
        department: 'Mathematics',
        type: 'Workshop',
        capacity: 25,
        status: 'pending',
        professor: {
          name: 'Test Professor 2',
          role: 'Professor',
        },
      },
      {
        title: 'Quantum Physics Fundamentals',
        description: 'Introduction to quantum mechanics',
        date: '2025-05-25',
        time: '09:00',
        location: 'Lab 301',
        department: 'Physics',
        type: 'Workshop',
        capacity: 20,
        status: 'approved',
        professor: {
          name: 'Test Professor 3',
          role: 'Professor',
        },
      },
      {
        title: 'Web Development Bootcamp',
        description: 'Full-stack web development intensive',
        date: '2025-04-10',
        time: '10:00',
        location: 'Room 102',
        department: 'Computer Science',
        type: 'Bootcamp',
        capacity: 40,
        status: 'approved',
        professor: {
          name: 'Test Professor 1',
          role: 'Professor',
        },
      },
      {
        title: 'Statistics for Data Science',
        description: 'Statistical methods for data analysis',
        date: '2025-04-05',
        time: '11:00',
        location: 'Room 201',
        department: 'Mathematics',
        type: 'Workshop',
        capacity: 35,
        status: 'rejected',
        professor: {
          name: 'Test Professor 2',
          role: 'Professor',
        },
      },
      {
        title: 'Experimental Physics',
        description: 'Hands-on physics experiments',
        date: '2025-04-01',
        time: '13:00',
        location: 'Lab 302',
        department: 'Physics',
        type: 'Lab',
        capacity: 15,
        status: 'approved',
        professor: {
          name: 'Test Professor 3',
          role: 'Professor',
        },
      },
      {
        title: 'Database Systems',
        description: 'Relational and NoSQL databases',
        date: '2025-06-01',
        time: '15:00',
        location: 'Room 103',
        department: 'Computer Science',
        type: 'Workshop',
        capacity: 30,
        status: 'pending',
        professor: {
          name: 'Test Professor 1',
          role: 'Professor',
        },
      },
      {
        title: 'Linear Algebra',
        description: 'Matrix operations and transformations',
        date: '2025-06-05',
        time: '10:00',
        location: 'Room 202',
        department: 'Mathematics',
        type: 'Workshop',
        capacity: 25,
        status: 'pending',
        professor: {
          name: 'Test Professor 2',
          role: 'Professor',
        },
      },
      {
        title: 'Thermodynamics',
        description: 'Heat and energy transfer',
        date: '2025-06-10',
        time: '14:00',
        location: 'Lab 303',
        department: 'Physics',
        type: 'Workshop',
        capacity: 20,
        status: 'pending',
        professor: {
          name: 'Test Professor 3',
          role: 'Professor',
        },
      },
      {
        title: 'Cloud Computing',
        description: 'AWS, Azure, and GCP fundamentals',
        date: '2025-03-15',
        time: '09:00',
        location: 'Room 104',
        department: 'Computer Science',
        type: 'Workshop',
        capacity: 35,
        status: 'approved',
        professor: {
          name: 'Test Professor 1',
          role: 'Professor',
        },
      },
    ];

    for (const workshop of workshops) {
      const response = await apiTester.post('/workshops', workshop);
      if (response.success) {
        this.testWorkshops.push({ ...workshop, ...response.data });
        console.log(`  ✅ Created workshop: ${workshop.title} (${workshop.status})`);
      } else {
        console.log(`  ⚠️  Error creating workshop: ${workshop.title}`);
      }
    }

    console.log(`✅ Seeded ${this.testWorkshops.length} test workshops`);
    return this.testWorkshops;
  }

  async seedTestReports() {
    console.log('📝 Seeding test reports...');

    const reports: TestReport[] = [
      {
        senderName: 'Test Student 1',
        subject: 'Issue with workshop registration',
        message: 'I am unable to register for the Machine Learning workshop. The system shows an error.',
        priority: 'high',
      },
      {
        senderName: 'Test Professor 1',
        subject: 'Room booking conflict',
        message: 'Room 101 is double-booked for May 15th. Please resolve this conflict.',
        priority: 'medium',
      },
      {
        senderName: 'Test Student 2',
        subject: 'Certificate not received',
        message: 'I completed the Web Development workshop but have not received my certificate yet.',
        priority: 'low',
      },
      {
        senderName: 'Test Professor 2',
        subject: 'Equipment request',
        message: 'We need additional projectors for the Mathematics workshops next week.',
        priority: 'medium',
      },
      {
        senderName: 'Test Student 3',
        subject: 'Login problem',
        message: 'I am having trouble logging into my account. It says invalid credentials.',
        priority: 'high',
      },
    ];

    for (const report of reports) {
      const response = await apiTester.post('/contacts', report);
      if (response.success) {
        this.testReports.push({ ...report, ...response.data });
        console.log(`  ✅ Created report: ${report.subject} (${report.priority})`);
      } else {
        console.log(`  ⚠️  Error creating report: ${report.subject}`);
      }
    }

    console.log(`✅ Seeded ${this.testReports.length} test reports`);
    return this.testReports;
  }

  async seedAllTestData() {
    console.log('🌱 Starting test data seeding...\n');

    await this.seedTestUsers();
    await this.seedTestWorkshops();
    await this.seedTestReports();

    console.log('\n✅ All test data seeded successfully!');
    return {
      users: this.testUsers,
      workshops: this.testWorkshops,
      reports: this.testReports,
    };
  }

  getTestUsers() {
    return this.testUsers;
  }

  getTestWorkshops() {
    return this.testWorkshops;
  }

  getTestReports() {
    return this.testReports;
  }

  getAdminUser() {
    return this.testUsers.find(user => user.role === 'Admin');
  }

  getStudentUsers() {
    return this.testUsers.filter(user => user.role === 'Student');
  }

  getProfessorUsers() {
    return this.testUsers.filter(user => user.role === 'Professor');
  }

  getPendingWorkshops() {
    return this.testWorkshops.filter(workshop => workshop.status === 'pending');
  }

  getApprovedWorkshops() {
    return this.testWorkshops.filter(workshop => workshop.status === 'approved');
  }

  getRejectedWorkshops() {
    return this.testWorkshops.filter(workshop => workshop.status === 'rejected');
  }
}

export const testDataSeeder = new TestDataSeeder();