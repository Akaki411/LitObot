const {Keyboard} = require('vk-io')

class Keyboards
{
    none = Keyboard.keyboard([])
    inlineNone = Keyboard.keyboard([]).inline()

    build = (buttons) => {
        return Keyboard.keyboard(buttons)
    }

    controlsButton = Keyboard.textButton(
        {
            label: "Управление",
            color: Keyboard.SECONDARY_COLOR,
            payload: {
                choice: "controls"
            }
        })
}

module.exports = new Keyboards()