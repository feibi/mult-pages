const path = require('path');
const glob = require('glob');

function getEntry(globPath) {
  let entries = {},
    basename,
    tmp,
    pathname;

  glob.sync(globPath).forEach(function(entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = tmp.splice(1, 1) + '/' + basename; // 正确输出js和html的路径
    entries[pathname] = entry;
  });
  return entries;
}

module.exports = getEntry;
