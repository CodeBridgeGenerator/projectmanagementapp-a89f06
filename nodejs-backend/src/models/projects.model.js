
    module.exports = function (app) {
        const modelName = 'projects';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            projectID: { type:  String , required: true },
clientID: { type:  String , required: true },
projectTitle: { type:  String , required: true },
description: { type:  String , required: true },
startDate: { type:  String , required: true },
endDate: { type:  String , required: true },
status: { type:  String , required: true },

            
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