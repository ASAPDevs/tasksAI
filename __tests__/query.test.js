const EasyGraphQLTester = require('easygraphql-tester');
const { typeDefs, resolvers } = require('../server/schema');
const supertest = require('supertest');
const app = require('../server/server.js');
const request = require('supertest')

app.server = app.listen(3333);


// console.log('typeDefs: ', typeDefs)
// console.log('resolvers', resolvers)
// const tester = new EasyGraphQLTester(typeDefs, resolvers)

// //arguments: query, rootValue, contextValue, and variableValues
// tester.graphql(signUpQuery, undefined, undefined, {email: 'testing@test.com', username: 'tester1', password: 'tester1'})
// .then(result => console.log(result))
// .catch(err => console.log(err));


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
    afterEach(() => app.server.close())

    it('Should login and send back a user if information is correct', (done) => {
        const loginQuery = `
            mutation {
                login(username: "jack", password: "abc") {
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
                expect(res.body.data.login.id).toBe('2')
                expect(res.body.data.login.username).toBe('jack')
                return done()
            })
    })

    it('Should return error message array and data is null', (done) => {
        const loginQuery = `
            mutation {
                login(username: "brian", password: "abc") {
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
    afterEach(() => app.server.close())

    it('Should return an array of tasks of the given date for a specific user', (done) => {
        const getTasksQuery = `
        query {
            getTasksByDay(date: "2022-12-08", user_id: 2) {
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
                expect(res.body.data.getTasksByDay).toHaveLength(2)
                expect(res.body.data.getTasksByDay[0].id).toEqual('2')
                expect(res.body.data.getTasksByDay[0].task_name).toEqual('make portfolio')
                expect(res.body.data.getTasksByDay[0].date).toEqual('1670518800000')
                return done()
            })
    })
})

describe('Testing CreateTask Resolver', () => {
    afterEach(() => app.server.close());

    it('Should return a newly created task', (done) => {
        // COMMENT: create another db for testing
        const taskInput = `
            {
                task_name: "make project",
                task_description: "make a cool project", 
                date: "1670518800000", 
                time_start: "1670518800000", 
                time_finished: "1670522400000", 
                completed: false, 
                user_id: 1
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
                expect(res.body.data.createTask.task_name).toEqual('make project')
                expect(res.body.data.createTask.user_id).toEqual(1)
                return done()
            })
    })
})