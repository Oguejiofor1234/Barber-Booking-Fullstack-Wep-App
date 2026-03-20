// tests/setup.js  — runs once before all test suites (Jest globalSetup)
// Sets test environment variables so tests never touch the real database.

module.exports = async () => {
  process.env.NODE_ENV  = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_for_testing_only';
  // DATABASE_URL should be set externally (docker-compose.test.yml or .env.test)
  // Fallback to a local test database if not set
  process.env.DATABASE_URL = process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/barbershop_test?schema=public';
  // Disable real email sending in tests
  process.env.SMTP_HOST = '';
  process.env.SMTP_USER = '';
  process.env.SMTP_PASS = '';
};
