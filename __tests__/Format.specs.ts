import {Format} from "../src/utils/format";

describe("Format", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test("It should return a well formated user", () => {
    const user = {
     '_id': 'id',
     'email': "_email@google.com",
     "username": "_username",
      'banned': false,
      'privacy': "public",
      'active': false,
      'locale': "FR_fr",
      'creationDate': "creation",
      'provider': "Google",
      "uselessInfo": "useless",
      "veryUseless": "1+1=1"
    }

    const output = {
      '_id': 'id',
      'email': "_email@google.com",
      "username": "_username",
      'banned': false,
      'privacy': "public",
      'locale': "FR_fr",
      'creationDate': "creation",
    }
    
    expect(Format.userPublicProfile(user)).toEqual(output)
  })
})