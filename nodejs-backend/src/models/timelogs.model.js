
    module.exports = function (app) {
        const modelName = 'timelogs';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            taskID: { type:  String , required: true },
userID: { type:  String , required: true },
hoursSpent: { type: Number, required: false, max: 10000000 },
logDate: { type: Date, required: false },
description: { type:  String , required: true },

            
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