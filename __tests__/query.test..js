const EasyGraphQLTester = require('easygraphql-tester')
const { typeDefs, resolvers } = require('../server/schema')

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
