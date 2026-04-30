import { TestRunner, assert, assertEquals, assertNotNull, assertGreaterThan } from '../utils/testRunner';
import { apiTester } from '../utils/apiTester';
import { testDataSeeder } from '../utils/testDataSeeder';

export async function runDashboardOverviewTests(testRunner: TestRunner) {
  testRunner.startSuite('Dashboard Overview');

  await testRunner.runTest('Statistics cards display correct counts', async () => {
    const response = await apiTester.get('/admin/stats');

    assert(response.success, 'Should fetch statistics successfully');
    assertNotNull(response.data, 'Response should contain data');

    const stats = response.data;
    assertNotNull(stats.totalStudents, 'Should have total students count');
    assertNotNull(stats.totalProfessors, 'Should have total professors count');
    assertNotNull(stats.totalWorkshops, 'Should have total workshops count');
    assertNotNull(stats.pendingApprovals, 'Should have pending approvals count');
    assertNotNull(stats.upcomingEvents, 'Should have upcoming events count');

    assertGreaterThan(stats.totalStudents, 0, 'Should have at least one student');
    assertGreaterThan(stats.totalProfessors, 0, 'Should have at least one professor');
    assertGreaterThan(stats.totalWorkshops, 0, 'Should have at least one workshop');
  });

  await testRunner.runTest('Statistics match database counts', async () => {
    const statsResponse = await apiTester.get('/admin/stats');
    const usersResponse = await apiTester.get('/admin/users', { params: { role: 'Student' } });
    const professorsResponse = await apiTester.get('/admin/users', { params: { role: 'Professor' } });
    const workshopsResponse = await apiTester.get('/admin/workshops');

    assert(statsResponse.success, 'Should fetch statistics');
    assert(usersResponse.success, 'Should fetch users');
    assert(professorsResponse.success, 'Should fetch professors');
    assert(workshopsResponse.success, 'Should fetch workshops');

    const stats = statsResponse.data;
    const studentCount = Array.isArray(usersResponse.data) ? usersResponse.data.length : 0;
    const professorCount = Array.isArray(professorsResponse.data) ? professorsResponse.data.length : 0;
    const workshopCount = Array.isArray(workshopsResponse.data) ? workshopsResponse.data.length : 0;

    assertEquals(stats.totalStudents, studentCount, 'Student count should match');
    assertEquals(stats.totalProfessors, professorCount, 'Professor count should match');
    assertEquals(stats.totalWorkshops, workshopCount, 'Workshop count should match');
  });

  await testRunner.runTest('Pending validation section displays pending workshops', async () => {
    const response = await apiTester.get('/admin/pending');

    assert(response.success, 'Should fetch pending workshops');
    assertNotNull(response.data, 'Response should contain data');
    assert(Array.isArray(response.data), 'Response should be an array');

    const pendingWorkshops = response.data;
    const testPendingWorkshops = testDataSeeder.getPendingWorkshops();

    assertGreaterThan(pendingWorkshops.length, 0, 'Should have pending workshops');

    // Verify all returned workshops have pending status
    pendingWorkshops.forEach((workshop: any) => {
      assertEquals(workshop.status, 'pending', 'All workshops should have pending status');
    });
  });

  await testRunner.runTest('Pending workshops contain required fields', async () => {
    const response = await apiTester.get('/admin/pending');

    assert(response.success, 'Should fetch pending workshops');
    const pendingWorkshops = response.data;

    if (pendingWorkshops.length > 0) {
      const workshop = pendingWorkshops[0];
      assertNotNull(workshop.title, 'Workshop should have title');
      assertNotNull(workshop.description, 'Workshop should have description');
      assertNotNull(workshop.date, 'Workshop should have date');
      assertNotNull(workshop.time, 'Workshop should have time');
      assertNotNull(workshop.location, 'Workshop should have location');
      assertNotNull(workshop.professor, 'Workshop should have professor');
      assertNotNull(workshop.capacity, 'Workshop should have capacity');
    }
  });

  await testRunner.runTest('Inbox section displays reports', async () => {
    const response = await apiTester.get('/admin/reports');

    assert(response.success, 'Should fetch reports');
    assertNotNull(response.data, 'Response should contain data');
    assert(Array.isArray(response.data), 'Response should be an array');

    const reports = response.data;
    const testReports = testDataSeeder.getTestReports();

    assertGreaterThan(reports.length, 0, 'Should have reports');
  });

  await testRunner.runTest('Reports contain required fields', async () => {
    const response = await apiTester.get('/admin/reports');

    assert(response.success, 'Should fetch reports');
    const reports = response.data;

    if (reports.length > 0) {
      const report = reports[0];
      assertNotNull(report.senderName, 'Report should have sender name');
      assertNotNull(report.subject, 'Report should have subject');
      assertNotNull(report.message, 'Report should have message');
      assertNotNull(report.priority, 'Report should have priority');
      assertNotNull(report.date, 'Report should have date');
    }
  });

  await testRunner.runTest('Analytics data structure is correct', async () => {
    const response = await apiTester.get('/admin/analytics');

    assert(response.success, 'Should fetch analytics');
    assertNotNull(response.data, 'Response should contain data');

    const analytics = response.data;
    assertNotNull(analytics.cards, 'Should have cards data');
    assertNotNull(analytics.chartData, 'Should have chart data');

    if (analytics.cards) {
      assertNotNull(analytics.cards.totalVisitors, 'Should have total visitors');
      assertNotNull(analytics.cards.activeStudents, 'Should have active students');
      assertNotNull(analytics.cards.totalProfessors, 'Should have total professors');
      assertNotNull(analytics.cards.totalWorkshops, 'Should have total workshops');
    }

    if (analytics.chartData && Array.isArray(analytics.chartData)) {
      analytics.chartData.forEach((item: any) => {
        assertNotNull(item._id, 'Chart item should have department');
        assertNotNull(item.count, 'Chart item should have count');
      });
    }
  });

  await testRunner.runTest('Monthly enrollments data is available', async () => {
    const response = await apiTester.get('/admin/analytics');

    assert(response.success, 'Should fetch analytics');
    const analytics = response.data;

    // Check if monthly enrollments is available (might be in different format)
    if (analytics.monthlyEnrollments) {
      assert(Array.isArray(analytics.monthlyEnrollments), 'Monthly enrollments should be an array');
      assertGreaterThan(analytics.monthlyEnrollments.length, 0, 'Should have monthly enrollment data');
    }
  });

  await testRunner.runTest('Workshops by department data is available', async () => {
    const response = await apiTester.get('/admin/analytics');

    assert(response.success, 'Should fetch analytics');
    const analytics = response.data;

    assertNotNull(analytics.chartData, 'Should have chart data');
    assert(Array.isArray(analytics.chartData), 'Chart data should be an array');
    assertGreaterThan(analytics.chartData.length, 0, 'Should have department data');
  });

  await testRunner.runTest('Dashboard data loads within acceptable time', async () => {
    const startTime = Date.now();

    const statsPromise = apiTester.get('/admin/stats');
    const analyticsPromise = apiTester.get('/admin/analytics');
    const workshopsPromise = apiTester.get('/admin/workshops');
    const reportsPromise = apiTester.get('/admin/reports');

    await Promise.all([statsPromise, analyticsPromise, workshopsPromise, reportsPromise]);

    const duration = Date.now() - startTime;
    assertGreaterThan(2000, duration, 'Dashboard should load within 2 seconds');
  });

  await testRunner.runTest('Error handling for failed API calls', async () => {
    // Test with invalid endpoint
    const response = await apiTester.get('/admin/invalid-endpoint');

    assert(!response.success, 'Invalid endpoint should fail');
    assertNotNull(response.error, 'Should have error message');
  });

  testRunner.endSuite();
}