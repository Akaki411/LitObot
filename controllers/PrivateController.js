const GPT = require("./GPTController")
const Settings = require("./Settings")
const keyboard = require("../models/Keyboards")
const {Keyboard} = require("vk-io");

class PrivateController
{
    MessageHandler = async (context) =>
    {
        if(context.command?.match(/^начать/))
        {
            await context.send("Привет.\n\nℹ Это бот, который может отвечать на твои вопросы. Он основан на нейросети ChatGPT, а именно на модели GPT 3.5 Turbo.", {keyboard: keyboard.build(this.GetHomePageKeyboard())})
            return
        }
        await Settings.MessageHandler(context, async () =>
        {
            await this.SendGPTRequest(context)
        })
    }

    GetHomePageKeyboard = (context) =>
    {
        return [
            [keyboard.controlsButton]
        ]
    }
    HomePage = async (context) =>
    {
        try
        {
            const current_keyboard = this.GetHomePageKeyboard()
            if(context.messagePayload?.choice?.match(/back|take_away_citizenship|citizen_list|players_list/))
            {
                if(context.messagePayload?.choice?.match(/controls/))
                {
                    await context.send("↪ Назад",{keyboard: keyboard.build(this.GetControlsMenuKeyboard())})
                    context.player.state = this.ControlsMenu
                }

            }
            else
            {
                await context.send("Главная страница",{keyboard: keyboard.build(current_keyboard)})
            }
        }
        catch (e)
        {
            await context.send("Ошибка: " + e.message)
        }
    }

    GetControlsMenuKeyboard = () =>
    {
        return [
            [keyboard.controlsButton]
        ]
    }
    ControlsMenu = async (context) =>
    {
        try
        {
            const current_keyboard = this.GetControlsMenuKeyboard()
            if(context.messagePayload?.choice?.match(/back/))
            {
                if(context.messagePayload?.choice?.match(/back/))
                {
                    await context.send("↪ Назад",{keyboard: keyboard.build(this.GetHomePageKeyboard(context))})
                    context.player.state = this.HomePage
                }

            }
            else
            {
                await context.send("Управление",{keyboard: keyboard.build(current_keyboard)})
            }
        }
        catch (e)
        {
            await context.send("Ошибка: " + e.message)
        }
    }

    async SendGPTRequest(context)
    {
        try
        {
            let messages = []
            let limit = 15
            if(context.forwards.length > 0)
            {
                for(const msg of context.forwards)
                {
                    if(msg.text?.length > 0 && limit > 0)
                    {
                        messages.push({role: msg.senderId > 0 ? "user" : "assistant", content: msg.text})
                        limit --
                    }
                }
            }
            if(context.replyMessage && context.replyMessage?.text?.length > 0)
            {
                messages.push({role: context.replyMessage.senderId > 0 ? "user" : "assistant", content: context.replyMessage.text})
            }
            for(const a of context.attachments)
            {
                if(a.type === "audio")
                {
                    messages.push({role: "user", content: `Песня ${a.title} от исполнителя ${a.artist}`})
                    break
                }
            }
            messages.push({role: "user", content: context.text})
            let request = await GPT(messages)
            for (const sample of request)
            {
                await context.send(sample)
            }
        }
        catch (e) {}
    }
}

module.exports = new PrivateController()