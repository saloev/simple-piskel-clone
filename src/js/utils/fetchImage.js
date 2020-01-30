import API_ACCESS_KEY from '../config/config';

const fetchData = async (url) => {
  const response = await fetch(url);
  const toJson = await response.json();
  return toJson;
};

export default function fetchImage(town = 'Minsk') {
  const url = `https://api.unsplash.com/photos/random?query=town,${town}&client_id=${API_ACCESS_KEY}`;
  return fetchData(url);
}
