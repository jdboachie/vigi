// import React from 'react'

import { Button } from "./ui/button"
import { ModeToggle } from "./theme/theme-toggle"
import { CogIcon } from "@heroicons/react/16/solid"

const SettingsBar = () => {
  return (
    <nav
      className="p-1.5 max-h-[50px] flex justify-between border-t bg-primary-foreground"
    >
      <div className="p-1.5">
        <h1 className="text-lg font-bold"></h1>
      </div>
      <div className="flex gap-2 items-center">
        <Button
          variant={'ghost'}
          size={'icon'}
          >
          <CogIcon className="size-4" />
        </Button>
        <ModeToggle />
      </div>
    </nav>
  )
}

export default SettingsBar