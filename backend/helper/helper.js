const path = require("path");

module.exports = {
  fileUpload: async (file) => {
    if (file) {
      var extension = path.extname(file.name);
      var filename = uuid() + extension;
      file.mv(process.cwd() + `/public/images/` + filename, function (err) {
        if (err) return err;
      });
    }

    let fullpath = `/public/images/` + filename;
    return fullpath;
  },
};
