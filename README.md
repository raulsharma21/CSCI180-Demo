### Introduction
Demonstrating three different levels of API vulnerabilities.


### Seting Up the API

1. Clone this repository or download it as a zip and unzip it.
2. In the root directory, run `npm install`. If you don't have `node.js` installed, you will need to install it.
2. Once the packages are installed, run the API with `npm start` in the terminal while still in the root directory.
3. To make a request, run a postman HTTP request.

### Running Postman
1. After running `npm start`, the script should be hosted locally at `localhost:3000`.
2. Create a new Postman workspace.
3. Then create a new HTTP request in the workspace.
4. Add the URL `http://localhost:3000/api/auth/test` where it says “Enter URL or paste text” next to the method selector.
5. Change the method to the `GET` method for this endpoint (but `GET` should be the default).
6. Clicking send will result in a successful request.

Thee response should look like this:

```JSON
{
    "message": "This is a test route",
    "your_headers": {
        "user-agent": "PostmanRuntime/7.43.0",
        "accept": "*/*",
        "cache-control": "no-cache",
        "postman-token": "8c3ec47e-4712-438c-adff-83c9ae219ca5",
        "host": "localhost:3000",
        "accept-encoding": "gzip, deflate, br",
        "connection": "keep-alive"
    },
    "your_body": {}
}
```

_Clicking send might result in a “Cloud agent error: cannot send request” with additional info saying “When testing an API locally, you need to use the Postman Desktop Agent. You currently have a different Agent selected, which can’t send requests to the Localhost.” In this case, you need to download the agent with the button below the prompt and it will automatically execute. Nothing will change on the screen but now Postman can run this request to the localhost._

To run with a request body, go into the "Body" tab, then select "raw" and "JSON" in the dropdown menu. Sending the request with body filled out will be read by the API and returned in the `your_body` field. You can copy in the following test body to request the test API endpoint:

```JSON
{
    "my_test1": "test123",
    "my_test2": "123test"
}
```

The response should look like this:

```JSON
{
    "message": "This is a test route",
    "your_headers": {
        "content-type": "application/json",
        "user-agent": "PostmanRuntime/7.43.0",
        "accept": "*/*",
        "cache-control": "no-cache",
        "postman-token": "1bad185c-6cdd-45d3-a03b-abdfacdb3405",
        "host": "localhost:3000",
        "accept-encoding": "gzip, deflate, br",
        "connection": "keep-alive",
        "content-length": "59"
    },
    "your_body": {
        "my_test1": "test123",
        "my_test2": "123test"
    }
}
```