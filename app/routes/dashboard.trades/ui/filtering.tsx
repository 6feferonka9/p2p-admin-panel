'use client';

import { DatePickerWithRange } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiatCurrencies } from "@/types/core";
import { Form, Link, useLocation, useNavigation } from "@remix-run/react";
import { TradeStatus } from '@/types/core';

const INPUT_NAMES = {
  contractId: 'contractId',
  username: 'username',
  status: 'status',
  coin: 'coin',
  currency: 'currency',
  sort: 'sort',
}

export function DashboardFiltering({ queryParams }: { queryParams: Record<string, string | undefined> }) {
  const navigation = useNavigation();
  const location = useLocation();

  return (
    <Form key={location.key}>
      <div className="ml-auto flex gap-2">
        <Input type="text" name={INPUT_NAMES.contractId} placeholder="Trade ID" className="w-[150px]" defaultValue={queryParams[INPUT_NAMES.contractId]} />

        <Input type="text" name={INPUT_NAMES.username} placeholder="Username" className="w-[150px]" defaultValue={queryParams[INPUT_NAMES.username]} />

        <Select defaultValue={queryParams[INPUT_NAMES.status]} name={INPUT_NAMES.status}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            {TradeStatus.map(state => (
              <SelectItem value={state} key={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue={queryParams[INPUT_NAMES.coin]} name={INPUT_NAMES.coin}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Coin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BTC">BTC</SelectItem>
            <SelectItem value="XMR">XMR</SelectItem>
            <SelectItem value="ETH">ETH</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue={queryParams[INPUT_NAMES.currency]} name={INPUT_NAMES.currency}>
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(FiatCurrencies).map(item => (
              <SelectItem value={item} key={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DatePickerWithRange defaultFrom={queryParams.dateFrom} defaultTo={queryParams.dateTo} placeholder="Created from - to" />

        <Select name={INPUT_NAMES.sort} defaultValue={queryParams[INPUT_NAMES.sort]}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Newest</SelectItem>
            <SelectItem value="desc">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="mt-3">{navigation.state === "loading" ? 'Loading...' : 'Search'}</Button>
      <Link to="/dashboard/trades"><Button type="submit" className="mt-3 ml-3" variant="outline">Reset</Button></Link>
    </Form>
  )
}
