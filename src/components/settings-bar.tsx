// import React from 'react'

import { ModeToggle } from "./theme/theme-toggle"
import { SettingsView } from "./settings-view"

const SettingsBar = () => {
  return (
    <nav
      className="p-1.5 max-h-fit flex justify-between border-b"
    >
      <div className="p-1.5">
        <h1 className="text-lg font-bold"></h1>
      </div>
      <div className="flex gap-2 items-center">
        <SettingsView />
        <ModeToggle />
      </div>
    </nav>
  )
}

export default SettingsBar