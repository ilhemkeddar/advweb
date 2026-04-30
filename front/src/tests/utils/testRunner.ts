export interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: any;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  duration: number;
  passed: number;
  failed: number;
}

export interface TestReport {
  totalSuites: number;
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  totalDuration: number;
  suites: TestSuite[];
  timestamp: string;
}

export class TestRunner {
  private suites: TestSuite[] = [];
  private currentSuite: TestSuite | null = null;

  startSuite(name: string) {
    this.currentSuite = {
      name,
      tests: [],
      duration: 0,
      passed: 0,
      failed: 0,
    };
    console.log(`\n📦 Starting Test Suite: ${name}`);
  }

  async runTest(testName: string, testFn: () => Promise<void> | void) {
    if (!this.currentSuite) {
      throw new Error('No active test suite. Call startSuite() first.');
    }

    const startTime = Date.now();
    console.log(`  ⏳ Running: ${testName}`);

    try {
      await testFn();
      const duration = Date.now() - startTime;
      const result: TestResult = {
        testName,
        passed: true,
        duration,
      };
      this.currentSuite.tests.push(result);
      this.currentSuite.passed++;
      console.log(`  ✅ PASSED: ${testName} (${duration}ms)`);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const result: TestResult = {
        testName,
        passed: false,
        duration,
        error: error.message,
        details: error.details,
      };
      this.currentSuite.tests.push(result);
      this.currentSuite.failed++;
      console.log(`  ❌ FAILED: ${testName} (${duration}ms)`);
      console.log(`     Error: ${error.message}`);
    }
  }

  endSuite() {
    if (!this.currentSuite) {
      throw new Error('No active test suite to end.');
    }

    this.currentSuite.duration = this.currentSuite.tests.reduce(
      (sum, test) => sum + test.duration,
      0
    );
    this.suites.push(this.currentSuite);

    console.log(
      `\n📊 Suite Results: ${this.currentSuite.name}`
    );
    console.log(
      `   Passed: ${this.currentSuite.passed} | Failed: ${this.currentSuite.failed} | Duration: ${this.currentSuite.duration}ms`
    );

    this.currentSuite = null;
  }

  generateReport(): TestReport {
    const totalTests = this.suites.reduce((sum, suite) => sum + suite.tests.length, 0);
    const totalPassed = this.suites.reduce((sum, suite) => sum + suite.passed, 0);
    const totalFailed = this.suites.reduce((sum, suite) => sum + suite.failed, 0);
    const totalDuration = this.suites.reduce((sum, suite) => sum + suite.duration, 0);

    return {
      totalSuites: this.suites.length,
      totalTests,
      totalPassed,
      totalFailed,
      totalDuration,
      suites: this.suites,
      timestamp: new Date().toISOString(),
    };
  }

  printSummary() {
    const report = this.generateReport();

    console.log('\n' + '='.repeat(60));
    console.log('🎯 TEST EXECUTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Suites: ${report.totalSuites}`);
    console.log(`Total Tests: ${report.totalTests}`);
    console.log(`✅ Passed: ${report.totalPassed}`);
    console.log(`❌ Failed: ${report.totalFailed}`);
    console.log(`⏱️  Total Duration: ${report.totalDuration}ms`);
    console.log(`📅 Timestamp: ${report.timestamp}`);
    console.log('='.repeat(60));

    if (report.totalFailed > 0) {
      console.log('\n❌ FAILED TESTS:');
      report.suites.forEach(suite => {
        suite.tests.filter(test => !test.passed).forEach(test => {
          console.log(`  - ${suite.name} > ${test.testName}`);
          console.log(`    Error: ${test.error}`);
        });
      });
    }

    const successRate = ((report.totalPassed / report.totalTests) * 100).toFixed(2);
    console.log(`\n📈 Success Rate: ${successRate}%`);
    console.log('='.repeat(60) + '\n');
  }

  getFailedTests(): TestResult[] {
    const failedTests: TestResult[] = [];
    this.suites.forEach(suite => {
      failedTests.push(...suite.tests.filter(test => !test.passed));
    });
    return failedTests;
  }
}

export class AssertionError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'AssertionError';
  }
}

export function assert(condition: boolean, message: string, details?: any) {
  if (!condition) {
    throw new AssertionError(message, details);
  }
}

export function assertEquals(actual: any, expected: any, message?: string) {
  if (actual !== expected) {
    throw new AssertionError(
      message || `Expected ${expected} but got ${actual}`,
      { actual, expected }
    );
  }
}

export function assertNotEquals(actual: any, expected: any, message?: string) {
  if (actual === expected) {
    throw new AssertionError(
      message || `Expected ${actual} to not equal ${expected}`,
      { actual, expected }
    );
  }
}

export function assertNotNull(value: any, message?: string) {
  if (value === null || value === undefined) {
    throw new AssertionError(
      message || `Expected value to not be null or undefined`,
      { value }
    );
  }
}

export function assertContains(array: any[], item: any, message?: string) {
  if (!array.includes(item)) {
    throw new AssertionError(
      message || `Expected array to contain ${item}`,
      { array, item }
    );
  }
}

export function assertGreaterThan(value: number, threshold: number, message?: string) {
  if (value <= threshold) {
    throw new AssertionError(
      message || `Expected ${value} to be greater than ${threshold}`,
      { value, threshold }
    );
  }
}

export function assertLessThan(value: number, threshold: number, message?: string) {
  if (value >= threshold) {
    throw new AssertionError(
      message || `Expected ${value} to be less than ${threshold}`,
      { value, threshold }
    );
  }
}

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateTestEmail() {
  return `test-${Date.now()}@example.com`;
}

export function generateTestPassword() {
  return `Test${Date.now()}!`;
}