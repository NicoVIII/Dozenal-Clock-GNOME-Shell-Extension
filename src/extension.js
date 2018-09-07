/*
 * I was inspired by code from https://github.com/stuartlangridge/gnome-shell-clock-override
 *
 * License: https://github.com/stuartlangridge/gnome-shell-clock-override/blob/master/LICENSE
 */

/* eslint complexity: ["error", 20] */
/* global imports */

const Main = imports.ui.main;
const GLib = imports.gi.GLib;

let last, label, signalHandlerID;

function getStatusArea() {
    let statusArea = Main.panel._statusArea;
    if (!statusArea) { statusArea = Main.panel.statusArea; }

    return statusArea;
}

function toDozenalNumber(number) {
    let ten = "ᘔ";
    let eleven = "Ɛ";

    if (number >= 0 && number < 10) {
        return number;
    } else if (number === 10) {
        return ten;
    } else if (number === 11) {
        return eleven;
    }
}

function convertDecimalToDozenalTime(hour, minute, second) {
    let daySeconds = 86400;
    let sum = hour*60*60 + minute*60 + second;
    let partOfDay = sum / daySeconds;

    let time = "";
    for (let i = 1; i <= 3; i++) {
        let d = Math.pow(12, i);
        let times = Math.floor(partOfDay * d);
        time += toDozenalNumber(times);
        partOfDay -= times / d;
    }

    return time;
}

function clockOverride(label) {
    let desired = "";
    let text = label.get_text();

    // Convert to dozenal
    var now = GLib.DateTime.new_now_local();
    let time = convertDecimalToDozenalTime(now.get_hour(), now.get_minute(), now.get_second());
    desired = text.replace(/\s\d\d?‎[^\s\w\d]+\d\d([^\s\w\d]+\d\d)?/, " " + time);

    if (text !== desired) {
        last = text;
        label.set_text(desired);
    }
}

function enable() {
    let statusArea = getStatusArea();

    for (let a of statusArea.dateMenu.actor.first_child.get_children()) {
        if (a.get_text && !label) {
            label = a;
            break;
        }
    }
    last = label.get_text();
    signalHandlerID = label.connect("notify::text", clockOverride);
    clockOverride(label);
}

function disable() {
    if (label && signalHandlerID) {
        label.disconnect(signalHandlerID);
        label.set_text(last);
    }
}
