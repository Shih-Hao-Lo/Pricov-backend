const mongoCollections = require("./mongoCollections");
const connection = require("./mongoConnection");
const users = mongoCollections.users;
const history = mongoCollections.history;
const ObjectID = require('mongodb').ObjectID

async function getuser(id){
    if(id === undefined){
        throw 'input is empty';
    }
    if(id.constructor != ObjectID){
        if(ObjectID.isValid(id)){
            id = new ObjectID(id);
        }
        else{
            throw 'Id is invalid!(in user.get)'
        }
    }

    const userCollection = await users();
    const target = await userCollection.findOne({ _id: id });
    if(target === null) throw 'user not found!';

    return target;
}

async function adduser(email) {
    let newuser = {
        email: email
    }

    const userCollection = await users();
    const InsertInfo = await userCollection.insertOne(newuser);
    if (InsertInfo.insertedCount === 0) throw 'Insert fail!';

    return await getuser(InsertInfo.insertedId);
}

async function gethistory(id){
    if(id === undefined){
        throw 'input is empty';
    }
    if(id.constructor != ObjectID){
        if(ObjectID.isValid(id)){
            uid = new ObjectID(id);
        }
        else{
            throw 'Id is invalid!(in history.get)'
        }
    }

    const historyCollection = await history();
    const target = await historyCollection.find({ _id: id });
    if(target === null) throw 'history not found!';

    return target;
}

async function gethistorybyuser(uid){
    const historyCollection = await history();
    const targets = await historyCollection.find({ user: uid.toString() }).toArray();
    console.log("in gethistorybyuser")
    console.log(uid.toString())
    if(targets === null) throw 'history not found!';

    return targets;
}

async function addHistory(title , price , sale , url , img , user) {
    let newhistory = {
        title: title,
        price: price,
        sale: sale,
        url: url,
        img: img,
        user: user
    }
    const historyCollection = await history();
    const InsertInfo = await historyCollection.insertOne(newhistory);
    user = new ObjectID(user);
    const userCollection = await users();
    const updateuser = await userCollection.update({ _id: user } , { $addToSet: { history: await gethistory(InsertInfo.insertedId) } });
    return await getuser(user);
}

module.exports = {
    getuser,
    adduser,
    addHistory,
    gethistorybyuser
};