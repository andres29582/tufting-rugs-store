import { renderHomePage } from '../pages/HomePage/HomePage.js';

export async function createApp({ root }) {
  if (!root) {
    throw new Error('App root element was not found.');
  }

  const homePage = await renderHomePage();
  root.replaceChildren(homePage.element);
  homePage.mount();
}
