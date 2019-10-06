/* eslint-disable no-param-reassign */
const INSTAGRAM_AGENT = 'Instagram 10.26.0 (iPhone7,2; iOS 10_1_1; en_US; en-US; scale=2.00; gamut=normal; 750x1334) AppleWebKit/420+';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36';
const fetch = require('node-fetch');
const cheerio = require('cheerio');

export default class Diene {
  constructor(name, verbose = false) {
    this.name = name;
    this.verbose = verbose;
  }

  static getPostPage(text) {
    const $ = cheerio.load(text);
    const document = $('*')
      .contents()
      .filter((_index, element) => element.type === 'script')
      .get()
      .map((tag) => tag.children[0])
      .filter((child) => child && child.data && child.data.startsWith('window._sharedData'))[0].data;

    const result = JSON.parse(document.substring(document.indexOf('{'), document.length - 1));
    const [post] = result.entry_data.PostPage;
    const { edges } = post.graphql.shortcode_media.edge_sidecar_to_children;
    return edges;
  }

  getProfilePage(text) {
    const $ = cheerio.load(text);
    const document = $('*')
      .contents()
      .filter((_index, element) => element.type === 'script')
      .get()
      .map((tag) => tag.children[0])
      .filter((child) => child && child.data && child.data.startsWith('window._sharedData'))[0].data;

    if (this.verbose) {
      console.log(document);
    }

    const result = JSON.parse(document.substring(document.indexOf('{'), document.length - 1));
    const [profile] = result.entry_data.ProfilePage;
    const { edges } = profile.graphql.user.edge_owner_to_timeline_media;
    return edges;
  }

  static async updateSidecarPosts(posts) {
    await Promise.all(posts.map(async (post) => {
      if (post.type === 'GraphSidecar') {
        post.gallery = [];

        const response = await fetch(`https://www.instagram.com/p/${post.shortcode}`,
          { headers: { 'User-Agent': USER_AGENT } });
        const text = await response.text();
        const edges = this.getPostPage(text);

        edges.forEach((edge) => {
          const { id, shortcode, display_url: media, __typename: type } = edge.node;
          post.gallery.push({
            id,
            media,
            shortcode,
            type,
          });
        });
      }
      return post;
    }));

    return posts;
  }

  async getPosts(count = 3) {
    let posts = [];
    const response = await fetch(`https://www.instagram.com/${this.name}`,
      { headers: { 'User-Agent': USER_AGENT } });
    const text = await response.text();
    const edges = this.getProfilePage(text);

    edges.slice(0, count).forEach((edge) => {
      const { id, shortcode, display_url: media, __typename: type } = edge.node;
      posts.push({
        id,
        media,
        shortcode,
        type,
      });
    });

    posts = await Diene.updateSidecarPosts(posts);

    return posts;
  }
}
