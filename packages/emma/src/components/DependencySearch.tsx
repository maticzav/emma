import * as React from 'react'
import {
  connectInfiniteHits,
  createInstantSearch,
  connectHits,
} from 'react-instantsearch-core'
import algoliasearch = require('algoliasearch')

export const InstantSearch = createInstantSearch(algoliasearch, {})

export const InfiniteSearch = connectInfiniteHits(
  ({ hits, refine, children }) => {
    return <div>asd</div>
  },
)
