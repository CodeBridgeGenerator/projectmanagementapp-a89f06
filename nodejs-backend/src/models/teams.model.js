
    module.exports = function (app) {
        const modelName = 'teams';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            teamID: { type:  String , required: true },
projectID: { type: Schema.Types.ObjectId, ref: "projects" },
userID: { type: Schema.Types.ObjectId, ref: "users" },
teamName: { type:  String , required: true },

            
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