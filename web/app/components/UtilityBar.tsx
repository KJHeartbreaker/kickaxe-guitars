'use client'

import {stegaClean} from 'next-sanity'
import {useSyncExternalStore} from 'react'

import ResolvedLink from '@/app/components/ResolvedLink'
import type {DereferencedLink, Settings, ShopInfo} from '@/sanity/lib/types'
import {telHref} from '@/app/components/shop'

const TIME_ZONE = 'America/Edmonton'

/** Today's weekday in the shop's time zone, as "0" (Sun) to "6" (Sat). */
function shopWeekday(): string {
  const day = new Intl.DateTimeFormat('en-CA', {weekday: 'short', timeZone: TIME_ZONE}).format(new Date())
  return String(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day))
}

const subscribe = () => () => {}

/**
 * The orange strip above the header: today's hours, the address (or the promo
 * bar text when it is switched on) and the phone number.
 *
 * "Today" is worked out in the browser in Calgary time, so a cached page never
 * shows yesterday's hours. Before that runs it shows nothing in that slot.
 */
export default function UtilityBar({
  shopInfo,
  promoBar,
}: {
  shopInfo: ShopInfo | null
  promoBar: Settings['promoBar'] | null
}) {
  const weekday = useSyncExternalStore(subscribe, shopWeekday, () => null)

  const showPromo = Boolean(promoBar?.enabled && promoBar?.text)
  const address = shopInfo?.address
  const phone = shopInfo?.phone

  if (!showPromo && !address && !phone && !shopInfo?.hours?.length) return null

  const today = weekday ? shopInfo?.hours?.find((row) => stegaClean(row.weekdays)?.includes(weekday)) : undefined
  const closedToday = weekday && shopInfo?.hours?.some((row) => row.weekdays?.length) && !today

  return (
    <div className="bg-orange font-mono text-xs tracking-[0.04em] text-ink">
      <div className="wrap flex min-h-9 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2">
        <span className="flex min-w-0 items-center gap-2 font-medium">
          {today && (
            <>
              <span aria-hidden="true" className="inline-block size-2 rounded-full bg-ink" />
              Open today · {stegaClean(today.opens)}–{stegaClean(today.closes)}
            </>
          )}
          {closedToday && 'Closed today'}
        </span>
        {showPromo ? (
          promoBar?.link ? (
            <ResolvedLink link={promoBar.link as DereferencedLink} className="underline underline-offset-2">
              {stegaClean(promoBar.text)}
            </ResolvedLink>
          ) : (
            <span>{stegaClean(promoBar?.text)}</span>
          )
        ) : (
          address && <span className="hidden sm:inline">{stegaClean(address)}</span>
        )}
        {phone && (
          <a href={telHref(phone)} className="font-medium no-underline hover:underline">
            {stegaClean(phone)}
          </a>
        )}
      </div>
    </div>
  )
}
