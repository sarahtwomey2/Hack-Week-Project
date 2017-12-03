# Hack Week Project
By: Austin Hartschen, Nicolle Lenzmeier, Sarah Twomey, Thunpisit Amnuaikiatloet
 		
### Problem: 
When you want to upload a meme to Reddit there isn’t a straightforward way to upload a meme. Reddit has the ability to upload an image, but there isn’t a way to create an image. There are multiple websites to create a meme, but none of them have the ability to upload to Reddit. This means that you have to visit two sites to successfully get a meme posted to Reddit.

### Solution:
We have created a website that allows users to upload an image and then draw over the image to create a meme. You have the ability to title the image and then you have the option of saving the meme locally to your computer or you can post the image directly to Reddit from a site. 

### Implementation:
* **Technology**
	* HTML
	* CSS
	* Javascript
	* Bootstrap
	* Reddit API
	* Imgur API
	
### How We Did It:
* Creating The Meme
To create the meme we had to have an image and a canvas. The image is uploaded by the user and then we draw the image to the canvas when the user selects an image and when the user types to the input to create the meme.

This code is the event handlers that makes sure the meme is redrawn with every keystroke making the meme update as the user enters input.
``` javascript
topInput.addEventListener('keydown', memeify);
topInput.addEventListener('keyup', memeify);
topInput.addEventListener('change', memeify);

bottomInput.addEventListener('keydown', memeify);
bottomInput.addEventListener('keyup', memeify);
bottomInput.addEventListener('change', memeify);
```

The `memeify()` function actually beings creation of the meme. We have to get the context of our `canvas` that we create and draw the image that the user uploaded to the `canvas`. We then then style the font to that which you typically see on a meme. We then take text and send it to the `wrapText()` function. We’ll explain what that function does in a little bit.
``` javascript
function memeify() {
	context.clearRect(0, 0, canvas.wdith, canvas.height);			context.drawImage(img, 0, 0, memeSize, memeSize);

	context.lineWidth = 4;
	context.font = '20pt sans-serif';
  context.strokeStyle = 'black';
  context.fillStyle = 'white';
  context.textAlign = 'center';
 	context.textBaseline = 'top';

	var text1 = document.getElementById('top-input').value;
	text1 = text1.toUpperCase();
	x = memeSize / 2;
  y = 0;

	wrapText(context, text1, x, y, 300, 28, false);

	context.textBaseline = 'bottom';
  var text2 = document.getElementById('bottom-input').value;
  text2 = text2.toUpperCase();
  y = memeSize;

  wrapText(context, text2, x, y, 300, 28, true);
}
```

The `wrapText()` function is responsible for putting the text on top of the image and wrapping the text. This means that is creates the line breaks whenever text would otherwise run off the image. This was actually a bit of a challenge because when we first created the function to place text over the image we would get a bug where the text would stay on a single line and just run off the sides of the image. This was a problem, so we we did the math in the function to to place the text on a new line whenever it went off the space provided by the image.
``` javascript
function wrapText(context, text, x, y, maxWidth, lineHeight, fromBottom) {

	var pushMethod = (fromBottom) ? 'unshift' : 'push';
	lineHeight = (fromBottom) ? -lineHeight : lineHeight;

	var lines = [];
	var y = y;
  var line = '';
  var words = text.split(' ');

  for (var n = 0; n < words.length; n++) {
  		var testLine = line + ' ' + words[n];
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;

      if (testWidth > maxWidth) {
      	lines[pushMethod](line);
         	line = words[n] + ' ';
      } else {
          line = testLine;
      }
	}

	lines[pushMethod](line);

	for (var k in lines) {
  		context.strokeText(lines[k], x, y + lineHeight * k);
      context.fillText(lines[k], x, y + lineHeight * k);
  }
}
```

* Uploading the meme
The Reddit API does not allow you to upload an image to the site directly. You can only post a link to an image, so we hit a bit of a roadblock here. The Reddit website does allow users to upload an image, but they haven’t incorporated this feature into their API at this point. Many users on Reddit use Imgur to post their photos, so we decided to explore this option. We found that the Imgur API does allow you to upload an image, but it wasn’t well documented, so it was a bit of challenge.

The `uploadToImgur()` function uses an `ajax()` call to connect to reddit and authorize our upload with our API Key. We then actually call the `upload()` function inside of this function that will ultimately upload the image to Reddit.
``` javascript
function uploadToImgur() {
	try {
  		var img = document.getElementById('meme').toDataURL('image/jpeg', 0.9).split(',')[1];
  } catch (e) {
		var img = document.getElementById('meme').toDataURL().split(',')[1];
	}

	$.ajax({
  		url: 'https://api.imgur.com/3/image',
      type: 'post',
     	headers: {
      	Authorization: <insert_clientID>
      },
      data: {
      	image: img
      },
      dataType: 'json',
      success: function(response) {
      	if (response.success) {
          	upload(response.data.link, document.getElementById('memeTitle').value);
          } else {
              alert('Upload Failed');
          }
		}
	});
}
```

The `upload()` function takes our URL from Imgur and the user provided title and uploads the link and reddit to our subreddit that we created to display our memes. We use a reddit bot that we created specifically for this project. Our API key didn’t allow for multiple user authentication, so we had to use this single account. You could get a better API key from reddit that would allow you to login with multiple accounts. 
``` javascript
function upload(URL, title) {

    // Alternatively, just pass in a username and password for script-type apps.
    const r = new snoowrap({
        userAgent: <insert_userAgent>,
        clientId: <insert_clientId>,
        clientSecret: <insert_clientSecret>,
        username: <insert_username>,
        password: <insert_password>
    });

    // Submitting a link to a subreddit
    r.getSubreddit('memezou').submitLink({
        title: title,
        url: URL
    }).then((submission) => {
        console.log(submission);
        alert('Success!');
        document.getElementById('redditLink').href = "https://www.reddit.com/r/memezou/new/";
        document.getElementById('redditLink').hidden = false;
        console.log(submission.permalink);
    }).catch((e) => {
        console.log(e);
        alert(e.message);
    });
}
```

### Challenges
* Creating the meme presented several challenges as we had to make sure the text wrapped around the image. As seen above we had to create a special function to combat this issue.
* We wanted to upload an image to Reddit and this didn’t work with the Reddit API out of the box. We had to instead include the Imgur API to allow us to upload the image and then pass the Imgur URL back to the upload to Reddit function to upload an image to reddit.
* Reddit API is typically done with Python as the site is based on a Python backend. This was a little bit of a problem as we were trying to solve this with mostly frontend code and that we were having a hard time calling a Python function from our Javascript. We found a wrap of the Reddit API called Snooscript that allowed us to use Javascript to call the Reddit API .

#CS4830/HackWeek