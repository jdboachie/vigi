import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useState } from "react";
import {
  PlayIcon,
  TableCellsIcon,
  InformationCircleIcon,
} from '@heroicons/react/16/solid'
import { Button } from './components/ui/button';
import SettingsBar from './components/settings-bar';
import QueryTool from "./components/tools/query-tool";


const App = () => {
  const [tab, setTab] = useState<'QueryToolTab'|'AdministrationTab'|'SchemaEditorTab'>('QueryToolTab')
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

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
          maxSize={15}
          defaultSize={2}
          collapsedSize={2}
          onCollapse={() => {setIsCollapsed(true)}}
          onExpand={() => {setIsCollapsed(false)}}
          className={`${isCollapsed && 'items-center px-2.5'} transition-all duration-250 ease-in-out p-2 flex flex-col gap-1.5`}
        >
          <Button
            variant={tab === 'AdministrationTab' ? 'secondary' : 'ghost'}
            size={isCollapsed ? 'icon' : 'sm'}
            onClick={() => {setTab('AdministrationTab')}}
            className={`flex ${!isCollapsed && 'justify-start gap-2'}`}
          >
            <InformationCircleIcon  className='min-w-4 size-4' />
            <p className={isCollapsed ? 'hidden': 'flex truncate'}>Database Info</p>
          </Button>
          <Button
            variant={tab === 'QueryToolTab' ? 'secondary' : 'ghost'}
            size={isCollapsed ? 'icon' : 'sm'}
            onClick={() => {setTab('QueryToolTab')}}
            className={`flex ${!isCollapsed && 'justify-start gap-2'}`}
          >
            <PlayIcon  className='min-w-4 size-4' />
            <p className={isCollapsed ? 'hidden': 'flex truncate'}>Query Tool</p>
          </Button>
          <Button
            variant={tab === 'SchemaEditorTab' ? 'secondary' : 'ghost'}
            size={isCollapsed ? 'icon' : 'sm'}
            onClick={() => {setTab('SchemaEditorTab')}}
            className={`flex ${!isCollapsed && 'justify-start gap-2'}`}
          >
            <TableCellsIcon  className='min-w-4 size-4' />
            <p className={isCollapsed ? 'hidden': 'flex truncate'}>Schema Editor</p>
          </Button>
        </ResizablePanel>
        <ResizableHandle
          className='active:bg-primary hover:bg-primary active:outline hover:outline active:outline-primary hover:outline-primary active:outline-1 hover:outline-1'
        />
        <ResizablePanel defaultSize={83}>
          <ResizablePanelGroup direction="horizontal">
            {tab === 'QueryToolTab' && <QueryTool />}
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default App;
