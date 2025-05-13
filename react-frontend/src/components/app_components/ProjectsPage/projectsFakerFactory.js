
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
projectID: faker.lorem.sentence(1),
clientID: faker.lorem.sentence(1),
projectTitle: faker.lorem.sentence(1),
description: faker.lorem.sentence(1),
startDate: faker.lorem.sentence(1),
endDate: faker.lorem.sentence(1),
status: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
