const network = require('network');
const charm = require('charm')(process.stdout)
let selected = 0;
/**
 * 
 * @param {array} choices - Array of network interface to show 
 */
function renderChoices(choices) {
    if (choices.length>0)
        choices.forEach(function (choice, i) {
            charm.foreground("cyan");
            charm.write("[" + (i === selected ? "X" : " ") + "] ");
            (i !== selected) && charm.foreground("white");
            charm.write(`${choice['name']} ${choice['type']} ${choice['ip_address']}\r\n`);
            charm.foreground("white");
        });
    else {
        charm.foreground("cyan");
        charm.write("[" + (0 === selected ? "X" : " ") + "] ");
        (0 !== selected) && charm.foreground("white");
        charm.write(`${choices['name']} ${choices['type']} ${choices['ip_address']}\r\n`);
        charm.foreground("white");
    }
}
/**
 * @param {object} rl - Readline interface , created from readline native module.
 */
module.exports = (rl, cb) => {

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
        rl.on('line', function (line) {
            if (choices.length>0) 
                selected = choices[selected];
            else
                selected = choices;
                charm.write(`You choosed: ${selected} \r\n`);
                cb(selected);
            

        }).on('close', function () {
            logger.log('Have a great day!');
            rl.close();
            cb(selected);
        });
    });
}