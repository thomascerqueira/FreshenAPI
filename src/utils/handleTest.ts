import { db } from "~/utils/mongo";
import { config } from '~/config';

export async function resetMongo() {
  try {
    await db.dropCollection(config.db_users)
  } catch (e) {
  }

  try {
    await db.dropCollection(config.db_users)
  } catch (e) {
  }

  try {
    await db.dropCollection(config.db_users_deleted)
  } catch (e) {
  }

  try {
    await db.dropCollection(config.db_post)
  } catch (e) {
  }

  try {
    await db.dropCollection(config.db_post_deleted)
  } catch (error) {
  }

  try {
    await db.dropCollection(config.db_comment)
  } catch (error) {
  }

  try {
    await db.dropCollection(config.db_friperie_users)
  } catch (error) {

  }
  try {
    await db.dropCollection(config.db_info_articles)
  } catch (error) {

  } 
  try {
    await db.dropCollection(config.db_types_article)
  } catch (error) {

  } 
  try {
    await db.dropCollection(config.db_articles)
  } catch (error) {

  } 
  try {
    await db.dropCollection(config.db_suggestion)
  } catch (error) {

  }
}