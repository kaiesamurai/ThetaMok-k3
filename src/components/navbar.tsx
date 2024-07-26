import { Link } from 'react-router-dom';

import defiBuilderLogo from '../assets/images/defi-builder-logo.png';

export default function Navbar() {
  return (
    <nav className='flex h-24 w-full justify-center border-b border-border px-2.5 xl:px-0'>
      <div className='flex h-full w-full max-w-[1100px] items-center justify-between'>
        <Link to='/' className='flex items-center space-x-2'>
          <img src={defiBuilderLogo} alt="DeFi Builder's logo" className='h-6' />
        </Link>

        {/* @ts-expect-error/next-line */}
        <w3m-button />
      </div>
    </nav>
  );
}
