
    module.exports = function (app) {
        const modelName = 'subtasks';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            taskID: { type:  String , required: true, maxLength: null },
subtaskTitle: { type:  String , required: true, maxLength: null },
description: { type:  String , required: true, maxLength: null },
dueDate: { type: Date, required: false },
status: { type:  String , required: true, maxLength: null },
attachments: { type:  [Schema.Types.ObjectId], ref: "document_storages" , required: true },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };