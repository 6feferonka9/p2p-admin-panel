import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { UsersList } from "./list";
import { PaginatedUsers } from "@p2pcoins/api-sdk";
import { SerializeFrom } from '@remix-run/node'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useLocation } from "@remix-run/react";

export function UsersListCard({ data }: { data: SerializeFrom<PaginatedUsers> | null }) {
  const location = useLocation();

  function generateParams(page: number) {
    const params = new URLSearchParams(location.search);
    params.set('page', page.toString());
    return '?' + params.toString();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>

      <CardContent>
        {data === null && (
          <span>Error loading data</span>
        )}

        {data && <UsersList data={data} />}
      </CardContent>

      {data && (
        <>
          <Pagination>
            <PaginationContent>
              {data.hasPreviousPage && (
                <PaginationItem>
                  <PaginationPrevious to={generateParams(data.currentPage - 1)} />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink to={generateParams(1)}>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive to={generateParams(data.currentPage)}>{data.currentPage}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink to={generateParams(data.totalPages)}>{data.totalPages}</PaginationLink>
              </PaginationItem>
              {data.hasNextPage && (
                <PaginationItem>
                  <PaginationNext to={generateParams(data.currentPage + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>

          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{(data.currentPage * 10) - 10}-{data.currentPage * 10}</strong> of <strong>{data.total}</strong>{" "}
              users
            </div>
          </CardFooter>
        </>
      )}

    </Card>
  )
}