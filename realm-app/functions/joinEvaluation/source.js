exports = async function (eventId, token) {
  // Get the collection of events
  const eventsCollection = context.services
    .get("mongodb-atlas")
    .db("rationalize-db")
    .collection("Evaluations");
  // Add this user to the list of participants
  const { matchedCount } = await eventsCollection.updateOne(
    {
      _id: { $eq: BSON.ObjectId(eventId) },
      "scoring.survey": true,
      "scoring.token": { $eq: token },
    },
    { $addToSet: { participants: context.user.id } }
  );
  return { success: matchedCount === 1 };
};
