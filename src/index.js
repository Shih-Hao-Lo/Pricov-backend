const { GraphQLServer } = require('graphql-yoga')
const db = require('./db')
const dbf= db.dbfunction

const resolvers = {
    Query: {
        feed: async (parents, args, context, info) => {
            const out = await context.dbf.getAllUser();
            console.log('out in feed');
            console.log(out);
            return out;
        },
        finduser: async (parents, args, context, info) => {
            const inserted = await context.dbf.getuser(args._id)
            return inserted;
        }
    },
    Mutation: {
        adduser: async (parents, args, context, info) => {
            let out = await context.dbf.adduser(args.email)
            console.log('out in adduser');
            console.log(out);
            return out
        },
        addhistory: async (parents, args, context, info) => {
            let out = await context.dbf.addHistory(args.title , args.price , args.sale , args.url , args.img , args.user)
            console.log('out in addhistory');
            console.log(out);
            return out;
        },
        updateuser: async (parents, args, context, info) => {
            let out = await context.dbf.updateuser(args._id , args.email);
            console.log('out in updateuser');
            console.log(out);
            return out;
        },
        deleteuser: async (parents, args, context, info) => {
            let out = await context.dbf.deluser(args._id);
            console.log('out in deluser');
            console.log(out);
            return out;
        }
    },
    User: {
        _id: (parents) => parents._id,
        email: (parents) => parents.email,
        History: async (parents, args, context, info) => {
            console.log("in user history")
            console.log(parents._id)
            let out = await context.dbf.gethistorybyuser(parents._id);
            console.log(out)
            return out;
        },
    },
    History: {
        _id: (parents) => parents._id,
        title: (parents) => parents.title,
        price: (parents) => parents.price,
        sale: (parents) => parents.sale,
        url: (parents) => parents.url,
        img: (parents) => parents.img,
        user: (parents) => parents.user,
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { dbf },
})

server.start(() => console.log(`Server is running on http://localhost:4000`))