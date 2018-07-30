import { MatImportsModule } from './mat-imports.module';

describe('MatImportsModule', () => {
  let matImportsModule: MatImportsModule;

  beforeEach(() => {
    matImportsModule = new MatImportsModule();
  });

  it('should create an instance', () => {
    expect(matImportsModule).toBeTruthy();
  });
});
