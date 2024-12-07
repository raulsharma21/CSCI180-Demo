const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ 
    message: "This is a test route", 
    your_headers: req.headers,
    your_body: req.body
  });
});

// ************************
//   FUNCTION LEVEL DEMO
// ************************

// Mock user data
const users = [
  { id: 1, username: 'admin', password: 'adminpass', role: 'admin' },
  { id: 2, username: 'user1', password: 'userpass', role: 'user', email: 'user1@example.com' },
  { id: 3, username: 'user2', password: 'userpass', role: 'user', email: 'user2@example.com' }
];

// POST /updateUsers - Updates user profile
router.post('/updateUsers', (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  let user = users.find(u => u.username === username);

  if (user) {
    // If user exists, update the password
    user.password = password;
    res.status(200).send({
      message: 'User profile updated successfully',
      updatedUser: user
    });
    console.log(`User with username ${username} updated their password to ${password}`);
  } else {
    // If user does not exist, create a new user
    user = { username, password }; // Adjust the properties as needed
    users.push(user); // Add the new user to the users array

    res.status(201).send({
      message: 'User created successfully',
      newUser: user
    });
    console.log(`New user with username ${username} created with password ${password}`);
  }
});

// DELETE /updateUsers - Exploited endpoint (no authorization checks)
router.delete('/updateUsers', (req, res) => {
  const { username } = req.body;

  // Find and delete the user
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return res.status(404).send('User not found');

  const deletedUser = users.splice(userIndex, 1);
  res.status(200).send({
    message: 'User deleted successfully',
    deletedUser
  });

  console.log(`User with ID ${id} was deleted!`);
});


// Route to get a list of usernames
router.get('/getUsers', (req, res) => {
  const usernames = users.map(user => user.username); // Extract usernames
  res.json(usernames); // Send the usernames as a JSON response
});


// ******************************
//   OBJECT LEVEL DEMO
// ******************************
const day = 86400000
const date = new Date();


id = 1
const orders = [
  { id: id++, name: "Water Bottle", expected: date.getTime() + day * 2, progress: 'In Transit', complete: false },
  { id: id++, name: "Wireless Mouse", expected: date.getTime() + day * 5, progress: 'Delayed', complete: false },
  { id: id++, name: "Dumbbells (8 pack)", expected: date.getTime() - day, progress: 'Delivered', complete: true },
  { id: id++, name: "CATAN Board Game", expected: date.getTime() + day * 4, progress: 'Alert (check account)', complete: false }
]

// Get order route
router.get('/orders/:orderId', (req, res) => {
  const orderId = req.params.orderId;

  // Find the order
  const order = orders.find(o => o.id == orderId);
  if (!order) return res.status(404).send('Order not found');

  // Return order
  res.status(200).send(`
    <body style="display: flex; justify-content: center; margin: auto; font-family: arial">
      <div style="margin-top: 300px; width: 350px; height: 200px; padding: 15px; border: solid black 1px; border-radius: 8px">
        <h2>${order.name}</h2>
        <hr />
        <h3>Expected: ${new Date(order.expected).toDateString()}</h3>
        ${order.complete ? '' : `<h3>Progress: <span style="${order.progress == 'Alert (check account)' ? 'color: red' : ''}">${order.progress}</span></h3>`}
        <h3>Complete: <span style="${order.complete ? 'color: green' : ''}">${order.complete ? 'Complete' : 'Incomplete'}</span></h3>   
      </div>
    </body>
  `);
});


// Complete order route
router.get('/orders/:orderId/complete', (req, res) => {
  const orderId = req.params.orderId;

  // Find the order
  const order = orders.find(o => o.id == orderId);
  if (!order) return res.status(404).send('Order not found');

  // Complete order
  order.complete = true;
  res.status(200).send(`<h2 style="font-family: arial">Order complete</h2>`);
  console.log(`API: Order ${order.id} completed`)
});



// ******************************
//   OBJECT-PROPERTY LEVEL DEMO
// ******************************

// Mock store data
id = 1
const items = [
  { id: id++, name: 'Wireless Earbuds', price: 49.99, date: date.getTime() - day * 15, verified: true },
  { id: id++, name: 'Water Bottle', price: 27.50, date: date.getTime() - day * 5 },
  { id: id++, name: 'Yoga Mat', price: 35.00, date: date.getTime() - day * 42 },
  { id: id++, name: 'Desk Lamp', price: 15.00, date: date.getTime() - day * 20 },
  { id: id++, name: 'Wireless Mouse', price: 45.00, date: date.getTime() - day * 21, verified: true },
  { id: id++, name: 'CATAN Board Game', price: 25.00, date: date.getTime() - day * 33 }
]

// Sort items by first "verified" then second "date"
function sortItems() {
  items.sort((item1, item2) => {
    if ((item1.verified || false) != (item2.verified || false)) return (item2.verified || false) - (item1.verified || false);
    return item2.date - item1.date;
  });
}

// Get items from store route
router.get('/store', (req, res) => {
  const query = req.query;
  // Return explicit item if given id
  if (query.id) {
    const item = items.find(i => i.id == query.id);
    if (!item) return res.status(400).send({ message: "No item with this id" });
    return res.status(200).send({ items: [item] });
  }
  // Return items in sorted order by first "verified" then second "date"
  sortItems()
  res.status(200).send({ items: items });
});

// Add item listing to store route
router.post('/store', (req, res) => {
  const body = req.body;

  // Check if valid listing info is sent
  if (!body.name || !body.price) return res.status(400).send({ message: 'Listing requires item name and price' });

  // Create item 
  const new_item = { id: id++, name: body.name, price: body.price, date: new Date().getTime() };

  // Check if item should be verified
  if (body.verified) {
    new_item.verified = true;
  }

  items.push(new_item)
  res.status(201).send({ message: "Item listed." });
  console.log(`API: Item listed "${body.name}"`)
});

module.exports = router;