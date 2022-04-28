import { FriendlySecondsPipe } from './friendly-seconds.pipe';

describe('FriendlySecondsPipe', () => {
  it('create an instance', () => {
    const pipe = new FriendlySecondsPipe();
    expect(pipe).toBeTruthy();
  });
});
