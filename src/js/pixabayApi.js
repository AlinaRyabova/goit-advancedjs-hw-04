import axios from 'axios';

export async function searchImages(searchQuery, page) {
  const API_KEY = `40817348-8cf9cc617061525653a12724b`;
  const URL = `https://pixabay.com/api/`;
  const per_page = 40;

  try {
    const response = await axios.get(URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: `photo`,
        orientation: `horizontal`,
        safesearch: true,
        order: `popular`,
        page: page,
        per_page: per_page,
      },
    });

    return response.data.hits;
  } catch (error) {
    throw error;
  }
}
