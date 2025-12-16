/**
 * Basic test to verify Jest and testing setup is working
 */

describe('Testing Setup', () => {
  test('Jest is working correctly', () => {
    expect(true).toBe(true);
  });

  test('DOM environment is available', () => {
    const div = document.createElement('div');
    div.textContent = 'Test';
    expect(div.textContent).toBe('Test');
  });

  test('fast-check is available', async () => {
    const fc = await import('fast-check');
    expect(fc).toBeDefined();
    expect(typeof fc.integer).toBe('function');
  });
});