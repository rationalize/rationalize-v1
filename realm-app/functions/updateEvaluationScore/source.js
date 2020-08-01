exports = async function (eventId, scores) {
  // Get the collection of events
  const eventsCollection = context.services
    .get("mongodb-atlas")
    .db("rationalize-db")
    .collection("Evaluations");
  const { matchedCount } = await eventsCollection.updateOne(
    // Search of an event with this ID and the user as a participant
    {
      _id: { $eq: eventId },
      $or: [
        { facilitator: context.user.id, "scoring.facilitator": true },
        { participants: context.user.id, "scoring.survey": true },
      ],
    },
    // Update the evaluations array for this specific user
    { $set: { [`scores.${context.user.id}`]: scores } }
  );
  return { success: matchedCount === 1 };
};
