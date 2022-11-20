const validateURL = (url) => {
    const regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);
    // if match() returns true - successful match
    if (url.match(regex)) {
        return true;
    }
    return false;
};

module.exports = validateURL;