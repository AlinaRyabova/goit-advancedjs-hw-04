import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'izitoast/dist/css/iziToast.min.css';
import iziToast from 'izitoast';

const pixabayAPI = {
  baseUrl: 'https://pixabay.com/api/',
  key: '40817348-8cf9cc617061525653a12724b',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  order: 'popular',
  page: '1',
  per_page: '40',
};

const searchForm = document.querySelector('.search-form');
const gallerySelector = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const markupData = {
  markup: '',
  htmlCode: '',
};

let searchQueryResult = '';
let q = '';
let pageN = 1;
const gallery = new SimpleLightbox('.gallery a', {
  enableKeyboard: true,
});

searchForm.addEventListener('submit', async e => {
  e.preventDefault();

  const {
    elements: { searchQuery },
  } = e.target;
  searchQueryResult = searchQuery.value.trim();

  if (searchQueryResult === '') {
    gallerySelector.innerHTML = '';
    iziToast.error({
      title: 'Error',
      message:
        'Sorry, there are no images matching your search query. Please try again.',
    });
    return;
  }

  if (searchQueryResult !== q) {
    pageN = 1;
    pixabayAPI.page = `${pageN}`;
    gallerySelector.innerHTML = '';
    btnLoadMore.classList.remove('is-visible');
  } else {
    pageN += 1;
    pixabayAPI.page = `${pageN}`;
    btnLoadMore.classList.remove('is-visible');
  }

  q = searchQueryResult;

  try {
    const results = await fetchPhotos(searchQueryResult);
    markupData.htmlCode = await createMarkup(results);
    gallerySelector.insertAdjacentHTML('beforeend', markupData.htmlCode);
    gallery.refresh();

    const { page, per_page } = pixabayAPI;
    const { totalHits } = results;
    const totalPages = Math.ceil(totalHits / per_page);

    if (page <= totalPages) {
      btnLoadMore.classList.remove('is-visible');
    }

    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${totalHits} images.`,
    });
  } catch (error) {
    btnLoadMore.classList.add('is-visible');
    iziToast.error({
      title: 'Error',
      message:
        'Sorry, there are no images matching your search query. Please try again.',
    });
  } finally {
    searchForm.reset();
  }
});

btnLoadMore.addEventListener('click', async () => {
  pageN += 1;
  pixabayAPI.page = `${pageN}`;

  try {
    const results = await fetchPhotos(searchQueryResult);
    markupData.htmlCode = await createMarkup(results);
    gallerySelector.insertAdjacentHTML('beforeend', markupData.htmlCode);
    btnLoadMore.classList.add('is-visible');
    gallery.refresh();

    const { page, per_page } = pixabayAPI;
    const { totalHits } = results;
    const totalPages = Math.ceil(totalHits / per_page);

    if (page <= totalPages) {
      btnLoadMore.classList.remove('is-visible');
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: "We're sorry, but you've reached the end of search results.",
    });
  }
});

async function fetchPhotos(searchQueryResult) {
  const {
    baseUrl,
    key,
    image_type,
    orientation,
    safesearch,
    order,
    page,
    per_page,
  } = pixabayAPI;
  pixabayAPI.page = `${pageN}`;

  const response = await axios.get(
    `${baseUrl}?key=${key}&q=${searchQueryResult}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&order=${order}&page=${page}&per_page=${per_page}`
  );
  const results = response.data;

  const { totalHits } = results;
  const totalPages = Math.ceil(totalHits / per_page);

  if (totalHits === 0) {
    throw new Error();
  }

  if (page > totalPages) {
    iziToast.error({
      title: 'Error',
      message: "We're sorry, but you've reached the end of search results.",
    });
  }

  return results;
}

async function createMarkup(results) {
  markupData.markup = results.hits
    .map(
      hit =>
        `<a href="${hit.largeImageURL}" class="card-link js-card-link" ><div class="photo-card">
        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy"
        class="photo"/>
        <div class="info">
    <p class="info-item">
      <b>Likes:</b>${hit.likes}
    </p>
    <p class="info-item">
      <b>Views:</b>${hit.views}
    </p>
    <p class="info-item">
      <b>Comments:</b>${hit.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>${hit.downloads}
    </p>
  </div>
</div></a>`
    )
    .join('');

  return markupData.markup;
}
