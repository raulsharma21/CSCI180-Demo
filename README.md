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
### Function Level Authorization Demo

This demo showcases how improper function-level authorization can lead to security vulnerabilities by allowing unauthorized users to perform sensitive actions. The example involves an application with the following endpoints:  

1. **`POST /updateUsers`**  
   - Allows updating or creating user profiles.  
2. **`DELETE /updateUsers`**  
   - Deletes a user profile.  
3. **`GET /getUsers`**  
   - Retrieves a list of all usernames.  

### Steps to Demonstrate the Vulnerability  

1. **Observing Normal Behavior**  
   - Log in to the application using valid credentials as a regular user.  
   - Navigate through the application and observe network activity using the browser’s developer tools (Network tab).  
   - Note that as a regular user, the following functionalities are allowed:  
     - Update their own profile using `POST /updateUsers`.  
     - View a list of usernames using `GET /getUsers`.  

2. **Identifying the Vulnerable Endpoint**  
   - The `POST /updateUsers` endpoint is used to update or create user profiles. However, by manipulating the HTTP method, an attacker can send unauthorized requests.  
   - Using a tool like Postman or by modifying the request in the browser’s developer tools, change the request method to `DELETE`.  
   - Example malicious request:  
     ```json
     DELETE /updateUsers  
     {  
       "username": "admin"  
     }  
     ```  

3. **Exploitation**  
   - Send the modified `DELETE` request with another user's username in the body (e.g., `"admin"`).  
   - Observe that the account gets deleted despite the logged-in user not having permissions to perform this action.  


### Object Level Authorization Demo

This demo simulates a delivery tracking feature for an ecommerce website. We assume that, after a purchase, users are given links to info about their delivery found at URL's like `/api/auth/orders/{orderID}` in an email. We can also assume that there is a feature for users to mark packages as complete manually, also in the email. These links follow the format `/api/auth/orders/{orderID}/complete` which automatically mark the delivery as complete when visited.

Because this endpoint references objects with ID's that are incremental and is public, an attacker can easily find and maliciously mark deliveries as complete at any time for other users. This can disrupt delivery tracking or fraudulently close orders. This is an example of a broken object level authorization vulnerability where private resources are not made private.

To simulate this exploit, we will visit `/api/auth/orders/4` and notice it has an alert. We assume that this means there is some error with the delivery the user should be aware of. However, as an attacker we can visit `/api/auth/orders/4/complete` and go back to `/api/auth/orders/4` to now notice it is complete without any warnings.


### Object-Property Level Authorization Demo

This demo is found when opening the `store.html` in a browser and simulates an ecommerce listings page. We notice that verified items are given priority because they are listed first. The "verified" status is meant to be set only by the platform after manual verification.

When submitting an API request to make a listing, the app does not properly validate this "verified" field. As a result, an attacker can falsely mark their  product as “verified,” misleading customers into trusting the listing.

To simulate an exploit, we first determine which API endpoint is being called. We inspect the page and navigate the the "Network" tab. We then submit a normal listing named `test1` with price `123` and see that the page is reloaded with this new item which is not verified. Along with this, we notice in the "Network" tab that two fetch requests were made to `store`. We notice one is a POST request to `/api/auth/store` with payload `{name: "test1", price: 123}`. We can exploit a broken object-property level authorization by adding the field `verified: true`, but how do we do this?

The simplest way is to submit this request through postman. We now submit to the endpoint `/api/auth/store` a POST request with the payload `{name: "test2", price: 456, verified: true}`. When we reload the store page we now notice the new verified listing we created.

Another way we can do this is to overwrite the `fetchItems()` in the HTML source code which is supposed to populate the page. We determine this function exists by viewing the HTML code in the "Sources" tab. We then navigate to the "Console" tab and type the following.

```js
function fetchItems() {
    fetch('http://localhost:3000/api/auth/store', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'test3',
            price: 789,
            verified: true
        })
    })
}
```
Now if we create an arbitrary listing, we notice the page doesn't load with the new listing. We simply reload the page and now notice both the arbitrary listing we submitted was created as well as the `test3` listing as verified was created.
