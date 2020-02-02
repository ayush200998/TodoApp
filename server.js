let express = require('express')
let mongodb = require('mongodb')
// let sanitizeHTML = require('sanitize-html')

let app = express()

let db

app.use(express.static("public"))

let connectionString = "mongodb+srv://todoAppUser:passqbtau20@cluster0-l2i6m.mongodb.net/todoApp?retryWrites=true&w=majority"

let port = process.env.PORT
  if(port === null || port === ""){
    port = 9000
  }

mongodb.connect(connectionString , {useNewUrlParser : true ,  useUnifiedTopology: true } , function(err , client){
        db = client.db()
        app.listen(port, function(){
            console.log("listening on port 9000")
        })
})

app.use(express.json())
app.use(express.urlencoded({extended : false}))

    function passwordProtected(req , res ,next){

        
        res.set('WWW-Authenticate' , 'Basic realm="My Todo App"')
        // console.log(req.headers.authorization)
        if(req.headers.authorization === "Basic bXl0b2RvYXBwOjAyZmViMjAyMA=="){
            next()
        }else{
            res.status(401).send("Authentication Required")
        }

    }

app.get('/' ,passwordProtected, function(req,res){

    db.collection("items").find().toArray(function(err , items){
        res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action="/createpost" method="POST" >
            <div class="d-flex align-items-center">
              <input id="create-input" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="create-list" class="list-group pb-5">
        </ul>
        
      </div>

      <script>
          let items = ${JSON.stringify(items)}
       </script>

      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/browser.js"> </script>
    </body>
    </html>`)
    })
    
})

     app.post('/create-item' , function(req,res){
        //  let safeValue = sanitizeHTML(req.body.text , {allowedtags : [] , allowedAttributes: {}})
         db.collection("items").insertOne({text : req.body.text} , function(error , insertedItems){
            console.log(res.json(insertedItems.ops[0]))
         })
     })
   
        app.post("/update-item" , function(req,res){
            let editedValue = req.body.text
            let updateId = req.body.id
           db.collection("items").findOneAndUpdate({_id : new mongodb.ObjectId(updateId) } , {$set : {text: editedValue}} , function(){
               res.send("Updated Successfully")
           })
        })

        app.post("/delete-item" , function(req,res){
            let deleteId = req.body.id

            db.collection("items").deleteOne({_id : new mongodb.ObjectId(deleteId)} , function(){
                res.send("Deleted Succesfully")
            }) 
        })

