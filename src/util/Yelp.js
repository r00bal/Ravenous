import {Client} from './secret.js';

let accessToken;
const cors = 'https://cors-anywhere.herokuapp.com/';
const CLIENT_ID = Client.Id;
const CLIENT_SECRET = Client.Secret;

const Yelp = {
  getAccessToken() {
    if (accessToken) {
      return new Promise(resolve => resolve(accessToken));
    };
    const init = {
      method:'POST';
    };

    let urlToFetch = `${cors}https://api.yelp.com/oauth2/token?grant_type=client_credentials`;
        urlToFetch += `&client_id=${CLIENT_ID}`;
        urlToFetch += `&client_secret=${CLIENT_SECRET}`;
    const request = new Request(urlToFetch, init);

    return fetch(request).then(response => {
      return response.json()
    }).then(jsonResponse => {
      accessToken = jsonResponse.access_token;
    })
  }

  search(term, location, sortBy) {
    let urlToFetch = `${cors}https://api.yelp.com/v3/businesses/search`;
    urlToFetch += `?term=${term}`;
    urlToFetch += `&location=${location}`;
    urlToFetch += `&sort_by=${sortBy}`;

    const headers = new Headers({
     Authorization: `Bearer ${accessToken}`
   });
   const init = {
     headers : headers;
   }
   const request = new Request(urlToFetch, init);
    return Yelp.getAccessToken()
    .then(() => {
      return fetch(urlToFetch)
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      console.log(jsonResponse);
      if (jsonResponse.businesses) {
        return jsonResponse.businesses.map(business => {
          id: business.id,
          imageSrc: business.image_url,
          name: business.name,
          address: business.location.address1,
          city: business.location.city,
          state: business.location.state,
          zipCode: business.location.zip_code,
          category:business.categories[0].title,
          rating: business.rating,
          reviewCount: business.review_count
        });
      }
    })
  }
}
