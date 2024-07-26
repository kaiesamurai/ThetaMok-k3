import { TTemplate } from '@/lib/template';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import SectionContainer from './container';
import SectionHeader from './header';

type TTemplatesSectionProperties = {
  templates: TTemplate[];
  activeTemplateName: string;
  onActiveTemplateChange: (template: TTemplate) => void;
  isDisabled?: boolean;
};

export default function TemplatesSection({
  activeTemplateName,
  templates,
  onActiveTemplateChange,
  isDisabled
}: TTemplatesSectionProperties) {
  return (
    <SectionContainer className='gap-y-5'>
      <SectionHeader>
        <div className='flex flex-col'>
          <h3 className='text-xl font-semibold md:text-2xl lg:text-3xl'>Select template</h3>
          <h4 className='text-base font-medium text-muted-foreground md:text-lg'>
            Choose modules to activate on your project
          </h4>
        </div>
      </SectionHeader>

      <ul className='flex w-full flex-col gap-5 lg:flex-row'>
        {templates.map((template) => (
          <li key={template.name} className='w-full lg:aspect-square lg:w-1/6'>
            <Button
              variant='outline'
              className={cn(
                'flex h-max w-full flex-col items-center gap-y-2.5 whitespace-normal rounded-3xl border-2 p-2.5 text-center lg:h-full lg:p-1',
                {
                  'border-primary hover:bg-background': activeTemplateName === template.name
                }
              )}
              onClick={() => onActiveTemplateChange(template)}
              disabled={isDisabled}
            >
              <template.icon className='h-7 w-7 shrink-0' />
              <span className='text-lg font-medium'>{template.name}</span>
              <span className='text-sm text-muted-foreground'>{template.description}</span>
            </Button>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
