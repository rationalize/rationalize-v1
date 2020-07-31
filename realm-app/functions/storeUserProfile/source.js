exports = async function (authEvent) {
  const user = authEvent.user;
  const collection = context.services
    .get("mongodb-atlas")
    .db("rationalize-db")
    .collection("UserProfiles");
  const { insertedId } = await collection.insertOne({
    userId: user.id,
    firstName: user.data.first_name,
    lastName: user.data.last_name,
  });
};
