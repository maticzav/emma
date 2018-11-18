import * as React from 'react'

export interface IBoilerplate {
  name: string
  description: string
  url: string
}

/**
 *
 * Main component definition.
 *
 */
interface BoilerplateInstallerProps {
  onComplete: (boilerplate: IBoilerplate) => void
}

class BoilerplateInstaller extends React.Component<BoilerplateInstallerProps> {}

export function boilerplateInstaller(
  onComplete?: (boilerplate: IBoilerplate) => void,
) {
  return <BoilerplateInstaller onComplete={onComplete} />
}
