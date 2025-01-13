const app = require("../app");
const request = require("supertest");
const reqAddTask = require("../utils/data/task.data.test.js");

describe("API tasks", () => {
	it("should return all tasks", async () => {
		const res = await request(app).get("/todo-list");

		expect(res.status).toBe(200);
		expect(res.body).toBeInstanceOf(Array);
	});
});
