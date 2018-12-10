const network = require('network');
const charm = require('charm')(process.stdout);
//Selected choice-index
let selected = 0;
/**
 * Render a choice
 * @param {*} choice - the current choice.{name:'eth0',ip_address:'10.0.1.3',type: 'Wired'} and other fields.
 * @param {Number} i - index of current choiche
 */
function renderChoice(choice, i) {
    charm.foreground("cyan");
    charm.write("[" + (i === selected ? "X" : " ") + "] ");
    (i !== selected) && charm.foreground("white");
    charm.write(`${choice['name']} ${choice['type']} ${choice['ip_address']}\r\n`);
    charm.foreground("white");
}
/**
 * Filter the choices and call the render function for one choice.
 * @param {array} choices - Array of network interface to show 
 */
function renderChoices(choices) {
    if (choices.length > 0)
        choices.forEach((choice, i) => renderChoice(choice, i));
    else
        renderChoice(choices, 0);
}
/**
 * Get the Network Interface and render it on CLI.
 * @param {object} rl - Readline interface , created from readline native module.
 */
module.exports = (rl, callback) => {
    network.get_interfaces_list((err, choices) => {
        process.stdin.on('keypress', function (s, key) {
            if (key.name === "up" && (selected - 1) >= 0) {
                selected--;
            } else if (key.name === "down" && (selected + 1) < choices.length) {
                selected++;
            } else {
                return; // don't render if nothing changed
            }
            charm.erase("line");
            choices.forEach(function () {
                charm.up(1);
                charm.erase("line");
            });
            renderChoices(choices);
        });
        renderChoices(choices);
        rl.on('line', line => {
            if (choices.length > 0)
                selected = choices[selected];
            else
                selected = choices;
            charm.write(`You choosed: ${selected} \r\n`);
            rl.close();
            callback(selected);
        }).on('close', () => {
            logger.log('Have a great day!');
            rl.close();
            callback(selected);
        });
    });
}