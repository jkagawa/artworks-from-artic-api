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
    console.log(apiData);

    complete();

    return apiData;
}

const displayArtworks = async () => {
    loading();

    const apiData = await getArtworks();

    console.log(apiData['data']);
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

        let img_url = '';
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

    console.log(id);
    console.log(event);
    const result = await fetch('https://api.artic.edu/api/v1/artworks/' + id.toString() + "?fields=id,artist_title,place_of_origin,date_display");
    const apiData = await result.json();
    console.log(apiData);

    const data = apiData['data'];
    const config = apiData['config'];
    let text = `ID: ${data['id']}\nTITLE: ${data['title']}\nARTIST: ${data['artist_title']}\n`;
    text += `PLACE OF ORIGIN: ${data['place_of_origin']}\nDISPLAY DATE: ${data['date_display']}\n\n`;
    console.log(text);

    fullinfoPage.style.display = 'block';
    shade.style.display = 'block';

    if(img_url != null && img_url != '') {
        console.log('Not null');
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

