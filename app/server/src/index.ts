import { ENV } from "./lib/env.js";
import app from "./app.js";

const main = async () => {
  if (ENV.NODE_ENV === "production") {
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
    return;
  }
  app.listen({ port: ENV.PORT, host: ENV.HOST }, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  });
};

main();
