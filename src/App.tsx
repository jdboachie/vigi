import React, { useRef, useState } from 'react';
// import Textarea from 'react-textarea-autosize';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import * as db from '@/db';
import { Button } from './components/ui/button';
import { FieldDef } from 'pg';
import { ArrowPathIcon, PlayIcon } from '@heroicons/react/16/solid';
import SettingsBar from './components/settings-bar';
import { toast } from 'sonner';

const MyComponent = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [outputData, setOutputData] = useState<{ columns: string[]; rows: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)
    if (inputRef.current) {
      const currentInput = inputRef.current.value;
      try {
        const result = await db.query(currentInput);
        console.log(result)
        const columnNames = result!.fields.map((field: FieldDef) => field.name);

        const outputData = {
          columns: columnNames,
          rows: result!.rows,
        };
        setOutputData(outputData);

      } catch (error) {
        toast.error('Error executing query:', {
          description: error!.toString(),
        })
        console.error('Error executing query:', error);
        setError(error!.toString() || 'An error occurred');
        setOutputData(null);
      }
    }
    setIsLoading(false)
  };

  return (
    <main className='flex flex-col h-screen w-screen font-cascadia'>
      <SettingsBar />
      <ResizablePanelGroup direction="vertical" className='w-screen grid row-span-11 h-full'>
        <ResizablePanel
          defaultSize={60}
          // minSize={600}
          maxSize={70}
          // className='overflow-y-scroll'
        >
          <div className={`grid row-span-8 bg-background text-xs h-full overflow-auto`}>
            {outputData && (
              <table className='table-auto w-full text-left border-collapse transition-all duration-300 ease-in-out'>
                <thead className='sticky font-sans top-[-1px] bg-background drop-shadow'>
                  <tr>
                    {outputData.columns.map((col, index) => (
                      <th key={index} className='border p-2'>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {outputData.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className='max-h-[50px] min-h-[50px] transition-all duration-300 ease-in-out'
                    >
                      {outputData.columns.map((col, colIndex) => (
                        <td
                          key={colIndex}

                          className='min-w-[100px] w-[100px] max-w-[100px] truncate
                                    border hover:border-double hover:border-primary
                                    whitespace-nowrap p-2 hover:bg-secondary'
                        >
                          {row[col] instanceof Date ? row[col].toString() : row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!outputData && <p className='p-2'>No data to display</p>}
          </div>
          <div className="">{error}</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={40}
          minSize={10}
          maxSize={95}
          // className='min-w-fit'
        >
          <form onSubmit={handleSubmit} className='flex flex-col size-full gap-2 p-2'>
            <div className="flex justify-end gap-2 p-1">
              <div className="flex gap-2 p-1">{isLoading && 'Loading...'}</div>
              <div className="flex gap-2 p-1">
                <Button className='flex gap-2' type='reset' onClick={() => {setIsLoading(false)}} variant={'outline'} size={'sm'}>
                  Reset
                  <ArrowPathIcon className='size-4' />
                </Button>
                <Button className='flex gap-2' type='submit' size={'sm'}>
                  Run
                  <PlayIcon className='size-4'/>
                </Button>
              </div>
            </div>
            <textarea
              id=""
              name=""
              ref={inputRef}
              placeholder='Enter sql query...'
              spellCheck={false}
              className='flex grow bg-primary-foreground focus:outline-none h-full rounded w-full transition-all duration-300 ease-in-out overflow-auto resize-none sm:text-sm p-2 text-pretty'
            />
          </form>
        </ResizablePanel>
      </ResizablePanelGroup>


    </main>
  );
};

export default MyComponent;
