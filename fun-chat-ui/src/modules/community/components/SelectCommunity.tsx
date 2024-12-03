import { ChevronDownIcon, SearchIcon } from 'modules/core/components/icons'
import { useDebounce } from 'modules/core/hooks'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import type { ICommunity } from '../types'
import Tippy from '@tippyjs/react/headless'
import { communityServices } from '../services/communityServices'

const CommunitySelectItem = ({ community, onClick }: { community: ICommunity; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="p-2 flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md hover:cursor-pointer"
    >
      <img src={community.picture} alt={community.name} className="h-8 w-8 rounded-full" />
      <div className="flex flex-col items-start">
        <span className="text-sm">{community.name}</span>
        <span className="text-xs text-gray-500">{community.members?.length} members</span>
      </div>
    </div>
  )
}

interface Props {
  onSelectCommunity: (community: ICommunity) => void
  selectedCommunity: ICommunity | null
}

const SelectCommunity: React.FC<Props> = ({ onSelectCommunity, selectedCommunity }) => {
  const [listOfCommunities, setListOfCommunities] = useState<ICommunity[]>([])
  const [searching, setSearching] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [toggleInput, setToggleInput] = useState<boolean>(false)
  const refInput = useRef<HTMLInputElement>(null)

  const debounceSearch = useDebounce(searchValue, 500)

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }, [])

  const handleStartToChooseCommunity = useCallback(() => {
    setToggleInput(true)

    setTimeout(() => {
      const inputEl = refInput.current
      inputEl?.focus()
    }, 0)
  }, [refInput])

  const loadListOfCommunity = useCallback(async (searchTerm: string) => {
    setSearching(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2200))
      const communites = await communityServices.searchCommunity(searchTerm)
      console.log({ communites })
      setListOfCommunities(communites)
    } catch (error) {
      console.log(error)
    } finally {
      setSearching(false)
    }
  }, [])

  const handleInputBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const target = event.target
    console.log({ target })
  }, [])

  useEffect(() => {
    if (!debounceSearch) return
    // visual api call
    loadListOfCommunity(debounceSearch)
  }, [debounceSearch])

  const isShowListOfCommunities = useMemo(() => {
    return searching || !!listOfCommunities.length
  }, [searching, listOfCommunities])

  return (
    <div className="post-select-community-wrapper mb-4">
      <div className="inline-block">
        {toggleInput ? (
          <Tippy
            interactive
            onClickOutside={() => setToggleInput(false)}
            visible={isShowListOfCommunities}
            placement="bottom"
            render={(attrs) => (
              <div className="min-w-80 min-h-20 p-2 bg-white dark:bg-zinc-900 shadow-xl rounded-md w-full" {...attrs}>
                {searching ? (
                  <p>searching...</p>
                ) : (
                  listOfCommunities.map((community) => (
                    <CommunitySelectItem
                      onClick={() => {
                        setToggleInput(false)
                        onSelectCommunity(community)
                      }}
                      key={community._id}
                      community={community}
                    />
                  ))
                )}
              </div>
            )}
          >
            <div className="focus-within:border-blue-500  border-2 flex items-center min-w-80 bg-zinc-200 dark:bg-zinc-900  px-3 rounded-full">
              <SearchIcon />
              <input
                ref={refInput}
                value={searchValue}
                onChange={handleChange}
                onBlur={handleInputBlur}
                type="text"
                placeholder="Select a community"
                className="outline-none bg-zinc-200 dark:bg-zinc-900 px-2 py-2"
              />
            </div>
          </Tippy>
        ) : (
          <button
            className="flex items-center py-2 px-3 bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-700/80 hover:bg-slate-300 rounded-full"
            onClick={handleStartToChooseCommunity}
          >
            {selectedCommunity ? (
              <>
                <img src={selectedCommunity?.picture} alt={selectedCommunity?.name} className="h-6 w-6 rounded-full" />
                <span className="mx-2 font-semibold text-sm">{selectedCommunity?.name}</span>
                <ChevronDownIcon />
              </>
            ) : (
              <>
                <span className="font-semibold text-sm mr-2">Select a community</span>
                <ChevronDownIcon />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default SelectCommunity
