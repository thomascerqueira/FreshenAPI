import {closeDb, run} from "../src/utils/mongo";
import {resetMongo} from "../src/utils/handleTest";
import {Auth} from "../src/services/authService";
import {Token} from "../src/utils/token";
import {Users} from "../src/services/userService";

describe("Auth", () => {
  let id = ""

  const newUser = {
    email: "TestEmail@google.com",
    password: "password12345_",
    locale: "FR_fr",
    provider: "email",
    username: "testUser"
  }

  beforeAll(async () => {
    await run()
    await resetMongo()
  })

  afterAll(async () => {
    await closeDb()
  })

  test("Should register a user", async () => {
    const token = await Auth.register(newUser.email, newUser.password, newUser.locale, newUser.provider)
    const decoded = Token.decode(token)
    id = decoded!['_id']

    expect((await Users.getAll()).data.length).toEqual(1)
  })

  test("Should login a user", async () => {
    await Auth.login(newUser.email, newUser.password)
  })

  test("Should throw password error", () => {
    return expect(Auth.login(newUser.email, "test")).rejects.toEqual({
      "error": "Password doesn't match",
      "status": 403,
    });
  })

  test("Should throw a user banned", async () => {
    await Users.blockUser(id, true)

    return expect(Auth.login(newUser.email, newUser.password)).rejects.toEqual({
      error: "You are blocked from the services",
      status: 403
    })
  })

  test("Should throw a email doesn't exist", async () => {
    return expect(Auth.login("test", newUser.password)).rejects.toEqual(
      {
        error: "The requested email isn't associated to an account",
        status: 404
      }
    )
  })

  test("Should throw email already in use", async () => {
    return expect(Auth.register(newUser.email, newUser.password, newUser.locale, newUser.provider)).rejects.toEqual(
      {
        error: "This email is already in use",
        status: 400
      }
    )
  })
})