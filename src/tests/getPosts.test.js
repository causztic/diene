import Diene from '../diene';

test('it should get the latest posts', async () => {
  const results = await new Diene('rrreol999').getPosts(3);
  expect(results).toHaveLength(3);
});
