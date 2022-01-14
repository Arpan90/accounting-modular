const express = require('express');
const router = express.Router();

function normalisationHandler(data){
    collection = collections[data.name.toLowerCase()];
    year = data.year;
    amount = Number(data.amount);
}

let year = 0;
let amount = 0;
let collection = {};

// Item model

const collections = require('../../models/Item');


// Getting data 
router.get('/', (req, res) => {
    collection = collections[req.query.name];
    year = req.query.year;
    collection.find( year === "all" ? {} : {year: year})
           .then((result) =>{
                res.json(result);
           })
           .catch(err => {
                res.json(err)
           })
});

// Updating or Deleting data 

router.post('/:toUpdate',  (req, res) => {
    normalisationHandler(req.body);
    let description = req.body.description;
    let direction = req.body.direction;
    let date = req.body.date;
    let noDate = req.body.noDate;
    let del = req.body.del;
    let toUpdate = Number(req.params.toUpdate);
    if(del){ // deletion

        collection.findOne({ year: year })
                  .then(item => {
                      if(item.entries.length === 1){
                          collection.deleteOne({ year: year })
                                    .then(result =>{
                                        console.log("year deletion successful", result)
                                        res.json(result)
                                    })
                      }
                      else{
                        collection.updateOne( {"year":year}, {$pull:{ "entries" :{ "id":toUpdate }  }}, { runValidators: true }   )
                        .then(result =>{
                            console.log("deletion successful", result)
                            res.json(result)
                        } )
                      }
                  })
                  .catch(err => console.log("deletion error!", err));

        // collection.updateOne( {"year":year}, {$pull:{ "entries" :{ "id":toUpdate }  }}, { runValidators: true }   )
        //         .then(result =>{
        //             console.log("deletion successful", result)
        //             res.json(result)
        //         } )
        //         .catch(err => console.log("error!", err));
    }
    else{ // updation
        collection.updateOne( {"year":year, "entries.id": toUpdate}, {$set:{ "entries.$.date":date, "entries.$.noDate":noDate, "entries.$.amount":amount, "entries.$.description":description, "entries.$.direction": direction }  }, { runValidators: true } )
                   .then(result =>{
                       res.json(result)
                   } )
                   .catch(err => console.log("updation error!", err));
    }
}); 

// Posting new data

router.post('/',  (req, res) => {
    normalisationHandler(req.body);
    let description = req.body.description;
    let direction = req.body.direction;
    let date = req.body.date;
    let noDate = req.body.noDate;
    let id = 1;   
    collection.findOne({ "year": year })
           .then((item) =>{
                console.clear();
                // id =  item.entries.length + 1;
                if(item){

                    let idArr = item.entries.map((obj, index) => {
                                return obj.id
                    });
                    id = Math.max.apply(null, idArr) + 1 ;
                }
            })
            .catch(err => console.log(err))
            .finally(()=>{
                collection.updateOne( {"year":year}, {$push:{ "entries" :{ "id": id, "date": date, "noDate":noDate, "amount":amount,  "description":description, "direction":direction }  }},{upsert: true, runValidators: true})
                    .then(item=>{
                        item["id"] = id;
                        res.json(item);
                    })
                    .catch(err =>console.log("not updated", err)); 
            })

}); 

    // const newItem = new narayan({
    //     year: year,
    //     entries:[
    //         {
    //             amount: amount,
    //             description: description,
    //             direction: direction
    //         }
    //     ]
    // });

    // newItem.save().then(item => res.json(item));
// });

module.exports = router;