
import { faker } from "@faker-js/faker";
export default (user,count,userIDIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
projectID: faker.lorem.sentence(""),
userID: userIDIds[i % userIDIds.length],
taskTitle: faker.lorem.sentence(""),
description: faker.lorem.sentence(""),
startDate: faker.lorem.sentence(1),
dueDate: faker.lorem.sentence(1),
status: faker.lorem.sentence(""),
priority: faker.lorem.sentence(""),
attachments: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
