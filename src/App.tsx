import React, { useRef, useState } from 'react';
// import Textarea from 'react-textarea-autosize';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import useDatabase from './db';
import { Button } from './components/ui/button';
import { FieldDef } from 'pg';
import { ArrowPathIcon, PlayIcon } from '@heroicons/react/16/solid';
import SettingsBar from './components/settings-bar';
import { LoadingIcon } from './components/icons';

const MyComponent = () => {
  const { query } = useDatabase()
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [outputData, setOutputData] = useState<{ columns: string[]; rows: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)
    if (inputRef.current) {
      const currentInput = inputRef.current.value;
      const result = await query(currentInput);
      try {
        const columnNames = result!.fields.map((field: FieldDef) => field.name);

        const outputData = {
          columns: columnNames,
          rows: result!.rows,
        };
        setOutputData(outputData);

      } catch (error) {
        setOutputData(null);
      }
    }
    setIsLoading(false)
  };

  return (
    <main className='flex flex-col h-screen w-screen'>
      <SettingsBar />
      <ResizablePanelGroup
        direction="horizontal"
        className='w-screen grid h-full'
      >
        <ResizablePanel
          defaultSize={20}
          minSize={3}
          maxSize={20}
          className='p-2 flex flex-col gap-2'
        >
          <Button variant={'secondary'} className='flex justify-start'>Query runner</Button>
          <Button variant={'ghost'} className='flex justify-start'>Administration</Button>
          <Button variant={'ghost'} className='flex justify-start'>Schema Editor</Button>
          <Button variant={'ghost'} className='flex justify-start'>History</Button>
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className='active:bg-primary hover:bg-primary active:outline hover:outline active:outline-primary hover:outline-primary active:outline-1 hover:outline-1'
        />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical" className='w-screen grid row-span-11 h-full'>
            <ResizablePanel
              defaultSize={50}
              // minSize={600}
              maxSize={70}
              // className='overflow-y-scroll'
            >
              <div className={`grid row-span-8 bg-background text-xs h-full overflow-auto`}>
                {outputData && (
                  <table className='table-auto dev w-fit h-fit text-left border-collapse transition-all duration-300 ease-in-out'>
                    <thead className='sticky top-[-1px] bg-background drop-shadow'>
                      <tr>
                        {outputData.columns.map((col, index) => (
                          <th key={index} className='border border-t-none p-2'>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {outputData.rows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className='max-h-[1rem] min-h-[1rem] transition-all duration-300 ease-in-out'
                        >
                          {outputData.columns.map((col, colIndex) => (
                            <td
                              key={colIndex}

                              className='min-w-[10rem] w-[10rem] max-w-[10rem] truncate
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
            </ResizablePanel>
            <ResizableHandle
              withHandle
              className='active:bg-primary hover:bg-primary active:outline hover:outline active:outline-primary hover:outline-primary active:outline-1 hover:outline-1' />
            <ResizablePanel
              defaultSize={50}
              minSize={10}
              maxSize={95}
              // className='min-w-fit'
            >
              <form onSubmit={handleSubmit} className='flex flex-col size-full'>
                <div className="flex justify-end gap-2 p-1 border-b">
                  <div className="flex gap-2 p-1">
                    <Button disabled={isLoading} size={'icon'} className='flex' type='reset' onClick={() => {setIsLoading(false)}} variant={'outline'}>
                      {/* Reset */}
                      <ArrowPathIcon className='size-4' />
                    </Button>
                    <Button disabled={isLoading} size={'icon'} className='flex' type='submit'>
                      {/* Run */}
                      {isLoading ? (
                        <LoadingIcon className='size-4'/>
                      ) : (
                        <PlayIcon className='size-4'/>
                      )}
                    </Button>
                  </div>
                </div>
                <textarea
                  id=""
                  name=""
                  ref={inputRef}
                  placeholder='Enter SQL query...'
                  spellCheck={false}
                  className={`${isLoading && 'opacity-50'} px-4 bg-secondary dark:bg-black font-cascadia text-base flex grow focus:outline-none h-full w-full transition-all duration-300 ease-in-out overflow-auto resize-none p-2 text-pretty`}
                />
              </form>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

    </main>
  );
};

export default MyComponent;
