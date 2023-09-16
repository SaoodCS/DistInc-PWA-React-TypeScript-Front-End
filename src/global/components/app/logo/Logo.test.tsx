import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Logo from './Logo';

function RenderLogo(): JSX.Element {
   return (
      <>
         <Logo size={'360px'} />
      </>
   );
}

describe('Logo', () => {
   it('should render without crashing', () => {
      const { container } = render(<RenderLogo />);
      expect(container).toBeTruthy();
   });
});
