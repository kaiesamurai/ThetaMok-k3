import type { TContractType } from '@defibuilder/sdk';
import type { LucideIcon } from 'lucide-react';

import { BadgeCent, BookHeart, Brush, Coins, Store, Vault } from 'lucide-react';

import {
  predefinedEditionPrompts,
  predefinedExchangePrompts,
  predefinedMarketplacePrompts,
  predefinedNftPrompts,
  predefinedTokenPrompts,
  predefinedVaultPrompts,
  TPrompt
} from './prompt';

export type TTemplate = {
  name: TContractType;
  icon: LucideIcon;
  predefinedPrompts: TPrompt[];
  description: string;
};

export const templates: TTemplate[] = [
  {
    name: 'Token',
    icon: BadgeCent,
    predefinedPrompts: predefinedTokenPrompts,
    description: 'Create a ERC20 token contract'
  },
  {
    name: 'NFT',
    icon: Brush,
    predefinedPrompts: predefinedNftPrompts,
    description: 'Create a ERC721 token contract'
  },
  {
    name: 'Edition',
    icon: BookHeart,
    predefinedPrompts: predefinedEditionPrompts,
    description: 'Create a ERC1155 token contract'
  },
  {
    name: 'Vault',
    icon: Vault,
    predefinedPrompts: predefinedVaultPrompts,
    description: 'Create a vault contract'
  },
  {
    name: 'Marketplace',
    icon: Store,
    predefinedPrompts: predefinedMarketplacePrompts,
    description: 'Create a marketplace contract'
  },
  {
    name: 'Exchange',
    icon: Coins,
    predefinedPrompts: predefinedExchangePrompts,
    description: 'Create a DEX contract'
  }
];
