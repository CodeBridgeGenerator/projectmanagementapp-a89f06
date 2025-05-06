
    module.exports = function (app) {
        const modelName = 'tasks';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            projectID: { type:  String , required: true, maxLength: null },
userID: { type: Schema.Types.ObjectId, ref: "users" },
taskTitle: { type:  String , required: true },
description: { type:  String , required: true },
startDate: { type: Date, required: false },
dueDate: { type: Date, required: false },
status: { type:  String , required: true, maxLength: null },
priority: { type:  String , required: true, maxLength: null },
attachments: { type:  [Schema.Types.ObjectId], ref: "document_storages" , required: true, maxLength: null },

            
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