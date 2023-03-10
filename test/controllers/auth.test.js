const {
    createDB,
    clearDB,
    closeDB
} = require('../db');
const {
    login,
    signup
} = require('../../controllers/user.controller')
const {
    mockRequest,
    mockResponse
} = require('../interceptor')
const userModel = require('../../models/user.model')
const bcrypt = require('bcrypt')
const userPayload = {
    name: "test",
    username: "student",
    email: "test@gmail.com",
    mobile: "8449023878",
    password: "test"
}
beforeAll(async () => await createDB());
beforeEach(async () => await clearDB());
afterAll(async () => await closeDB());
describe("Signup testing !", () => {
    it("signup should pass!", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = userPayload;
        //action
        await signup(req, res);
        //asserts
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Signup successfully!"
            })
        )
    })
    it("signup should fail due to not provide proper data", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            name: "test",
            email: "test@gmail.com"
        }
        //action
        await signup(req, res);
        //asserts
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Please Provide all required fields  !Bad request!"
            })
        )
    })
    it("signup should fail due to  internal server error", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = userPayload;
        const userSPy = jest.spyOn(userModel, 'create').mockReturnValue(Promise.reject("Internal error occuring"));
        //action
        await signup(req, res);
        //asserts
        expect(userSPy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Internal server error!"
            })
        )
    })
})

describe("Login testing!", () => {
    it("login should pass", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            email: "test@gmal.com",
            password: "test"
        }
        const userSpy = jest.spyOn(userModel, 'findOne').mockReturnValue(Promise.resolve(userPayload));
        const bcryptSpy = jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
        await login(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(bcryptSpy).toBeCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "login successfully"
            })
        )
    })
    it("login should fail due to wrong email", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            email: "test1@gmal.com",
            password: "test"
        }
        const userSpy = jest.spyOn(userModel, 'findOne').mockReturnValue(Promise.resolve(null));
        await login(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "user does not exists!"
            })
        )
    })
    it("login should fail due to wrong password", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            email: "test@gmal.com",
            password: "test454"
        }
        const userSpy = jest.spyOn(userModel, 'findOne').mockReturnValue(Promise.resolve(userPayload));
        const bcryptSpy = jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
        await login(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(bcryptSpy).toBeCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Invalied Password!'
            })
        )
    })
    it("login should fail due to internal server error", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            email: "test@gmal.com",
            password: "test"
        }
        const userSpy = jest.spyOn(userModel, 'findOne').mockReturnValue(Promise.reject("error occuring"));
        const bcryptSpy = jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
        await login(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(bcryptSpy).toBeCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Internal server error!"
            })
        )
    })
})
