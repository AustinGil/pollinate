import { JSDOM } from 'jsdom';
import { getMetadata, mail, totes, btoa } from './utils/index.js';
import { URL } from './config.js';

/**
 * TODOS:
 * Share with:
 * - Twitter
 * - LinkedIn
 * - Reddit
 * - HackerNews
 * - laarc
 * Publish to:
 * - Dev.to
 * - Medium
 * - Hashnode
 * - DZone
 * - Tealfeed
 * Email to various newsletters
 * Add more channels based on category
 */

/**
 * SETUP
 */
const { title, categories, content, description, imageUrl, tags } =
  await getMetadata(URL);
/**  */

/**
 * 📝
 */

const MEDIUM_TOKEN = process.env.MEDIUM_TOKEN;
const HASHNODE_TOKEN = process.env.HASHNODE_TOKEN;
const REDDIT_CLIENT = process.env.REDDIT_CLIENT;
const REDDIT_SECRET = process.env.REDDIT_SECRET;

const mediumApi = totes.create({
  baseUrl: 'https://api.medium.com',
  headers: {
    Authorization: `Bearer ${MEDIUM_TOKEN}`,
  },
});
const hashnodeApi = totes.create({ baseUrl: 'https://api.hashnode.com/' });
const hnApi = totes.create({ baseUrl: 'https://hacker-news.firebaseio.com/' });
const redditApi = totes.create({ baseUrl: 'https://reddit.com' });

// const { data: mediumMe } = await mediumApi.get('/v1/me');
// await mediumApi.post(`/v1/users/${mediumMe.data.id}/posts`, {
//   json: {
//     title: title,
//     contentFormat: 'html',
//     content: content,
//     canonicalUrl: url,
//     tags: [...categories, ...tags],
//     publishStatus: 'draft',
//   },
// });

// const r = await hashnodeApi.post('', {
//   body: JSON.stringify({
//     query: `query {
//       user(username: "austinGil") {
//         username
//       }
//     }`,
//   }),
// });
// console.log(r);

// https://www.reddit.com/api/v1/authorize?client_id=rwU5yQ9WUdlXhJktEfBoEg&response_type=code&state=RANDOM_STRING&redirect_uri=https%3A%2F%2Faustingil.com&duration=permanent&scope=submit

const REDDIT_CODE = process.env.REDDIT_CODE;

const r1 = await redditApi.post('/api/v1/access_token', {
  headers: {
    Authorization: `basic ${btoa(`${REDDIT_CLIENT}: ${REDDIT_SECRET}`)}`,
  },
  body: `grant_type=authorization_code&code=${REDDIT_CODE}&redirect_uri=https%3A%2F%2Faustingil.com`,
});

// const r = await redditApi.post('/api/submit', {
//   headers: {
//     'X-Modhash': '',
//   },
//   json: {
//     url: url,
//     api_type: 'json',
//     kind: 'link',
//     sendreplies: true,
//     // sr: ''
//     // text: raw markdown text
//     // title: title of the submission.up to 300 characters long
//   },
// });

console.log(r1);

/**
 * 💌
 *
 
const MAIL_ID = process.env.MAIL_ID;
const MAIL_SECRET = process.env.MAIL_SECRET;
 
const mailSubject = 'New blog post!';
const mailHtml = `<p>Hey friend,</p>
<p>Checkout my latest blog post</p>
</p><a href="${URL}">${title}</a></p>`;
const emailTo = ['hey@austingil.com'];
 
// const { data } = await totes
//   .post('https://api.sendpulse.com/oauth/access_token', {
//     json: {
//       grant_type: 'client_credentials',
//       client_id: MAIL_ID,
//       client_secret: MAIL_SECRET,
//     },
//   })
//   .catch((error) => {
//     return error.cause.json();
//   })
//   .then(console.log);
 
// console.log(data.access_token);
 
// await totes.post('https://api.sendpulse.com/smtp/emails', {
//   header: {
//     Authorization: `Bearer ${data.access_token}`,
//   },
//   json: {
//     email: {
//       html: mailHtml,
//       text: 'Example text',
//       subject: mailSubject,
//       from: {
//         name: 'Austin',
//         email: 'hey@austingil.com',
//       },
//       to: emailTo,
//     },
//   },
// });
for (const to of emailTo) {
  mail({
    subject: mailSubject,
    to: to,
    from: 'mail@something.com',
    html: mailHtml,
  });
}
 
/**
 */
