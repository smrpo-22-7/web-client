import { NgForTrackByIdDirective } from './base-type-track-by.directive';

describe('BaseEntityTrackByDirective', () => {
  it('should create an instance', () => {
    const directive = new NgForTrackByIdDirective();
    expect(directive).toBeTruthy();
  });
});
