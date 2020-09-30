# Migration from the Flash Cards template to Actions Builder

This project contains the source code for the conversion from the [Flash Cards](https://developers.google.com/assistant/templates/flash-cards) template to the [Actions Builder](https://developers.google.com/assistant/conversational/build) platform.

## Directory structure

The following table describes the file structure for this project:

| Directory | Description                            |
| --------- | -------------------------------------- |
| converter | Sheets and locales conversion tool     |
| functions | Fulfillment webhook source code        |
| sdk       | Action SDK resource files              |

## Step 1: Prerequisites

Before you begin the migration, perform the following steps:

1. Install Node.js and NPM.
   - We recommend that you install them with [Node Version Manager (nvm) for Linux and Mac](https://github.com/nvm-sh/nvm) or [nvm for Windows](https://github.com/coreybutler/nvm-windows).
   - The webhook runtime requires Node.js version 10 or later.

2. Install the [Firebase CLI](https://developers.google.com/assistant/conversational/df-asdk/deploy-fulfillment).
   - We recommend that you install it with MAJOR version 8. To do so, run the following command: `npm install -g firebase-tools@^8.0.0`.
   - Run `firebase login` with your Google account.

3. Install the [Actions CLI](https://developers.google.com/assistant/actionssdk/gactions).
   - Extract the package to a location of your choice and add the binary to your environment's PATH variable. Alternatively, extract the package to a location that's already in your PATH variable, such as `/usr/local/bin`.
   - Run `gactions login` with your Google account.

4. Go to [Google Sheet Node.js Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs).
   - From Step 1 on that page, click **Enable the Google Sheets API**.
   - Pick a project name or use the default *Quickstart* name, then click **Next**. Note that this project isn't the same as a new Actions on Google project that's needed for migration.
   - Under **Configure your Oauth client**, select **Desktop app**.
   - Click **Create**.
   - Click **Download client configuration** to download `credentials.json`. Save the JSON file in the `converter/` directory.

## Step 2: Setup

### Create a new project in Actions Console

From the [Actions on Google Console](https://console.actions.google.com/), select **New project&nbsp;> Create project** and then select **What kind of Action do you want to build?&nbsp;> Game&nbsp;> Blank project**.

After the new project has been created, you should see the Actions Builder console. To find your Project ID, navigate to **More ⋮&nbsp;> Project settings&nbsp;> Project ID**.

> Be careful not to mix the Project ID with the Project Name.

### Upgrade Firebase pricing plan

From the [Firebase Console](https://console.firebase.google.com/), select the same newly created project from Actions Console and upgrade its pricing plan to **Blaze (pay as you go)**.

> A Blaze plan is required for the Cloud Functions with Node.js version 10 runtime.

## Step 3: Migration

### Sample sheets to create a new action

To create a brand-new Flash Cards action, make a copy of the Flash Cards sample sheet in your preferred locale from the following list. Update the sheet with your own data. Alternatively, you can use your existing Flash Cards data sheet.

- [de](https://docs.google.com/spreadsheets/d/1by8LNn7fyHZS--25BV4ijEHdIrnl898gF5-uiCpEEq0/copy)
- [en](https://docs.google.com/spreadsheets/d/15WaN5Ba2bpcH02iZ8PgwISv4qfoXqolJvTx6TGobKKY/copy)
- [en-AU](https://docs.google.com/spreadsheets/d/15WaN5Ba2bpcH02iZ8PgwISv4qfoXqolJvTx6TGobKKY/copy)
- [en-CA](https://docs.google.com/spreadsheets/d/15WaN5Ba2bpcH02iZ8PgwISv4qfoXqolJvTx6TGobKKY/copy)
- [en-GB](https://docs.google.com/spreadsheets/d/1Wf2seYwniqEuvQeE0QkQkA-UUr1n2ZaOmf5dJHYOSaw/copy)
- [en-IN](https://docs.google.com/spreadsheets/d/15WaN5Ba2bpcH02iZ8PgwISv4qfoXqolJvTx6TGobKKY/copy)
- [en-US](https://docs.google.com/spreadsheets/d/15WaN5Ba2bpcH02iZ8PgwISv4qfoXqolJvTx6TGobKKY/copy)
- [es](https://docs.google.com/spreadsheets/d/1ZAXLpCPwKxeNWmmrL2FREDMy_ZRm58E5x-Q2XOYqKq8/copy)
- [es-419](https://docs.google.com/spreadsheets/d/1BZkj1YEsyTLUFQD99SzUO99EmxoHNk00K_8Or_xjbeg/copy)
- [es-ES](https://docs.google.com/spreadsheets/d/1uo0uqJTR-dfmqkE31vUtJJw1pq3EzSE4KVacSoxXI14/copy)
- [fr](https://docs.google.com/spreadsheets/d/1_dE59nHxwnowHlzEw92ThxC1Fqp6hA6iAyHgkM9cXz4/copy)
- [fr-CA](https://docs.google.com/spreadsheets/d/1iTkhh0Zr1kM2w0yCN-rcJWwvX2RPjh_wFyL27FLibXU/copy)
- [fr-FR](https://docs.google.com/spreadsheets/d/1wckNI7olWBK1MrdMoNcHey8a7QhHevkQMqoYtTT9dBA/copy)
- [hi](https://docs.google.com/spreadsheets/d/10UJVAGV74QrH3FCRODDs6h7sxoxedwZbW2xr5odrTbg/copy)
- [id](https://docs.google.com/spreadsheets/d/1U_H7TUs6t03ds5eY9msTTnIRHGLIv_xeqz7gvXbN_V0/copy)
- [it](https://docs.google.com/spreadsheets/d/1J6yyG1AyiEkFX6BKbUOX4AChHkUwMXy8Ib4vOroGdTc/copy)
- [ja](https://docs.google.com/spreadsheets/d/1bI8HPbUk7p8we13qpgABCTQ0LUKYamnQuTxeQaHpj7I/copy)
- [ko](https://docs.google.com/spreadsheets/d/1uoDpL26jSBW4t7uQfR_2tI3ZocfXvvxVOYWEtsaAxrM/copy)
- [pt-BR](https://docs.google.com/spreadsheets/d/1tE1mYYPcBUCaZ8S6NnNsaBGIJZx-3oKfIHZIzb1L63M/copy)
- [ru](https://docs.google.com/spreadsheets/d/1em5F9Gtwj9xjJ7S28oEfZe_bDb7_R8_d5TxodiuxhNM/copy)
- [th](https://docs.google.com/spreadsheets/d/1tv3LVxutq6U9GvOxjSWhND8Gj03KhhjG2lUG85NJ-R4/copy)

### Update the Flash Cards sheet ID

Open `converter/config.js` and update the `LOCALE_TO_SHEET_ID` mapping with your own Flash Cards data sheet ID for the specific locale you want to convert.

- The Sheet ID can be located in the sheet URL: `https://docs.google.com/spreadsheets/d/`**`<SHEET_ID>`**`/edit#gid=0`.
- Uncomment the specific locales you want to convert.
- The sheet IDs provided in `converter/config.js` are the default sample sheets for each locale. To create a brand new Flash Cards action, make a copy of the sample sheet and update it with your own data.
- Make sure the data sheet is owned by the same Google account that's performing the migration.

After you've updated the sheet ID, you have two options for how to proceed with the migration.

### (Option 1) Migration script

To automatically run all the migration steps, run `./build.sh <PROJECT_ID>` from the root directory of this project.

- On the initial run, the script asks you to grant read access to your sheets. To do so, you must visit the provided URL and copy the authorization code back after you accept read access. If you see a warning page that states "This app isn't verified", click **Advanced** to show the drop down text. Then, click **Go to Quickstart (unsafe)** to continue the authorization process.
- Alternatively, you can follow the [manual migration steps](#option-2-manual-migration-steps) to perform the migration.

### (Option 2) Manual migration steps

To manually migrate your project, perform the steps given in the following three sections.

#### Run the sheet and locale conversion script

1. Navigate to the `converter/` directory. To do so, run `cd converter` from the root directory of this project.
2. Run `npm install`.
3. Run `npm run convert -- --project_id <PROJECT_ID>`.
   - On the initial run, the script asks you to grant read access to your sheets. To do so, you must visit the provided URL and copy the authorization code back after you accept read access. If you see a warning page that states "This app isn't verified", click **Advanced** to show the drop down text. Then, click **Go to Quickstart (unsafe)** to continue the authorization process.
   - After the conversion script finishes, the parsed sheet data is added to the `functions/data/` directory, while locale-specific data is added to the `sdk/` directory.

#### Deploy the webhook to Cloud Functions for Firebase

1. Navigate to the `functions/` directory. To do so, run `cd functions` from the root directory of this project.
2. Run `npm install`.
3. To deploy the v1 webhook, run `firebase deploy --project <PROJECT_ID> --only functions:flashcards_v1`.
   - After you release a version of the action, you can update your webhook and test your changes without affecting your production action. To do so, we recommend that you update the `FUNCTION_VERSION` in `functions/config.js` to deploy a new webhook URL, such as `flashcards_v2`.

#### Use Actions CLI to push and preview your project

1. Navigate to the `sdk/` directory. To do so, run `cd sdk` from the root directory of this project.
2. To login to your Google account, run `gactions login`.
3. To push your project, run `gactions push`.
   - To fix the validation warnings, update the missing Directory information in the **Deploy** section of the Actions Console.
   - If you need to sync the changes made in the Actions Builder Console with your local `sdk/` directory, you can run `gactions pull`.
4. To deploy your project to the preview environment, run `gactions deploy preview`.

## Step 4: Test the converted action

You can test your Action on any Google Assistant-enabled device that's signed into the same account that was used to create this project. You can also use the Actions on Google Console [simulator](https://developers.google.com/assistant/console/simulator) to test most features and preview on-device behavior.

## References and issues

- Questions? Go to [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google) or the [Assistant Developer Community on Reddit](https://www.reddit.com/r/GoogleAssistantDev/).
- If you find any bugs, report them through GitHub.
- To learn more about Actions on Google, read our [documentation](https://developers.google.com/assistant).
- To get guided, hands-on practice with Actions on Google, try some of our [Codelabs](https://codelabs.developers.google.com/?cat=Assistant).

## Contribute

To contribute to this project, follow the steps on the [CONTRIBUTING.md](CONTRIBUTING.md) page.

## License

For more information on our license, read the [LICENSE](LICENSE).
