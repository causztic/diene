import Diene from '../diene';

let results;

beforeAll(async () => {
  results = await new Diene('rrreol999').getPosts(3);
});

test('it should get the latest posts', async () => {
  expect(results).toHaveLength(3);
});

test('it should format the data correctly', async () => {
  const result = results[0];

  expect(result.id).toBeDefined();
  expect(result.media).toBeDefined();
  expect(result.shortcode).toBeDefined();
  expect(result.type).toBeDefined();
});
