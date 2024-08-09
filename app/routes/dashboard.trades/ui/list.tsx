import { styled } from "@linaria/react"
import { Separator } from "@/components/ui/separator"
import { Link } from "@remix-run/react";
import { PaginatedAdminContracts, Status } from "@p2pcoins/api-sdk";
import { SerializeFrom } from "@remix-run/node";
import { Badge } from "@/components/ui/badge";

const List = styled('div')`
  display: flex;
  flex-direction: column;
`;

const ListHeader = styled('div')`
  display: grid;
  grid-template-columns: 120px 100px 100px 100px 100px 100px 150px 100px;
  gap: 1rem;
`;

const ListHeaderItem = styled('div')`
  
`;

const ListRows = styled('div')`
  a {
    &:last-of-type {
      div {
        border-bottom: none;
      }
    }
  }
`;

const ListRowsItem = styled('div')`
  display: grid;
  grid-template-columns: 120px 100px 100px 100px 100px 100px 150px 100px;
  gap: 1rem;
  padding: .5rem 0;
  border-bottom: 1px solid hsl(214.3 31.8% 91.4%);
`;

const ListRowsItemColumn = styled('div')`
  opacity: .7;
  font-size: 14px;
`;

function BadgeByStatus(status: Status) {
  switch (status) {
    case 'disputed': {
      return <Badge variant="destructive">{status}</Badge>;
    }
    case 'finished': {
      return <Badge variant="success">{status}</Badge>;
    }
    default: {
      return <Badge variant="outline">{status}</Badge>;
    }
  }
}

export function TradesList({ data }: { data: SerializeFrom<PaginatedAdminContracts> }) {
  return (
    <List>
      <ListHeader>
        <ListHeaderItem>Buyer</ListHeaderItem>
        <ListHeaderItem>Seller</ListHeaderItem>
        <ListHeaderItem>Amount</ListHeaderItem>
        <ListHeaderItem>Value</ListHeaderItem>
        <ListHeaderItem>Coin</ListHeaderItem>
        <ListHeaderItem>Currency</ListHeaderItem>
        <ListHeaderItem>Status</ListHeaderItem>
        <ListHeaderItem>Created at</ListHeaderItem>
      </ListHeader>

      <Separator className="mt-2" />

      <ListRows>
        {data.data.map(trade => (
          <Link to={`/dashboard/trades/${trade.id}`} key={trade.id}>
            <ListRowsItem>
              <ListRowsItemColumn>{trade.buyerUsername}</ListRowsItemColumn>
              <ListRowsItemColumn>{trade.sellerUsername}</ListRowsItemColumn>
              <ListRowsItemColumn>{trade.amount}</ListRowsItemColumn>
              <ListRowsItemColumn>{trade.valueInUsd} USD</ListRowsItemColumn>
              <ListRowsItemColumn>{trade.coin}</ListRowsItemColumn>
              <ListRowsItemColumn>{trade.currency}</ListRowsItemColumn>
              <ListRowsItemColumn>{BadgeByStatus(trade.status)}</ListRowsItemColumn>
              <ListRowsItemColumn>{trade.createdAt}</ListRowsItemColumn>
            </ListRowsItem>
          </Link>
        ))}
      </ListRows>
    </List>
  )
}
