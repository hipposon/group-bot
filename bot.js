String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

const marker = '*'; //маркер для нахождения дат

const vk = new (require('vk-io')),
    request = require('request'),
    BOTID = 0; //чтобы бот не реагировал сам на себя, введи ID бота

vk.setToken('3cd72633ff20ec3a3fe6a0aa051101d00077220aacc8da438469b3756d47d93be6cf34a8bd21d96fd6b69'); //Впиши токен группы для управления сообщениями
//тест - 47adbced827f85faea3be721fc7357539e90b57a7571eefc59bde14b7a1e66c7692be77539bd43788c18f
//тест2 - d30859e4f3d81aea4c7c20ace090dfc40b85e99cebacec45d4f7a00c4b33dfed34460d430a688a7f4de8b
//бой - 3cd72633ff20ec3a3fe6a0aa051101d00077220aacc8da438469b3756d47d93be6cf34a8bd21d96fd6b69
//телега - 669814878:AAENsOCyG0ax_585kXFVuawO22o5fHg6-hg
vk.longpoll.start();

var commands = [];
var line = "________________________"; //отступ для красоты

vk.longpoll.on('message', (message) => {
    if (message.user == BOTID) return;
    commands.map(function (cmd) {
        if (!cmd.r.test(message.text)) return; // посылаем, если регулярка не совпадает с месседжом
        var params = message.text.match(cmd.r) || []; // создаем группы
        params[0] = message; // так надо!1
        cmd.f(message, params); // Передаем в функцию message и params, для дальнейшей работы с ними
    });
});


function command(_regex, _desc, _func) {
    commands.push({ r: _regex, f: _func, d: _desc }); // Прост красиво оформляем пуш значений в массив.
}

command(/^\поехали/i, 'NULL', function (message, params) {
    return message.send("Напиши слово \«помощь\» для выведения списка команд");
});

command(/^\да/i, 'NULL', function (message, params) {
    return message.send("Напиши слово \«помощь\» для выведения списка команд");
});
command(/^\начать/i, 'NULL', function (message, params) {
    return message.send("Напиши слово \«помощь\» для выведения списка команд");
});

command(/^\помощь/i, 'none', function (message, params) {
    return message.send("🔎Список команд бота:\n" + commands.filter(e => e.d != 'NULL').map(x => x.d).join('\n'));
});

command(/^\корпуса/i, 'корпуса → расположения корпусов на карте(и где поесть(нет))', function (message, params) {
    return message.send({ attachment: 'photo-154460745_456239079' });
});

command(/^\сегодня/i, 'сегодня → расписание на сегодня', function (message, params) {
    //Чтения файла с расписанием
    fs = require("fs");
    fileContent = fs.readFileSync("schedule.txt", "utf8");
    //-----чтение файла с расписанием
    now = new Date();
    now.setDate(now.getDate());
    date = now.getDate() + '.' + (now.getMonth() + 1)
    str = '' + fileContent;
    if (str.indexOf(marker + date) >= 0 || str.indexOf(marker + '0' + date) >= 0) {
        str = "Надо бы поехать сегодня 😒 \n\r" + line + "\n\r" + "📅 " + str.substring(str.indexOf(date), str.indexOf('\n', str.indexOf(date))).replaceAll("|", "\n").replaceAll(marker, '');
        return message.send(str);
    }
    else {
        message.send("Тебя ждут дома…. Пар нет...");
        message.sendSticker(3376);
        return;
    }
    console.log(message + '\n');
});

command(/^\завтра/i, 'завтра → расписание на завтра', function (message, params) {
    //Чтения файла с расписанием
    fs = require("fs");
    fileContent = fs.readFileSync("schedule.txt", "utf8");
    //-----чтение файла с расписанием

    now = new Date();
    tmrw = now;
    tmrw.setDate(tmrw.getDate() + 1);
    date = (tmrw.getDate()) + '.' + (tmrw.getMonth() + 1);
    str = '' + fileContent;
    if (str.indexOf(marker + date) >= 0 || str.indexOf(marker + '0' + date) >= 0) {
        str = "Надо решить, ехать завтра или нет 🤔\n\r" + line + "\n\r" + "📅 " + str.substring(str.indexOf(date), str.indexOf('\n', str.indexOf(date))).replaceAll("|", "\n").replaceAll(marker, '');
        return message.send(str);
    }
    else {
        message.send("Тебя ждут дома…. Пар нет...");
        message.sendSticker(3376);
    }
    console.log(message + '\n');
});

command(/^\неделя/i, 'неделя → расписание на неделю', function (message, params) {
    //Чтения файла с расписанием
    fs = require("fs");
    fileContent = fs.readFileSync("schedule.txt", "utf8");
    //-----чтение файла с расписанием

    //now = new Date();
    str = '' + fileContent;
    out = "Расписание на ближайшую неделю: \n\r" + line + "\n\r"
    outBU = out;
    var temp = new Date();

    for (i = 0; i < 7; i++) {
        var date = (temp.getDate() + '.' + (temp.getMonth() + 1));
        //date = (now.getDate()+(i-now.getDay())) + '.' + (now.getMonth()+1)
        if (str.indexOf(marker + date) >= 0 || str.indexOf(marker + '0' + date) >= 0) {
            if (str.indexOf(marker + '0' + date) < str.indexOf(marker + date)) {
                date.replace(marker, marker + '0');
                out += "📅 " + str.substring(str.indexOf(date), str.indexOf('\n', str.indexOf(date))).replaceAll("|", "\n") + '\n' + line + '\n'.replaceAll(marker, '');
            }
            else {
                out += "📅 " + str.substring(str.indexOf(date), str.indexOf('\n', str.indexOf(date))).replaceAll("|", "\n") + '\n' + line + '\n'.replaceAll(marker, '');
            }
        }
        temp.setDate(temp.getDate() + 1);
    }
    if (out != outBU) return message.send(out);
    else {
        message.send("Тебя ждут дома…. Пар нет...");
        message.sendSticker(3376);
    }
    console.log(message + '\n');
});

command(/^\месяц/i, 'месяц → расписание на месяц', function (message, params) {
    //Чтения файла с расписанием
    fs = require("fs");
    fileContent = fs.readFileSync("schedule.txt", "utf8");
    //-----чтение файла с расписанием

    str = '' + fileContent;
    out = "Расписание на ближайший месяц: \n\r" + line + "\n\r";
    outBU = out;
    var temp = new Date();

    for (i = 0; i < 31; i++) {
        var date = (temp.getDate() + '.' + (temp.getMonth() + 1));
        //date = (now.getDate()+(i-now.getDay())) + '.' + (now.getMonth()+1)
        if (str.indexOf(marker + date) >= 0 || str.indexOf(marker + '0' + date) >= 0) {
            if (str.indexOf(marker + '0' + date) < str.indexOf(marker + date)) {
                date.replace(marker, marker + '0');
                out += "📅  " + str.substring(str.indexOf(date), str.indexOf('\n', str.indexOf(date))).replaceAll("|", "\n") + '\n' + line + '\n'.replaceAll(marker, '');
            }
            else {
                out += "📅  " + str.substring(str.indexOf(date), str.indexOf('\n', str.indexOf(date))).replaceAll("|", "\n") + '\n' + line + '\n'.replaceAll(marker, '');
            }
        }
        temp.setDate(temp.getDate() + 1);
    }
    if (out != outBU) return message.send(out);
    else {
        message.send("Тебя ждут дома…. Пар нет...");
        message.sendSticker(3376);
    }
    console.log(message + '\n');
});
