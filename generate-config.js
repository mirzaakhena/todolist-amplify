import fs from "fs/promises";
import dotenv from "dotenv";

async function generateConfig() {
  try {
    dotenv.config();
    const template = await fs.readFile("src/amplifyconfiguration.template.json", "utf8");
    const config = template.replace("${APPSYNC_GRAPHQL_ENDPOINT}", process.env.APPSYNC_GRAPHQL_ENDPOINT).replace("${APPSYNC_API_KEY}", process.env.APPSYNC_API_KEY);

    await fs.writeFile("src/amplifyconfiguration.json", config);
    console.log("Amplify configuration generated successfully.", JSON.stringify(JSON.parse(config), null, 2));
  } catch (error) {
    console.error("Error generating Amplify configuration:", error);
    process.exit(1);
  }
}

generateConfig();
