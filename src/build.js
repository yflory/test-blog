var Fs = require("fs");

// read a file
var read = function (path) {
    return Fs.readFileSync(path, 'utf-8');
};

// write a file
var write = function (path, src) {
    return Fs.writeFileSync(path, src);
};

// basic templating
var swap = function (src, dict) {
    return src.replace(/\{\{(.*?)\}\}/g, function (a, b) {
        return dict[b] || b;
    });
};

// read the template file
var template = read('./template.html');

// read page fragments
var fragments = {};
[   'index',
    'fork',
    'topbar',
    'logo',
    'noscript',
    'footer'
].forEach(function (name) {
    fragments[name] = read('./fragments/' + name + '.html');
});

// build static pages
['index'].forEach(function (page) {
    var source = swap(template, {
       topbar: fragments.topbar,
       fork: fragments.fork,
       main: swap(fragments[page], {
           topbar: fragments.topbar,
           fork: fragments.fork,
           logo: fragments.logo,
           noscript: fragments.noscript,
           footer: fragments.footer,
       }),
       logo: fragments.logo,
       noscript: fragments.noscript,
       footer: fragments.footer,
    });
    write('../' + page + '.html', source);
});
