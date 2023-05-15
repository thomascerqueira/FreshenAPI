import {getCollection} from "~/utils/mongo";
import {config} from "~/config";

export async function backPopulateUser() {
  const users = await getCollection(config.db_users).find().toArray()

  users.forEach(user => {
    getCollection(config.db_users).updateOne(user, {
      $set: {
        provider: "email"
      }
    })
  })
}