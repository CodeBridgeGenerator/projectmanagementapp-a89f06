const { Subtasks } = require('./subtasks.class');
const createModel = require('../../models/subtasks.model');
const hooks = require('./subtasks.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ["$populate"],
    multi: ["create"],
  };

  // Initialize our service with any options it requires
  app.use('/subtasks', new Subtasks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('subtasks');

  // Get the schema of the collections 
  app.get("/subtasksSchema", function (request, response) {
    const schema = createModel(app).schema.tree;
    const result = Object.keys(schema).map(key => {
      return {
        field: key,
        properties: schema[key]
      };
    });
    return response.status(200).json(result);
  });

  service.hooks(hooks);
};