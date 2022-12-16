const EasyGraphQLTester = require('easygraphql-tester');
const { typeDefs, resolvers } = require('../schema');
const supertest = require('supertest');
const app = require('../server.js');
const request = require('supertest')

describe('Schema testing', () => {
    let tester
    beforeEach(() => {
        tester = new EasyGraphQLTester(typeDefs, resolvers)
    })

    it('Should be a valid login query string', () => {
        const loginQuery = `
            mutation Login($username: String!, $password: String!) {
                login(username: $username, password: $password) {
                    id
                    username
                    email
                }
            }
        `

        tester.test(true, loginQuery, {username: 'tommy',password: 'abc'})
    })

    it('Should return false if query contains invalid fields', () => {
        const invalidLoginQuery = `
            mutation Login($username: String, $password: String) {
                login(username: $username, password: $password) {
                    id
                    username
                    email
                    wrongstuff
                }
            }
        `
        tester.test(false, invalidLoginQuery, {username: 'tommy1', password: 'abc123'})
    })

    it('Should return false if arguments are incorrect', () => {
        const invalidLoginQuery = `
            mutation Login($username: String, $password: String) {
                login(user: $username, password: $password) {
                    id
                    username
                    email
                }
            }
        `
        tester.test(false, invalidLoginQuery, {username: 'tommy1', password: 'abc123'})
    })

    it('Should return false if arguments are omitted', () => {
        const invalidLoginQuery = `
            mutation {
                login(username: $username) {
                    id
                    username
                }
            }
        `
        tester.test(false, invalidLoginQuery)
    })

    it('Should return false if argument types are Number', () => {
        const invalidLoginQuery = `
            mutation {
                login(username: 1, password: 1) {
                    id
                    username
                }
            }
        `
        tester.test(false, invalidLoginQuery)
    })

    it('Should return true if argument types are String', () => {
        const loginQuery = `
            mutation {
                login(username: "tommy", password: "abc") {
                    id
                    username
                }
            }
        `
        tester.test(true, loginQuery)
    })
})


describe('Login Resolver', () => {
    beforeEach(() => app.server = app.listen(3333))
    afterEach(() => app.server.close())

    it('Should login and send back a user if information is correct', (done) => {
        const loginQuery = `
            mutation {
                login(username: "testuser", password: "a123") {
                    id
                    username
                }
            }
        `
        request(app)
            .post('/graphql')
            .send({
                query: loginQuery
            })
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body && typeof res.body === 'object').toBe(true)
                expect(res.body).toHaveProperty('data')
                expect(res.body.data.login.id).toBe('20')
                expect(res.body.data.login.username).toBe('testuser')
                return done()
            })
    })

    it('Should return error message array and data is null', (done) => {
        const loginQuery = `
            mutation {
                login(username: "testuser", password: "abc") {
                    id
                    username
                }
            }
        `
        request(app)
            .post('/graphql')
            .send({
                query: loginQuery
            })
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body.data).toBe(null)
                expect(res.body.errors).not.toBe(null)
                return done()
            })
    })
})


describe('Testing GetTasks Resolver', () => {
    beforeEach(() => app.server = app.listen(3333))
    afterEach(() => app.server.close())

    it('Should return an array of tasks of the given date for a specific user', (done) => {
        const getTasksQuery = `
        query {
            getTasksByDay(date: "2022-12-15", user_id: 21) {
                id
                task_name
                task_description
                date
                time_start
                time_finished
                completed
                user_id
            }
        }
        `
        request(app)
            .post('/graphql')
            .send({
                query: getTasksQuery
            })
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body.data).toBeTruthy()
                expect(res.body.errors).not.toBe(null)
                expect(res.body.data.getTasksByDay).toHaveLength(3)
                expect(res.body.data.getTasksByDay[0].id).toEqual('75')
                expect(res.body.data.getTasksByDay[0].task_name).toMatch(/react/i)
                expect(res.body.data.getTasksByDay[0].task_description).toMatch(/learn react/i)
                expect(res.body.data.getTasksByDay[0].date).toEqual('1671129416553')
                return done()
            })
    })
})

describe('Testing CreateTask Resolver', () => {
    beforeEach(() => app.server = app.listen(3333))
    afterEach(() => app.server.close());

    it('Should return a newly created task', (done) => {
        // COMMENT: create another db for testing
        const taskInput = `
            {
                task_name: "test project",
                task_description: "make a test project", 
                date: "1671129296702", 
                time_start: "1671129299999", 
                time_finished: "1671129399999", 
                completed: false, 
                user_id: 20
            }
        `
        const createTaskQuery = `
            mutation {
                createTask (task: ${taskInput}) {
                    task_name
                    task_description
                    date
                    time_start
                    time_finished
                    completed
                    user_id
                }
            }
        `

        request(app)
            .post('/graphql')
            .send({
                query: createTaskQuery
            })
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).toHaveProperty('data')
                expect(res.body.data.createTask.task_name).toEqual('test project')
                expect(res.body.data.createTask.user_id).toEqual(20)
                return done()
            })
    })
})