import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { TradesList } from "./list";
import { PaginatedAdminContracts } from "@p2pcoins/api-sdk";
import { SerializeFrom } from "@remix-run/node";
import { useLocation } from "@remix-run/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function TradesListCard({ data }: { data: SerializeFrom<PaginatedAdminContracts> | null }) {
  const location = useLocation();

  function generateParams(page: number) {
    const params = new URLSearchParams(location.search);
    params.set('page', page.toString());
    return '?' + params.toString();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trades</CardTitle>
      </CardHeader>

      <CardContent>
        {data === null && (
          <span>Error loading data</span>
        )}

        {data && <TradesList data={data} />}
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
              trades
            </div>
          </CardFooter>
        </>
      )}

    </Card>
  )
}