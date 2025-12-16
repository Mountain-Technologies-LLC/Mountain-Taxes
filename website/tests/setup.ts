import '@testing-library/jest-dom';

// Global test setup
beforeEach(() => {
  // Clear any previous DOM state
  document.body.innerHTML = '';
});

// Mock Chart.js for testing
jest.mock('chart.js', () => ({
  Chart: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
    data: { datasets: [] },
    options: {}
  })),
  registerables: []
}));