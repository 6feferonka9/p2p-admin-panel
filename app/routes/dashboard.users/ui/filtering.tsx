import { DatePickerWithRange } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, Link, useLocation, useNavigation } from "@remix-run/react";

const INPUT_NAMES = {
  userId: 'userId',
  username: 'username',
  emailVerificationStatus: 'emailVerificationStatus',
  sort: 'sort',
}

export function DashboardFiltering({ queryParams }: { queryParams: Record<string, 'string' | undefined> }) {
  const navigation = useNavigation();
  const location = useLocation();

  return (
    <Form key={location.key}>
      <div className="ml-auto flex gap-2 items-end">
        <DatePickerWithRange defaultFrom={queryParams.dateFrom} defaultTo={queryParams.dateTo} placeholder="Created between" />

        <Input name={INPUT_NAMES.userId} type="text" placeholder="User ID" className="w-[150px]" defaultValue={queryParams[INPUT_NAMES.userId]} />

        <Input name={INPUT_NAMES.username} type="text" placeholder="Username" className="w-[150px]" defaultValue={queryParams[INPUT_NAMES.username]} />

        <Select name={INPUT_NAMES.emailVerificationStatus} defaultValue={queryParams[INPUT_NAMES.emailVerificationStatus]}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Email Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>

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
      <Link to="/dashboard/users"><Button type="submit" className="mt-3 ml-3" variant="outline">Reset</Button></Link>
    </Form>
  )
}
