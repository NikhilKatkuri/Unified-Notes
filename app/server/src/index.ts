import app from "./app.js";

import connectToDB from "@/lib/connectToDB.js";
import { ENV } from "@/lib/env.js";

const main = async () => {
  try {
    await connectToDB();
    if (ENV.isProduction) {
      app.listen(ENV.PORT, () => {
        console.log(`Server is running on port ${ENV.PORT}`);
      });
      return;
    }
    app.listen({ port: ENV.PORT, host: ENV.HOST }, () => {
      console.log(
        `Server is running on port ${ENV.PORT}\n`,
        `url : http://localhost:${ENV.PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

main();
