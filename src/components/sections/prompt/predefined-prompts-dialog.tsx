import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { TPrompt } from '@/lib/prompt';

import { Button } from '../../ui/button';

type TPredefinedPromptsDialogProperties = {
  predefinedPrompts: TPrompt[];
  setUserPrompt: React.Dispatch<React.SetStateAction<string>>;
  isDisabled?: boolean;
};

export default function PredefinedPromptsDialog({
  predefinedPrompts,
  setUserPrompt,
  isDisabled
}: TPredefinedPromptsDialogProperties) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => {
        setIsDialogOpen(!isDialogOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant='secondary' className='w-full md:w-auto' disabled={isDisabled}>
          Predefined Prompts
        </Button>
      </DialogTrigger>

      <DialogContent className='max-h-[calc(100%-5rem)] overflow-y-auto'>
        <DialogHeader className='flex gap-y-5'>
          <DialogTitle>Predefined Prompts</DialogTitle>
        </DialogHeader>

        <ul className='flex flex-col gap-y-2.5'>
          {predefinedPrompts.map((prompt, index) => (
            <li key={`${prompt.template}-${index}`} className='w-full'>
              <Button
                variant='secondary'
                className='flex h-min w-full flex-col items-start justify-start gap-y-1 whitespace-normal p-2.5 text-left'
                onClick={() => {
                  setUserPrompt(prompt.content);
                  setIsDialogOpen(false);
                }}
              >
                <span className='font-medium'>{prompt.title}</span>
                <span className='text-muted-foreground'>{prompt.content}</span>
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
