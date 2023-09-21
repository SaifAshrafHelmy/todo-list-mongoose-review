# Mongoose Cheatsheet.

## Connect to mongoose
- Make a dbConfig.js file
- don't forget to require("dotenv").config(), and create the .env file with somthing like this :
 `MONGO_DB_URI=mongodb://127.0.0.1:27017/my-new-db`
- Start Connection:
```js
mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log('Mongoose connection successful!');
  })
  .catch((err) => {
    console.log('Mongoose connection error:', err);
  });
```
- Notice: Mongoose takes too much time trying to connect (30 seconds), to check for the connection failure faster, use:
```js

setTimeout(()=>{
  if (mongoose.connection.readyState !== 1) {
    console.log('Mongoose connection is not connected yet! three seconds passed.');
    console.log("Current Connection status: ",mongoose.connection.readyState ); 
  }
}, 3000)

```
 Or you can also use this option to get a fast failure feedback:
```js
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
});
```
> but this option is **NOT recommended**, as it will stop the driver from trying to reconnect after that short time and also for causing problems with replicas,  (Replica sets in groups of servers that maintain the same data set, they are used for redundancy and high availability. If one server in a replica set fails, the other servers can continue to operate). \
 Also, \
The **serverSelectionTimeoutMS** option in Mongoose controls how long the MongoDB Node.js driver will attempt to retry an operation before erroring out. This includes initial connection, as well as any operations that make requests to MongoDB.
So basically, you risk losing more data if the driver/db server goes down.


- Notice: You don't need to have a "connection" or "pool" object to pass to other files, run the dbConfig.js file in your server or index, and mongoose will handle the connection automatically through the whole app.


## Schemas & Models
- define a models folder, and make a file for each model. eg: user.js, task.js
- require the Schema
 ```js
 const { Schema } = mongoose; 
 ```
 - make a new schema like the following
```js
const userSchema = new Schema({
  username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], maxLength:25,  index: true },

  email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'],  maxLength:254, index: true },
  // S capital == negated version of s , So, non-white space characters


  hash: String,

}, { timestamps: true })

```
the option { timestamps: true } automatically adds createdAt and updatedAt properties.

- to embed a schema in another (Nested Schemas / subdoduments), use something like:
```js
const childSchema = new Schema({ name: 'string' });


const parentSchema = new Schema({
  // Array of subdocuments
  children: [childSchema],
  // Single nested subdocuments
  child: childSchema
});

```
- to add a refence to another model in the schema (either ch to pa or pa to ch), use somthing like:
```js
const taskSchema = new Schema({
  content: String,
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  }
})
```
(User is uppercase as it's a Model reference).
- and when you insert to that collection add the owner like \
  ``await Task.create({ content, owner: currentUser._id });`` (._id or .id).
- and when you want to populate the tasks when you query them, use something like: \
``await Task.find({owner:currentUser._id}).populate('owner')``
(owner is lowercase as in the property) 
- if you want to populate specific fields, use something like: \
    ``populate('owner','username')``. \
   or you can use something clearer like an object with named parameters: \
   ``populate({ path: 'owner', select: 'username' }).``.
   


## Insert new documents


#### PLEASE NOTE: Mongoose does NOT sanitize input, so you have to use an external library to sanitize input from req.body and protect against xss attacks and No-SQL injection.
- you can use the following library to sanitize input (express-mongo-sanitize)
```js
const mongoSanitize = require('express-mongo-sanitize')
.
.
// after defining the app instance:
app.use(mongoSanitize())
```

You can also pass this option to replace prohibited characters with ' - '
``{
    replaceWith: '_',
}``


#### You can use these 3 methods to insert new documents:
- with new Model and .save():
  ```js
      const newTask = new Task({content:"do homework", owner:currentUser._id})
      const savedTask = await newTask.save()

  ```
- with Model.create() (no need to save)
```js
 const newTask = {
  content: 'do homework',
  owner: currentUser._id,
};

const savedTask = await Task.create(newTask);
```
- with Model.insertMany()  ..(also no need to save)
  ```js
  const newTasks = [
  new Task({ content: 'do homework1',owner: currentUser._id }),
  new Task({ content: 'do homework2', owner: currentUser._id }),
  ]
    await Task.insertMany(newTasks)
  ```
- Notice: all the three insertion methods validate with the schemas before inserting.
- Methods that don't apply validation are: \
 Update, updateOne, updateMany, findOneAndUpdate,findByIdAndUpdate.. \
 but to run validators for them, use the option : { runValidators: true }.
  
  