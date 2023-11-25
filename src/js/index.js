import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'izitoast/dist/css/iziToast.min.css';
import iziToast from 'izitoast';
import { searchImages } from './pixabayApi';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('search-form');
  const gallery = document.querySelector('.gallery');
  const lightbox = new SimpleLightbox('.gallery a');
  let currentPage = 1;
  let searchQuery = '';
  let observer;

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    searchQuery = this.elements.searchQuery.value.trim();

    if (!searchQuery) {
      showErrorMessage('Please enter a search query');
      return;
    }
    gallery.addEventListener('click', function (event) {
      if (event.target.classList.contains('js-card-link')) {
        event.preventDefault();
        lightbox.open();
      }
    });

    gallery.innerHTML = '';
    observer = new IntersectionObserver(handleIntersection, { threshold: 0.2 });

    try {
      const images = await searchImages(searchQuery, currentPage);

      if (images.length === 0) {
        showInfoMessage(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImages(images, gallery);
        lightbox.refresh();
        observer.observe(gallery);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      showErrorMessage(
        'An error occurred while fetching images. Please try again later.'
      );
    }
  });

  function handleIntersection(entries) {
    if (entries[0].isIntersecting) {
      loadMoreImages();
    }
  }

  async function loadMoreImages() {
    currentPage += 1;
    observer.disconnect();

    try {
      const images = await searchImages(searchQuery, currentPage);

      if (images.length > 0) {
        renderImages(images, gallery);
        lightbox.refresh();
        observer.observe(gallery);
      }
    } catch (error) {
      console.error('Error fetching more images:', error);
      showErrorMessage(
        'An error occurred while fetching more images. Please try again later.'
      );
    }
  }

  function renderImages(images, container) {
    const markup = createMarkup({ hits: images });
    container.innerHTML += markup;
  }

  function createMarkup(results) {
    const { hits } = results;
    return hits
      .map(
        hit => `
        <a href="${hit.largeImageURL}" class="card-link js-card-link">
          <div class="photo-card">
            <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" class="photo"/>
            <div class="info">
              <p class="info-item"><b>Likes:</b>${hit.likes}</p>
              <p class="info-item"><b>Views:</b>${hit.views}</p>
              <p class="info-item"><b>Comments:</b>${hit.comments}</p>
              <p class="info-item"><b>Downloads:</b>${hit.downloads}</p>
            </div>
          </div>
        </a>
      `
      )
      .join('');
  }

  function showErrorMessage(message) {
    iziToast.error({
      title: 'Error',
      message: message,
    });
  }

  function showInfoMessage(message) {
    iziToast.info({
      title: 'Info',
      message: message,
    });
  }
});
