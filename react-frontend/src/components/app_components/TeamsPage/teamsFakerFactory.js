
import { faker } from "@faker-js/faker";
export default (user,count,projectIDIds,userIDIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
teamID: faker.lorem.sentence(""),
projectID: projectIDIds[i % projectIDIds.length],
userID: userIDIds[i % userIDIds.length],
teamName: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
