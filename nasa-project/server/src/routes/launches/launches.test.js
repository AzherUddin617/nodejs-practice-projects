const request = require('supertest');
const app = require('../../app');

describe("Test GET /launches", ()=> {
    // test("It should respond with 200 success", async ()=> {
    //     const response = await request(app).get('/launches');
    //     expect(response.statusCode).toBe(201);
    // });

    test("It should respond with 200 success", async ()=> {
        await request(app).get('/launches')
            .expect(200)
            .expect("Content-Type", /json/);
    });
});

describe("Test POST /launches", ()=> {
    const launchDataComplete = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-185 f",
        launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-185 f",
    };

    const launchDataWithInvalidDate = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-185 f",
        launchDate: "Dunno",
    };

    test("It should respond with 201 created", async ()=> {
        const response = await request(app).post('/launches')
            .send(launchDataComplete)
            .expect(201)
            .expect("Content-Type", /json/);

        const requestDate = new Date(launchDataComplete.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(requestDate).toBe(responseDate);

        expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async ()=> {
        const response = await request(app).post('/launches')
            .send(launchDataWithoutDate)
            .expect(400)
            .expect("Content-Type", /json/);

        expect(response.body).toStrictEqual({
            error: "Missing required launch property",
            launch: launchDataWithoutDate
        });
    });
    test("It should catch invalid date", async ()=> {
        const response = await request(app).post('/launches')
            .send(launchDataWithInvalidDate)
            .expect(400)
            .expect("Content-Type", /json/);

        expect(response.body).toStrictEqual({
            error: "Invalid launch date",
        });
    });
});