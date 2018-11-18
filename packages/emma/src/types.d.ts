declare module 'ink' {
  import { Context, ReactElement } from 'react'

  /**
   * Components
   */

  /**
   * Box
   */
  interface BoxProps {
    // Pading
    paddingTop?: number
    paddingBottom?: number
    paddingLeft?: number
    paddingRight?: number
    paddingX?: number
    paddingY?: number
    padding?: number
    // Margin
    marginTop?: number
    marginBottom?: number
    marginLeft?: number
    marginRight?: number
    marginX?: number
    marginY?: number
    margin?: number
    // Flex
    flexGrow?: number
    flexShrink?: number
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    alignItems?: 'flex-start' | 'center' | 'flex-end'
    justifyContent?:
      | 'flex-start'
      | 'center'
      | 'flex-end'
      | 'space-between'
      | 'space-around'
  }
  export class Box extends React.Component<BoxProps> {}

  /**
   * Text
   */
  interface TextProps {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
  }
  export class Text extends React.Component<TextProps> {}

  /**
   * Color
   */
  interface ColorProps {
    hex?: string
    hsl?: string[]
    hsv?: string[]
    hwb?: string[]
    rgb?: string[]
    keyword?: string
    bgHex?: string
    bgHsl?: string[]
    bgHsv?: string[]
    bgHwb?: string[]
    bgRgb?: string[]
    bgKeyword?: string
  }
  export class Color extends React.Component<ColorProps> {}

  /**
   * Static
   */
  interface StaticProps {}
  export class Static extends React.Component<StaticProps> {}

  /**
   * Context
   */

  /**
   * StdinContext
   */
  interface StdinContextProps {
    stdin: ReadableStream
    setRawMode: (isEnable: boolean) => void
  }
  export interface StdinContext extends React.Context<StdinContextProps> {}

  /**
   * StdoutContext
   */
  interface StdoutContextProps {
    stdout: WritableStream
  }
  export interface StdoutContext extends React.Context<StdoutContextProps> {}

  /**
   * Render
   */

  /**
   *
   * render to stdout, stdin
   *
   * @param tree
   * @param options
   */
  export function render<P>(
    tree: ReactElement<P>,
    options?: InkRenderOptions,
  ): () => void

  export interface InkRenderOptions {
    stdout?: WritableStream
    stdin?: ReadableStream
    debug?: boolean
  }

  export function renderToString<P>(tree: ReactElement<P>): string
}
