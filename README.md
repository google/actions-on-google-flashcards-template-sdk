# Migration from the Flash Cards template to the Actions Builder

This step-by-step guide describes the project and its source code for the conversion from the [Flash Cards](https://developers.google.com/assistant/templates/flash-cards) template to the [Actions Builder](https://developers.google.com/assistant/conversational/build) platform.

## Directory structure

The following table describes the file structure for this project:

- `converter`: Sheets and locales conversion tool
- `functions`: Fulfillment webhook source code
- `sdk`: Action SDK resource files

## Step 1: Prerequisites

Before you begin the migration, perform the following steps:

1. Install [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/get-npm) as follows:
   - Install them with [Node Version Manager (nvm) for Linux and Mac](https://github.com/nvm-sh/nvm) or [nvm for Windows](https://github.com/coreybutler/nvm-windows).
   - The webhook runtime requires Node.js version 10 or higher.

2. Install the [Firebase CLI](https://developers.google.com/assistant/conversational/df-asdk/deploy-fulfillment) as follows:
   1. Install it with MAJOR version 8. To do so, run the following command: `npm install -g firebase-tools@^8.0.0`.
   2. Run `firebase login` with your Google Account.

3. Install the [Actions CLI](https://developers.google.com/assistant/actionssdk/gactions) as follows:
   1. Extract the package to your chosen location and add the binary to your environment‘s PATH variable. Alternatively, extract the package to a location already in your PATH variable, such as `/usr/local/bin`.
   2. Run `gactions login` with your Google Account.

4. Go to [Google Sheet Node.js Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs) as follows:
   1. From that page, go to [Step 1](https://developers.google.com/sheets/api/quickstart/nodejs#step_1_turn_on_the), and click **Enable the Google Sheets API**.
   2. Enter a project name or select the default name, "Quickstart", and click **Next**.  
      > **Note:** This project isn‘t the same as a new "Actions on Google" project needed for migration.
   3. For **Configure your Oauth client**, select **Desktop app**.
   4. Click **Create**.
   5. To download `credentials.json`, click **Download client configuration**.
   6. Save the JSON file in the `converter/` directory.

## Step 2: Setup

Create a new project in Actions Console and upgrade the Firebase price plan as described here.

### Create a new project in Actions Console

Perform the following steps:

1. Go to [Actions on Google Console](https://console.actions.google.com/).
2. Select **New project&nbsp;> Create project**.
3. Select **What kind of Action do you want to build?&nbsp;> Game&nbsp;> Blank project**.

To find your Project ID, go to Actions on Google Console for your project, and go to **More ⋮&nbsp;> Project settings&nbsp;> Project ID**.

> **Note:** Don't confuse the Project ID with the Project Name.

### Upgrade the Firebase price plan

From the [Firebase Console](https://console.firebase.google.com/), select the same newly created project from Actions Console and upgrade its price plan to **Blaze (pay as you go)**.

> **Caution:** A Blaze plan is required for Cloud Functions for Node.js version 10 runtime.

## Step 3: Migration

Perform the steps described here.

### Sample sheets to create a new action

To create a new Flash Cards action, make a copy of the Flash Cards sample sheet in your preferred locale-specific language. Update the sheet with your data. Alternatively, you can use your current Flash Cards data sheet. Refer to the following links to the Flash Cards sample sheets, in your preferred locale-specific language:

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

Open `converter/config.js` and update the `LOCALE_TO_SHEET_ID` mapping with your own Flash Cards data sheet ID for the specific locale you need to convert, as follows:

1. Determine the Sheet ID, which is hard-coded as part of the sheet URL:  
   `https://docs.google.com/spreadsheets/d/`**`<SHEET_ID>`**`/edit#gid=0`.
2. Uncomment the specific locales you need to convert and update the sheet ID.
3. The sheet IDs provided in `converter/config.js` are the default sample sheets for each locale. To create a new Flash Cards action, make a copy of the sample sheet and update it with your own data.
4. Verify that the data sheet is owned by the same Google Account that performs the migration.

After you've updated the sheet ID, you have two options for how to proceed with the migration.

### Automatic migration script: Option 1

To automatically run all the migration steps, go to the root directory of the project, and run the following command: `./build.sh <PROJECT_ID>`. Be aware of the following guidance:

- When the script is run for the first time, it asks you to grant read access to your sheets. To do so, go to the URL it provides, grant read access, and copy the authorization code and enter it when prompted by the script.  
If you're taken to a warning page that says, "This app isn't verified," click **Advanced**. From the dropdown text that appears, click **Go to Quickstart (unsafe)** and continue the authorization process.
- If you encounter an issue, you can, instead, perform a [manual migration](#manual-migration-option-2).

### Manual migration: Option 2

To manually migrate the project, perform the steps described here:

1. [Run the sheet and locale conversion script](#run-the-sheet-and-locale-conversion-script).
2. [Deploy the webhook to Cloud Functions for Firebase](#deploy-the-webhook-to-cloud-functions-for-firebase).
3. [Use Actions CLI to push and preview your project](#use-actions-cli-to-push-and-preview-your-project).

#### Run the sheet and locale conversion script

Perform the following steps:

1. Go to the `converter/` directory. To do so, go to the root directory of the project and run `cd converter`.
2. Run `npm install`.
3. Run `npm run convert -- --project_id <PROJECT_ID>`. Be aware of the following guidance:
   - When the script is run for the first time, it asks you to grant read access to your sheets. To do so, go to the URL it provides, grant read access, and copy the authorization code and enter it when prompted by the script.  
   If you're taken to a warning page that says, "This app isn't verified," click **Advanced**. From the dropdown text that appears, click **Go to Quickstart (unsafe)** and continue the authorization process.
   - After the conversion script completes, the parsed sheet data is added to the `functions/data/` directory, and the locale-specific data is added to the `sdk/` directory.

#### Deploy the webhook to Cloud Functions for Firebase

Perform the following steps:

1. Go to the `functions/` directory. To do so, go to the root directory of the project and run `cd functions`.
2. Run `npm install`.
3. To deploy the "v1" webhook, run `firebase deploy --project <PROJECT_ID> --only functions:flashcards_v1`.
   - After you release a version of the action, you can update your webhook and test your changes without affecting your production action. To do so, we recommend that you update the `FUNCTION_VERSION` value in `functions/config.js`. Then, deploy to a new webhook URL, such as `flashcards_v2`.

#### Use Actions CLI to push and preview your project

Perform the following steps:

1. Go to the `sdk/` directory. To do so, go to the root directory of the project and run `cd sdk`.
2. To login to your Google Account, run `gactions login`.
3. To push your project, run `gactions push`.
   - To fix the validation warnings, go to Actions Console, and from the **Deploy** section, update the missing directory information.
   - If you need to sync the changes made in the Actions Builder Console with your local `sdk/` directory, run `gactions pull`.
4. To deploy the project to the preview environment, run `gactions deploy preview`.

## Step 4: Test the converted action

You can test your action on any Google Assistant-enabled device that's signed into the same account used to create the project. You can also use the [Actions on Google Console's simulator](https://developers.google.com/assistant/console/simulator) to test most features and preview on-device behavior.

## Support and additional resources

If you encounter an issue or need additional information, refer to any of the following:

- If you have a question, the following forums are significantly helpful:
  - [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google)
  - [Reddit's Assistant Developer Community](https://www.reddit.com/r/GoogleAssistantDev/)
- If you find any bugs, report them through [GitHub](https://github.com/google/actions-on-google-flashcards-template-sdk/issues).
- To learn more about Actions on Google, refer to [Google Assistant's developer documentation](https://developers.google.com/assistant).
- For guided, hands-on practice with Actions on Google, try some of the [Codelabs for Google Assistant](https://codelabs.developers.google.com/?cat=Assistant).

## Contribute

To contribute to this project, adhere to the steps described on the [Contributing](CONTRIBUTING.md) page.

## License

For more information on our license, read the [License](LICENSE).
