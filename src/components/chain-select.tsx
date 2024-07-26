import Img from '@/components/img';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import TChain from '@/lib/chains';

type TChainSelectProperties = {
  chains: TChain[];
  activeChain: TChain;
  setActiveChain: React.Dispatch<React.SetStateAction<TChain>>;
};

export default function ChainSelect({
  chains,
  activeChain,
  setActiveChain
}: TChainSelectProperties) {
  async function onActiveChainChange(chainName: string) {
    const newActiveChain = chains.find((chain) => chain.name === chainName);

    if (newActiveChain) {
      setActiveChain(newActiveChain);
    }
  }

  return (
    <Select value={activeChain.name} onValueChange={onActiveChainChange}>
      <SelectTrigger className='w-full md:w-48'>
        <SelectValue
          placeholder={
            activeChain ? (
              <div className='flex items-center gap-x-2.5'>
                <Img
                  src={activeChain.logo}
                  alt={`${activeChain.name}'s logo`}
                  width={20}
                  height={20}
                  className='h-5 w-5 rounded-full'
                />
                <p>{activeChain.name}</p>
              </div>
            ) : (
              <p>Select chain</p>
            )
          }
        />
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem key={chain.name} value={chain.name}>
            <div className='flex items-center gap-x-2.5'>
              <Img
                src={chain.logo}
                alt={`${chain.name}'s logo`}
                width={20}
                height={20}
                className='h-5 w-5 rounded-full'
              />
              <p>{chain.name}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
