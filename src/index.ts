import app from "./app";
import sequelize from "./config/database";
import { defineAssociations } from "./infrastructure/db/models/Associations";
import { seedSuperadmin } from "./infrastructure/seeders/superadminSeeders";

const PORT = process.env.PORT || 3000;

defineAssociations();

if (process.env.SEED_SUPERADMIN === "true" && process.env.NODE_ENV !== "test") {
  seedSuperadmin()
    .then(() => {
      console.log("Superadmin seeded successfully");
    })
    .catch((error) => {
      console.error("Error seeding superadmin:", error);
    });
} else {
  console.log("Superadmin seeding skipped");
}

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
