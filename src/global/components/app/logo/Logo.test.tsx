import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Logo from './Logo';

function RenderLogo(): JSX.Element {
   return (
      <>
         <Logo size={360} />
      </>
   );
}

describe('Logo', () => {
   it('should render without crashing', () => {
      const { container } = render(<RenderLogo />);
      expect(container).toBeTruthy();
   });
});
