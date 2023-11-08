
class Settings
{
    async MessageHandler(context, callback)
    {
        await callback()
    }
}

module.exports = new Settings()