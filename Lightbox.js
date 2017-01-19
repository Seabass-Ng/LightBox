(function() {
  var contentBody = document.querySelector('.lightbox .lightbox__content__body');
  var imageContainer = document.querySelector('.lightbox .imageContainer');
  var imageEl = document.querySelector('.lightbox .imageContainer .imageContainer__image');
  var prevEl = document.querySelector('.lightbox .prev');
  var nextEl = document.querySelector('.lightbox .next');
  var titleEl = document.querySelector('.lightbox .title');
  var photoIndex = 0;
  var data = [];

  // There are ways to center (vertically and horizontally) purely
  // through CSS, but there appears to be a few complications here
  // since images have different sizes. I can make them all display
  // the same size, but I have to worry about the images looking
  // pixelated and images don't always have the same aspect ratio,
  // so there's that complication too.
  var centerImage = function(imageWidth, imageHeight) {
    var bodyWidth = contentBody.clientWidth;
    var bodyHeight = contentBody.clientHeight;
    var displayImageWidth = imageWidth;
    var displayImageHeight = imageHeight;
    var prevElWidth = prevEl.clientWidth;
    var nextElWidth = nextEl.clientWidth;
    var imageRatio = imageWidth / imageHeight;
    var imageStyle = imageEl.style;

    var cssText = '';
    if (displayImageWidth > bodyWidth - prevElWidth - nextElWidth - 30) {
    	displayImageWidth = bodyWidth - prevElWidth - nextElWidth - 30;
      displayImageHeight = displayImageWidth / imageRatio;
    }
    if (displayImageHeight > bodyHeight) {
    	displayImageHeight = bodyHeight;
      displayImageWidth = displayImageHeight * imageRatio;
    }

    // Changing styles one at a time is a slow operation, so this
    // seems like the way to change styles all in one go.
    cssText = 'margin-left: ' + (-displayImageWidth / 2) + 'px';
    cssText = cssText + ';margin-top: ' + (-displayImageHeight / 2) + 'px';
    if (displayImageWidth !== imageWidth) {
    	cssText = cssText + ';width:' + displayImageWidth + 'px';
      cssText = cssText + ';height:' + displayImageHeight + 'px';
    }
    imageContainer.style.cssText = cssText;
  };

  // Change photos functions
  var changePhotos = function() {
  	var image = data[photoIndex];
    var prevImgEl = document.querySelector('#preloader .prevImg');
    var nextImgEl = document.querySelector('#preloader .nextImg');
  	imageEl.src = image.url;
    titleEl.innerHTML = image.title;
  	centerImage(image.width, image.height);

    if (photoIndex === 0) {
    	prevImgEl.src = data[data.length - 1].url;
    } else {
    	prevImgEl.src = data[photoIndex - 1].url;
    }

    if (photoIndex === data.length - 1) {
    	nextImgEl.src = data[0].url;
    } else {
    	nextImgEl.src = data[photoIndex + 1].url;
    }
  }
  var onNextClick = function() {
  	if (data.length - 1 === photoIndex) {
    	photoIndex = 0;
    } else {
    	photoIndex += 1;
    }
    changePhotos();
  };
  var onPrevClick = function() {
  	if (0 === photoIndex) {
    	photoIndex = data.length - 1;
    } else {
    	photoIndex -= 1;
    }
    changePhotos();
  };
  prevEl.onclick = onPrevClick;
  nextEl.onclick = onNextClick;

  (function() {
    var onDataRetrieval = function(response) {
    	data = [];
      var giphyData, i, item;
    	for (i = 0; i < response.data.length; i += 1) {
      	giphyData = response.data[i];
        if (giphyData.hasOwnProperty('user') && giphyData.hasOwnProperty('images')) {
        	item = {};
          item.title = 'Photo by ' + giphyData.user.display_name;
        	item.url = giphyData.images.original_still.url;
        	item.height = parseInt(giphyData.images.original_still.height);
        	item.width = parseInt(giphyData.images.original_still.width);
        	data.push(item);
        }
      }
      changePhotos();
    };
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState < 4) {
        return;
      }
      if (xhr.status !== 200) {
        //TODO: Deal with errors
        return;
      }
      if (xhr.readyState === 4) {
      	onDataRetrieval(JSON.parse(xhr.responseText));
      }
    };
    xhr.open('GET', 'https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC');
    xhr.send();
  })();
})();
