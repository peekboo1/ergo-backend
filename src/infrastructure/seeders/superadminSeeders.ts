import bcrypt from "bcrypt";
import { SuperadminModel } from "../db/models/SuperadminModel";

export const seedSuperadmin = async () => {
  try {
    await SuperadminModel.sync();

    const existing = await SuperadminModel.findOne({
      where: { email: "nadirasuperadmin@gmail.com" },
    });

    if (!existing) {
      const hashedPassword = await bcrypt.hash("akmalariq12", 10);

      await SuperadminModel.create({
        name: "Nadira Superuser",
        email: "nadirasuperadmin@gmail.com",
        password: hashedPassword,
      });

      console.log("✅ Superadmin seeded!");
    } else {
      console.log("ℹ️ Superadmin already exists.");
    }
  } catch (error) {
    console.error("❌ Error seeding superadmin:", error);
  }
};
