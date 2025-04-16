# watsonx.ai AI Service UI app

This app demonstrates how a deployed agent as a AI Service REST API can be consumed in a chat app. In order to get it to run,
you first need to follow documentation for creating an agent and then deploy it as an AI Service
in watsonx.ai.

The sample UI app is based on Next.js, as well as IBM Carbon React design system for UI components and resources. Upon
starting it, it will make an API call to the deployed API service to fetch UI artifact it will use to render the
initial screen. When user selects or types a question, deployed AI Service streaming endpoint will be used.
The intermediate results of executing the endpoint (tool call starts, tool call results, final answer streaming)
will all be render in the app. Once the final answer is streamed, the thought process of an agent will be
available for analysis.

Once you have the running REST API URL for the AI Service, you need a working API key for a user that is
a member of a deployment space where the agent has been deployed. You will also need deployment id as well
as the base URL of that deployment.

Before building, set the following variables in the `./.env` file ([docs](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#loading-environment-variables)):

```sh
SPACE_ID=VALUE
API_KEY=VALUE
BASE_DEPLOYMENT_URL=ABSOLUTE_URL_FOR_THE_AI_SERVICE_DEPLOYMENT
```

Note that the value of the **BASE_DEPLOYMENT_URL** needs to end with the deployment guid as we will be
crafting multiple URLs based on that base. Example of **BASE_DEPLOYMENT_URL**:
`https://us-south.ml.cloud.ibm.com/ml/v4/deployments/{deployment_id}`

## Building and running

To install all the modules, first run:

```bash
npm install
```

Start the app in dev mode if you want to iteratively work on it:

```bash
npm run dev
```

After the installation, run the build:

```bash
npm run build
```

Alternatively, if you just want to cleanly run the service, use:

```bash
npm run start
```

Then navigate to http://localhost:3000 in your browser.
