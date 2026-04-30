import { TestRunner, assert, assertEquals, assertNotNull, assertNotEquals, delay } from '../utils/testRunner';
import { apiTester } from '../utils/apiTester';
import { testDataSeeder } from '../utils/testDataSeeder';

export async function runAuthenticationTests(testRunner: TestRunner) {
  testRunner.startSuite('Authentication & Authorization');

  await testRunner.runTest('Admin login with valid credentials', async () => {
    const adminUser = testDataSeeder.getAdminUser();
    assertNotNull(adminUser, 'Admin user should exist in test data');

    const response = await apiTester.post('/users/login', {
      email: adminUser!.email,
      password: adminUser!.password,
    });

    assert(response.success, 'Login should succeed');
    assertNotNull(response.data, 'Response should contain data');
    assertNotNull(response.data.token, 'Response should contain token');
    assertNotNull(response.data.user, 'Response should contain user data');
    assertEquals(response.data.user.email, adminUser!.email, 'Email should match');
    assertEquals(response.data.user.role, 'Admin', 'Role should be Admin');

    // Store token for subsequent tests
    apiTester.setToken(response.data.token);
  });

  await testRunner.runTest('Login with invalid email', async () => {
    const response = await apiTester.post('/users/login', {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });

    assert(!response.success, 'Login should fail with invalid email');
    assertEquals(response.status, 401, 'Should return 401 status');
  });

  await testRunner.runTest('Login with invalid password', async () => {
    const adminUser = testDataSeeder.getAdminUser();
    assertNotNull(adminUser, 'Admin user should exist in test data');

    const response = await apiTester.post('/users/login', {
      email: adminUser!.email,
      password: 'wrongpassword',
    });

    assert(!response.success, 'Login should fail with invalid password');
    assertEquals(response.status, 401, 'Should return 401 status');
  });

  await testRunner.runTest('Token validation on protected endpoint', async () => {
    const response = await apiTester.get('/admin/stats');

    assert(response.success, 'Request with valid token should succeed');
    assertNotNull(response.data, 'Response should contain data');
  });

  await testRunner.runTest('Access admin endpoint without token', async () => {
    apiTester.clearToken();

    const response = await apiTester.get('/admin/stats');

    assert(!response.success, 'Request without token should fail');
    assertEquals(response.status, 401, 'Should return 401 status');

    // Restore token for subsequent tests
    const adminUser = testDataSeeder.getAdminUser();
    const loginResponse = await apiTester.post('/users/login', {
      email: adminUser!.email,
      password: adminUser!.password,
    });
    apiTester.setToken(loginResponse.data.token);
  });

  await testRunner.runTest('Student role cannot access admin endpoints', async () => {
    const studentUser = testDataSeeder.getStudentUsers()[0];
    assertNotNull(studentUser, 'Student user should exist in test data');

    // Login as student
    const loginResponse = await apiTester.post('/users/login', {
      email: studentUser.email,
      password: studentUser.password,
    });

    assert(loginResponse.success, 'Student login should succeed');
    apiTester.setToken(loginResponse.data.token);

    // Try to access admin endpoint
    const response = await apiTester.get('/admin/stats');

    assert(!response.success, 'Student should not access admin endpoints');
    assertEquals(response.status, 403, 'Should return 403 status');

    // Restore admin token
    const adminUser = testDataSeeder.getAdminUser();
    const adminLoginResponse = await apiTester.post('/users/login', {
      email: adminUser!.email,
      password: adminUser!.password,
    });
    apiTester.setToken(adminLoginResponse.data.token);
  });

  await testRunner.runTest('Professor role cannot access admin endpoints', async () => {
    const professorUser = testDataSeeder.getProfessorUsers()[0];
    assertNotNull(professorUser, 'Professor user should exist in test data');

    // Login as professor
    const loginResponse = await apiTester.post('/users/login', {
      email: professorUser.email,
      password: professorUser.password,
    });

    assert(loginResponse.success, 'Professor login should succeed');
    apiTester.setToken(loginResponse.data.token);

    // Try to access admin endpoint
    const response = await apiTester.get('/admin/stats');

    assert(!response.success, 'Professor should not access admin endpoints');
    assertEquals(response.status, 403, 'Should return 403 status');

    // Restore admin token
    const adminUser = testDataSeeder.getAdminUser();
    const adminLoginResponse = await apiTester.post('/users/login', {
      email: adminUser!.email,
      password: adminUser!.password,
    });
    apiTester.setToken(adminLoginResponse.data.token);
  });

  await testRunner.runTest('Admin can access all admin endpoints', async () => {
    const endpoints = [
      '/admin/stats',
      '/admin/analytics',
      '/admin/pending',
      '/admin/workshops',
      '/admin/reports',
      '/admin/users?role=Student',
      '/admin/certificates/completed',
    ];

    for (const endpoint of endpoints) {
      const response = await apiTester.get(endpoint);
      assert(response.success, `Admin should access ${endpoint}`);
      assertEquals(response.status, 200, `${endpoint} should return 200 status`);
    }
  });

  await testRunner.runTest('Logout functionality', async () => {
    const response = await apiTester.post('/admin/logout');

    assert(response.success, 'Logout should succeed');
    assertNotNull(response.data, 'Response should contain data');
    assertEquals(response.data.success, true, 'Success flag should be true');

    // Verify token is cleared
    apiTester.clearToken();

    // Try to access protected endpoint after logout
    const protectedResponse = await apiTester.get('/admin/stats');
    assert(!protectedResponse.success, 'Should not access protected endpoint after logout');
    assertEquals(protectedResponse.status, 401, 'Should return 401 status');

    // Restore admin token for subsequent tests
    const adminUser = testDataSeeder.getAdminUser();
    const loginResponse = await apiTester.post('/users/login', {
      email: adminUser!.email,
      password: adminUser!.password,
    });
    apiTester.setToken(loginResponse.data.token);
  });

  await testRunner.runTest('Token persistence across requests', async () => {
    const adminUser = testDataSeeder.getAdminUser();
    assertNotNull(adminUser, 'Admin user should exist in test data');

    // Login
    const loginResponse = await apiTester.post('/users/login', {
      email: adminUser!.email,
      password: adminUser!.password,
    });
    apiTester.setToken(loginResponse.data.token);

    // Make multiple requests
    const response1 = await apiTester.get('/admin/stats');
    const response2 = await apiTester.get('/admin/analytics');
    const response3 = await apiTester.get('/admin/workshops');

    assert(response1.success, 'First request should succeed');
    assert(response2.success, 'Second request should succeed');
    assert(response3.success, 'Third request should succeed');
  });

  testRunner.endSuite();
}