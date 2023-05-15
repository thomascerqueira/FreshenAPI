import {Post} from "../src/services/postService";
import {closeDb, db, getCollection, toObjectId} from "../src/utils/mongo";
import {Auth} from '~/services/authService';
import {run} from "~/utils/mongo"
import {Token} from "../src/utils/token";
import {config} from '~/config';
import {resetMongo} from "../src/utils/handleTest";
import {Users} from "../src/services/userService";
import {faker} from "@faker-js/faker";

describe("Post", () => {
  const email = "q@gmail.com"
  let id = ""
  let idsPost: string[] = []
  const fakeId = faker.database.mongodbObjectId()

  beforeAll(async () => {
    await run()
    await resetMongo()
    const token = await Auth.register(email, "123456789a!", "FR_fr", "email", "terry")
    const decoded = Token.decode(token)
    id = decoded!['_id']
  })

  afterAll(async () => {
    await closeDb()
  })

  test("It should throw error because no user", () => {
    return expect(Post.create("NSM", "62dca4e8ff8f10d9e9f74e3d", [])).rejects.toEqual({"error": "User not found", "status": 404})
  })

  test("Should pass when delete 0 post", async() => {
    await Post.deleteAllPost(id)
  })

  test("Should create two post", async () => {
    idsPost.push((await Post.create("Test1", id, [])).toString())
    idsPost.push((await Post.create("Test2", id, [])).toString())
  })

  test("Should get all post from a user", async () => {
    const posts = await Post.getAll(id)

    expect(posts.length).toEqual(2)
  })

  test("Should get a post from a user", async () => {
    const post = await Post.getPost(id, idsPost[0])

    expect(post.description).toEqual("Test1")
  })

  test("Should delete all post from a user", async () => {
    await Post.deleteAllPost(id)

    expect((await Post.getAll(id)).length).toEqual(0)
    expect((await getCollection(config.db_post_deleted).find({
      "author.id": toObjectId(id)
    }).toArray()).length).toEqual(2)
  })

  test("Should throw error because user not found on get all", () => {
    return expect(Post.getAll(fakeId)).rejects.toEqual(
      {
        error: "User not found",
        status: 404
      }
    )
  })

  test("Should throw error because user not found on get post", () => {
    return expect(Post.getPost(fakeId, "")).rejects.toEqual(
      {
        error: "User not found",
        status: 404
      }
    )
  })

  test("Should throw error because banned", async () => {
    await Users.blockUser(id, true)

    return expect(Post.create("Test", id, [])).rejects.toEqual(
      {
        error: "You are blocked from the services",
        status: 403
      }
    )
  })
})