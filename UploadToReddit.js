//var snoowrap = require('snoowrap');


function upload(URL, title) {

    // Alternatively, just pass in a username and password for script-type apps.
    const r = new snoowrap({
        userAgent: 'SarahBot 1.0 by /u/ meme_zou',
        clientId: 'ZVvTYMie6R2hrQ',
        clientSecret: 'IvlgET7VrpM73YkOYCdPl8nTwS8',
        username: 'meme_zou',
        password: 'CS4320'
    });

    // Submitting a link to a subreddit
    r.getSubreddit('memezou').submitLink({
        title: title,
        url: URL
    }).then((x) => {
        console.log(x);
    }).catch((e) => {
        console.log(e);
        alert(e.message);
    });
}