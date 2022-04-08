import { PrettifyArrayPipe } from './prettify-array.pipe';

describe('PrettifyArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new PrettifyArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
