import { config, User } from "./RealmApp";
import { Evaluation } from "./Evaluations";
import { UserProfile } from "./UserProfiles";

type UserEnhancement = {
  evaluations: Realm.Services.MongoDB.MongoDBCollection<Evaluation>;
  userProfiles: Realm.Services.MongoDB.MongoDBCollection<UserProfile>;
};

export type EnhancedUser = User & UserEnhancement;

const cache = new Map<User, EnhancedUser>();

export function enhanceUser(user: User): EnhancedUser {
  const enhancedUser = cache.get(user);
  if (enhancedUser) {
    return enhancedUser;
  } else {
    // Create the enhancement
    const mongoClient = user.mongoClient("mongodb-atlas");
    const db = mongoClient.db(config.databaseName);
    const enhancement: UserEnhancement = {
      evaluations: db.collection<Evaluation>("Evaluations"),
      userProfiles: db.collection<UserProfile>("UserProfiles"),
    };

    // Create a proxy returning enhance properties if they exists falling back on the regular user properties
    const enhancedUser = new Proxy<EnhancedUser>(user as any, {
      get(target, propertyKey) {
        if (propertyKey in enhancement) {
          return Reflect.get(enhancement, propertyKey);
        } else {
          return Reflect.get(target, propertyKey);
        }
      },
    });

    // Store it to avoid recreating it
    cache.set(user, enhancedUser);
    return enhancedUser;
  }
}
