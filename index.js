require('dotenv').config()
const {VK} = require('vk-io')

const database = require('./database/database')
const Data = require('./data/Data')
const API = require('./data/API')

const ChatController = require('./controllers/ChatController')
const PrivateController = require('./controllers/PrivateController')

const VKBot = new VK({token: process.env.VK_TOKEN})

const StartDB = async () =>
{
    return new Promise(async (resolve, reject) => {
        try
        {
            await database.authenticate().then(() => {
                console.log("База данных подключена.")
            })
            await database.sync().then(() => {
                console.log("База данных синхронизирована.")
            })
            return resolve()
        }
        catch (e)
        {
            console.log("Ошибка запуска базы данных: " + e.message)
            return reject()
        }
    })
}

const GetGroupInfo = async () =>
{
    return new Promise(async (resolve, reject) => {
        try
        {
            const group = await API.groups.getById()
            Data.groupId = group[0].id * -1
            console.log("Информация о группе получена")
            return resolve()
        }
        catch (e)
        {
            console.log("Ошибка инициализации API ключа: " + e.message)
            return reject()
        }
    })
}

const StartVKBot = async () =>
{
    return new Promise((resolve) => {
        try
        {
            VKBot.updates.on('message', async(context) =>
            {
                if(context.senderId > 0)
                {
                    context.peerType === "user" && await PrivateController.MessageHandler(context)
                    context.peerType === "chat" && await ChatController.MessageHandler(context)
                }
            })
            VKBot.updates.start().then(() => {
                console.log("VK LongPool подключен")
                return resolve()
            })
        }
        catch (e)
        {
            console.log("ВК бот не смог запуститься из-за ошибки: " + e.message)
            return resolve()
        }
    })
}

StartDB().then(() => GetGroupInfo().then(() => StartVKBot().then(() => console.log("Бот запущен"))))