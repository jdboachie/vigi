import React, { useRef, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import useDatabase from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { FieldDef } from 'pg';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  TrashIcon,
  PlayIcon,
  ClockIcon,
  ArrowUpOnSquareIcon,
} from '@heroicons/react/20/solid'
import { LoadingIcon } from '@/components/icons';
import { FileSql, FolderPlus, FilePlus } from '@phosphor-icons/react';
import { toast } from 'sonner';


const QueryTool = () => {
  const { query } = useDatabase()
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [outputData, setOutputData] = useState<{ columns: { name: string, type: number }[]; rows: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [code, setCode] = useState<string>('')
  const [queryCompletionTime, setQueryCompletionTime] = useState<number | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)
    if (inputRef.current) {
      const currentInput = inputRef.current.value;
      try {
        const result = await query(currentInput);
        setQueryCompletionTime(result!.time)
        const columns = result!.output!.fields.map((field: FieldDef) => ({ name: field.name, type: field.dataTypeID }));

        const outputData = {
          columns: columns,
          rows: result!.output!.rows,
        };
        setOutputData(outputData);

      } catch (error) {
        setOutputData(null);
      }
    }
    setIsLoading(false)
  };

  return (
    <>
      <ResizablePanel
        minSize={15}
        maxSize={30}
        defaultSize={30}
        className='flex flex-col gap-2'
      >
        <div className="">
          <Accordion type="single" collapsible>
            <AccordionItem value="files" className='p-2'>
              <div className="flex justify-between">
                <div className="grid w-full col-span-3">
                  <AccordionTrigger className='size-full'>
                    <div className="flex items-center pl-2 justify-between w-full">
                      <span>Files</span>
                    </div>
                  </AccordionTrigger>
                </div>
                <div className="grid grid-flow-col justify-items-end gap-1">
                  <Button
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => {toast.info('This will create a new file')}}
                    >
                    <FilePlus className='size-4'/>
                  </Button>
                  <Button
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => {toast.info('This will create a new folder')}}
                    >
                    <FolderPlus size={96} className='size-4'/>
                  </Button>
                </div>
              </div>
              <AccordionContent className='grid pt-2'>
                <Button variant={'ghost'} className='justify-start gap-2'>
                  <FileSql size={16} weight='fill' />
                  new.sql
                </Button>
                <Button variant={'ghost'} className='justify-start gap-2'>
                  <FileSql size={16} weight='fill' />
                  alltables.sql
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ResizablePanel>
      <ResizableHandle
        className='active:bg-primary hover:bg-primary active:outline hover:outline active:outline-primary hover:outline-primary active:outline-1 hover:outline-1'
      />
      <ResizablePanel defaultSize={75}>
        <ResizablePanelGroup direction="vertical" className='w-full flex flex-col h-full'>
          <ResizablePanel
            defaultSize={50}
            minSize={20}
          >
            <form onSubmit={handleSubmit} className='flex flex-col size-full'>
              <div className="flex justify-between gap-2 p-1 border-b">
                <div className="flex gap-2 p-1">
                  <Button disabled size={'icon'} variant={'outline'}>
                    <ClockIcon className='size-4' />
                  </Button>
                </div>
                <div className="flex gap-2 p-1">
                  <Button
                    disabled={isLoading}
                    size={'icon'}
                    className='flex'
                    type='reset'
                    onClick={() => {
                      setCode('')
                      setOutputData(null)
                    }}
                    variant={'outline'}
                  >
                    <TrashIcon className='size-4' />
                  </Button>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        disabled={isLoading}
                        size={'icon'}
                        className='flex'
                        type='submit'
                      >
                        {isLoading ? (
                          <LoadingIcon className='size-4'/>
                        ) : (
                          <PlayIcon  className='size-4'/>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Run query
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <CodeEditor
                ref={inputRef}
                value={code}
                language="sql"
                minHeight={1}
                placeholder="Enter sql query ..."
                onChange={(event) => setCode(event.target.value)}
                disabled={isLoading}
                className={`${isLoading && 'opacity-50'} overflow-scroll text-sm font-cascadia dark:text-primary flex grow transition-all duration-300 ease-in-out resize-none text-pretty`}
                />
            </form>
          </ResizablePanel>
          <ResizableHandle
            withHandle
            className='active:bg-primary hover:bg-primary active:outline hover:outline active:outline-primary hover:outline-primary active:outline-1 hover:outline-1'
          />
          <ResizablePanel
            minSize={20}
            defaultSize={50}
          >
            <div className="border-b flex gap-2 p-2 justify-between">
              <Button size={'icon'} variant={'outline'}>
                <ArrowUpOnSquareIcon className='size-4' />
              </Button>
            </div>
            <div className={`dark:bg-darkest bg-secondary overflow-auto h-[calc(100%-49px)]`}>
              {outputData && (
                <table className='table-auto bg-background w-fit h-fit text-left border-collapse transition-all duration-300 ease-in-out'>
                  <thead className='sticky top-[-1px] bg-background drop-shadow max-h-[1rem] min-h-[1rem]'>
                    <tr className='truncate'>
                      {outputData.columns.map((col, index) => (
                        <th key={index} className='border border-t-none p-2 min-w-[10rem] w-[10rem] max-w-[10rem]'>
                          {col.name} <br /> <span className='text-xs text-foreground/70'>({col.type})</span>
                        </th>
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
                            {row[col.name] instanceof Date ? row[col.name].toString() : row[col.name]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!outputData && <p className='p-2 size-full flex text-foreground/70 items-center justify-center'>No data to display</p>}
            </div>
          </ResizablePanel>
          <div className="border-t flex w-full bg-primary-foreground p-1 gap-2">
            <p>Num rows: {outputData?.rows.length}</p>
            <p>Num columns: {outputData?.columns.length}</p>
            <p>Query completed in {queryCompletionTime ? queryCompletionTime : '---'}ms</p>
          </div>
        </ResizablePanelGroup>
      </ResizablePanel>
    </>
  )
}

export default QueryTool