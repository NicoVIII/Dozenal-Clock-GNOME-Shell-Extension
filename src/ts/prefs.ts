/*!
 * Dozenal Clock GNOME-Shell Extension v0.1.0
 * https://gitlab.com/NicoVIII/Dozenal-Clock-GNOME-Shell-Extension
 *
 * @license MIT
 *
 * I was inspired by code from
 * https://github.com/stuartlangridge/gnome-shell-clock-override
 *
 * Licenses of those projects
 * https://github.com/stuartlangridge/gnome-shell-clock-override/blob/master/LICENSE
 */

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Config = imports.misc.config;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Gettext = imports.gettext.domain('dozenal-clock');
const _ = Gettext.gettext;

function init() {}

const DozenalClockSettings = new GObject.Class({
    Name: 'DozenalClockPrefs',
    Extends: Gtk.Grid,

    _init: function (params: any) {
        this.parent(params);
        this.margin = 24;
        this.column_spacing = 30;
        this.row_spacing = 10;

        this._settings = ExtensionUtils.getSettings();
        let label = null;
        let widget: any = null;

        label = new Gtk.Label({
            label: _("Show 'normal' time as well"),
            hexpand: true,
            halign: Gtk.Align.START
        });
        //widget = new Gtk.Entry({ halign: Gtk.Align.END, text: this._settings.get_string('override-string') });
        //widget.set_sensitive(true);
        this.attach(label, 0, 0, 2, 1);
        //this.attach(widget, 2, 0, 1, 1);

        /*this._settings.connect('changed::override-string', Lang.bind(this, function (this: any) {
            let sval = this._settings.get_string('override-string');
            if (widget.get_text() != sval) widget.set_text(sval);
        }));*/
    },
});

function buildPrefsWidget() {
    let widget = new DozenalClockSettings();
    widget.show_all();

    return widget;
}
