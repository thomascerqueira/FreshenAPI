import {resetMongo} from "../src/utils/handleTest";
import {Auth} from "../src/services/authService";
import {Users} from "../src/services/userService";
import {closeDb, getCollection, run, toObjectId} from "../src/utils/mongo";
import {Token} from "../src/utils/token";
import {config} from '~/config';
import { faker } from '@faker-js/faker';
import { User } from "../src/types/user";

describe("User", () => {
  const email = "q@gmail.com"
  let id = ""
  const fakeId = faker.database.mongodbObjectId()

  beforeAll(async () => {
    await run();
    await resetMongo()
    const token = await Auth.register(email, "123456789a!", "FR_fr", "email", "terry")
    const decoded = Token.decode(token)
    id = decoded!['_id']
  })

  afterAll(async () => {
    await closeDb()
  })

  test("Should get all users", async () => {
    expect((await Users.getAll()).data.length).toEqual(1)
  })

  test("Should get one user", async () => {
    const user: User = await Users.getOne(id) as User;
    expect(user.email).toEqual(email)
  })

  test("Should update one user", async () => {
    await Users.updateOne(id, {"provider": "gmail"})
    const user: User = await Users.getOne(id) as User;
    expect(user.provider).toEqual("gmail")
  })

  test("Should block a user", async () => {
    const result = await Users.blockUser(id, true)
    const user: User = await Users.getOne(id) as User;
    expect(user.banned).toEqual(true)
    expect(result).toEqual("User terry as been blocked")
  })

  test("Should unblock a user", async () => {
    const result = await Users.blockUser(id, false)
    const user: User = await Users.getOne(id) as User;

    expect(user.banned).toEqual(false)
    expect(result).toEqual("User terry as been unblocked")
  })

  test("Should delete a user", async () => {
    await Users.delete(id)
    const _id = toObjectId(id)
    const user = await getCollection(config.db_users_deleted).findOne({_id})
    expect(user!['email']).toEqual(email)
    expect((await Users.getAll()).data.length).toEqual(0)
  })

  test("Should throw user not found on delete", () => {
    return expect(Users.delete(fakeId)).rejects.toEqual(
      {
        error: "User not found",
        status: 404
      }
    )
  })

  test("Should throw user not found on block", () => {
    return expect(Users.blockUser(fakeId, false)).rejects.toEqual(
      {
        error: "User not found",
        status: 404
      }
    )
  })
})