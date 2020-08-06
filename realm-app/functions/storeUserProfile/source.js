exports = async function (authEvent) {
  const user = authEvent.user;
  const collection = context.services
    .get("mongodb-atlas")
    .db(context.values.get("defaultDatabase"))
    .collection("UserProfiles");
  await collection.insertOne({
    userId: user.id,
    firstName: user.data.first_name,
    lastName: user.data.last_name,
  });
};
