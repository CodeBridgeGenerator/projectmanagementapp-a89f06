const assert = require('assert');
const app = require('../../src/app');

describe('\'subtasks\' service', () => {
  it('registered the service', () => {
    const service = app.service('subtasks');

    assert.ok(service, 'Registered the service (subtasks)');
  });
});
