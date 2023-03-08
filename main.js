const artworkContainer = document.getElementById('artwork-container');
const fullinfoPage = document.getElementById('full-artwork-info');
const shade = document.getElementById('shade');
const indivImage = document.getElementById('individual-img');
const indivInfo = document.getElementById('individual-info');
const loader = document.getElementById('loader');

//Show loading
function loading() {
    loader.hidden = false;
    artworkContainer.hidden = true;
}
  
//Hide loading
function complete() {
    loader.hidden = true;
    artworkContainer.hidden = false;
}

//Show loading for full artwork info
function loadingFullInfo() {
    loader.hidden = false;
    fullinfoPage.hidden = true;
}
  
//Hide loading for full artwork info
function completeFullInfo() {
    loader.hidden = true;
    fullinfoPage.hidden = false;
}

const getArtworks = async () => {
    loading();

    const result = await fetch('https://api.artic.edu/api/v1/artworks?page=1&limit=20');
    const apiData = await result.json();

    complete();

    return apiData;
}

const displayArtworks = async () => {
    loading();

    const apiData = await getArtworks();

    const data = apiData['data'];
    const config = apiData['config'];

    // For each artwork
    for(let i = 0; i < data.length; i++) {
        // Get data for the specific artwork
        const artwork = data[i];

        // Create artwork image element
        const img_el = document.createElement('img');
        img_el.className = 'art-img';
        img_el.id = artwork['id'];

        let img_url = 'images/image-unavailable.jpg';
        if(artwork['image_id'] != null) {
            img_url = config['iiif_url'] + '/' + artwork['image_id'] + '/full/843,/0/default.jpg';
        }
        img_el.src = img_url;

        // Create artwork info element
        const info_el = document.createElement('div');
        info_el.className = 'art-info';

        let text = `${artwork['title']}`;
        info_el.innerText = text;

        // Create artwork div element
        const artwork_el = document.createElement('div');
        artwork_el.className = 'art-div';
        artwork_el.addEventListener('click', (event) => clickEvent(event, artwork['id'], artwork['title'], img_url));

        // Add image and info to the parent div
        artwork_el.appendChild(img_el);
        artwork_el.appendChild(info_el);

        // Add parent div to the container
        artworkContainer.appendChild(artwork_el);
    }

    complete();
}

displayArtworks();

async function clickEvent(event, id, title, img_url) {
    loadingFullInfo();

    const result = await fetch('https://api.artic.edu/api/v1/artworks/' + id.toString() + "?fields=id,artist_title,place_of_origin,date_display,thumbnail,medium_display,dimensions,department_title");
    const apiData = await result.json();
    const data = apiData['data'];
    console.log(data);

    let description = 'None';
    if(data['thumbnail'] != null) { description = data['thumbnail']['alt_text']; 
}
    let text = `${title}\n\n`;
    text += `ARTIST:\n${data['artist_title']}\n\n`;
    text += `MEDIUM:\n${data['medium_display']}\n\n`;
    text += `PLACE OF ORIGIN:\n${data['place_of_origin']}\n\n`;
    text += `DISPLAY DATE:\n${data['date_display']}\n\n`;
    text += `DEPARTMENT:\n${data['department_title']}\n\n`;
    text += `DESCRIPTION:\n${description}\n\n`;
    text += `DIMENSIONS:\n${data['dimensions']}\n\n`;

    fullinfoPage.style.display = 'block';
    shade.style.display = 'block';

    if(img_url != null && img_url != '') {
        indivImage.src = img_url;
    }

    indivInfo.innerText = text;

    completeFullInfo();

    return apiData;
}

function exitPage() {
    fullinfoPage.style.display = 'none';
    shade.style.display = 'none';
}

