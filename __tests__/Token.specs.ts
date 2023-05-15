import {Token} from "../src/utils/token";
import jwt from "jsonwebtoken";

describe("Token", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test("It should create a Token and recover the same entry", () => {
    const test = "je suis un test"
    const input = {
      test: test
    }

    const token = Token.create(input)

    expect(Token.decode(token)!['test']).toEqual(test)
  })

  test("It should create a Token and succes verified it", () => {
    const test = "je suis un test"
    const input = {
      test: test
    }

    const token = process.env.TOKEN_TYPE + " " + Token.create(input)

    expect(Token.verify(token))
  })

  test("It should failed with wrong key", () => {
    const test = "je suis un mauvais test"
    const key = "Wrong Key"
    const input = {
      test: test
    }

    try {
      jwt.sign(input, key)
    } catch (error) {
      expect(error).toThrow("JsonWebTokenError: invalid signature")
    }

  })
})