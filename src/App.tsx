import React, { useRef, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import useDatabase from './db';
import { Button } from './components/ui/button';
import { FieldDef } from 'pg';
import {
  TrashSimple as TrashIcon,
  Play as PlayIcon,
  Clock as ClockIcon,
  Table as TableIcon,
  Export as ExportIcon,
  UsersThree as UserGroupIcon,
  Plugs as PlugsIcon
} from '@phosphor-icons/react'
import SettingsBar from './components/settings-bar';
import { LoadingIcon } from './components/icons';
import { Badge } from './components/ui/badge';

const MyComponent = () => {
  const { query } = useDatabase()
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [outputData, setOutputData] = useState<{ columns: string[]; rows: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [code, setCode] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

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
          collapsible
          minSize={15}
          maxSize={20}
          defaultSize={20}
          collapsedSize={2.75}
          onCollapse={() => {setIsCollapsed(true)}}
          onExpand={() => {setIsCollapsed(false)}}
          className='transition-all duration-250 ease-in-out p-2 flex flex-col gap-2'
        >
          <Button
            variant={'ghost'}
            size={isCollapsed ? 'icon' : 'sm'}
            className={`flex ${!isCollapsed && 'justify-start gap-2'}`}
          >
            <UserGroupIcon weight='fill' className='size-4' />
            <p className={isCollapsed ? 'hidden': 'flex'}>Administration</p>
          </Button>
          <Button
            variant={'default'}
            size={isCollapsed ? 'icon' : 'sm'}
            className={`flex ${!isCollapsed && 'justify-start gap-2'}`}
          >
            <PlayIcon weight='fill' className='size-4' />
            <p className={isCollapsed ? 'hidden': 'flex'}>Query Runner</p>
          </Button>
          <Button
            variant={'ghost'}
            size={isCollapsed ? 'icon' : 'sm'}
            className={`flex ${!isCollapsed && 'justify-start gap-2'}`}
          >
            <TableIcon weight='fill' className='size-4' />
            <p className={isCollapsed ? 'hidden': 'flex'}>Schema Editor</p>
          </Button>
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className='active:bg-primary hover:bg-primary active:outline hover:outline active:outline-primary hover:outline-primary active:outline-1 hover:outline-1'
        />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical" className='w-full flex flex-col h-full'>
            <ResizablePanel
              minSize={20}
              defaultSize={50}
            >
              <div className="border-b flex gap-2 p-2 justify-between">
                <Button size={'icon'} variant={'outline'}>
                  <ExportIcon className='size-4' />
                </Button>
                <Badge variant={'secondary'}><PlugsIcon size={16} className='mr-2' />Status <div className='size-3 animate-pulse rounded-full bg-green-500 ml-2' /></Badge>
              </div>
              <div className={`dark:bg-darkest bg-secondary text-xs overflow-auto h-[calc(100%-49px)]`}>
                {outputData && (
                  <table className='table-auto bg-background w-fit h-fit text-left border-collapse transition-all duration-300 ease-in-out'>
                    <thead className='sticky top-[-1px] bg-background drop-shadow max-h-[1rem] min-h-[1rem]'>
                      <tr className='truncate'>
                        {outputData.columns.map((col, index) => (
                          <th key={index} className='border border-t-none p-2 min-w-[10rem] w-[10rem] max-w-[10rem]'>{col}</th>
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
                {!outputData && <p className='p-2 size-full flex text-foreground/70 items-center justify-center'>No data to display</p>}
              </div>
            </ResizablePanel>
            <ResizableHandle
              withHandle
              className='active:bg-primary hover:bg-primary active:outline hover:outline active:outline-primary hover:outline-primary active:outline-1 hover:outline-1' />
            <ResizablePanel
              defaultSize={50}
              minSize={20}
              // className='min-w-fit'
            >
              <form onSubmit={handleSubmit} className='flex flex-col size-full'>
                <div className="flex justify-between gap-2 p-1 border-b">
                  <div className="flex gap-2 p-1">
                    <Button disabled size={'icon'} variant={'outline'}>
                      <ClockIcon className='size-4' />
                    </Button>
                  </div>
                  <div className="flex gap-2 p-1">
                    <Button disabled={isLoading} size={'icon'} className='flex' type='reset' onClick={() => {setIsLoading(false)}} variant={'outline'}>
                      {/* Reset */}
                      <TrashIcon className='size-4' />
                    </Button>
                    <Button disabled={isLoading} size={'icon'} className='flex' type='submit'>
                      {/* Run */}
                      {isLoading ? (
                        <LoadingIcon className='size-4'/>
                      ) : (
                        <PlayIcon weight='fill' className='size-4'/>
                      )}
                    </Button>
                  </div>
                </div>
                <CodeEditor
                  ref={inputRef}
                  value={code}
                  language="sql"
                  minHeight={1}
                  placeholder="Enter sql query ..."
                  onChange={(event) => setCode(event.target.value)}
                  className={`${isLoading && 'opacity-50'} overflow-scroll bg-secondary dark:bg-darkest font-cascadia text-sm dark:text-primary flex grow transition-all duration-300 ease-in-out resize-none text-pretty`}
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
