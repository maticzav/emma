declare module 'ink' {
  import { Context, ReactElement } from 'react'

  /**
   * Components
   */

  /**
   * Box
   */
  interface BoxProps {
    width?: number
    height?: number
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
  declare class Box extends React.Component<BoxProps> {}

  /**
   * Text
   */
  interface TextProps {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
  }
  declare class Text extends React.Component<TextProps> {}

  /**
   * Color
   */
  interface ColorProps {
    hex?: string
    hsl?: number[]
    hsv?: number[]
    hwb?: number[]
    rgb?: number[]
    keyword?: string
    bgHex?: string
    bgHsl?: number[]
    bgHsv?: number[]
    bgHwb?: number[]
    bgRgb?: number[]
    bgKeyword?: string
    dim?: boolean
  }
  declare class Color extends React.Component<ColorProps> {}

  /**
   * Static
   */
  interface StaticProps {}
  declare class Static extends React.Component<StaticProps> {}

  /**
   * Context
   */

  /**
   * StdinContext
   */
  interface StdinContextProps {
    stdin: ReadStream
    setRawMode: (isEnable: boolean) => void
  }
  declare const StdinContext: React.Context<StdinContextProps>

  /**
   * StdoutContext
   */
  interface StdoutContextProps {
    stdout: WriteStream
  }
  declare const StdoutContext: React.Context<StdoutContextProps>

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
  declare function render<P>(
    tree: ReactElement<P>,
    options?: InkRenderOptions,
  ): () => void

  declare interface InkRenderOptions {
    stdout?: WriteStream
    stdin?: ReadStream
    debug?: boolean
  }

  declare function renderToString<P>(tree: ReactElement<P>): string
}
