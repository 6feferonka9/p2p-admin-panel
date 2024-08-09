'use client';

import { styled } from "@linaria/react"
import { Separator } from "@/components/ui/separator"
import { Link } from "@remix-run/react";
import { PaginatedUsers } from "@p2pcoins/api-sdk";
import { SerializeFrom } from "@remix-run/node";

const List = styled('div')`
  display: flex;
  flex-direction: column;
`;

const ListHeader = styled('div')`
  display: grid;
  grid-template-columns: 70px 150px 100px 100px 100px 150px 150px;
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
  grid-template-columns: 70px 150px 100px 100px 100px 150px 150px;
  gap: 1rem;
  padding: .5rem 0;
  border-bottom: 1px solid hsl(214.3 31.8% 91.4%);
`;

const ListRowsItemColumn = styled('div')`
  opacity: .7;
  font-size: 14px;
`;

export function UsersList({ data }: { data: SerializeFrom<PaginatedUsers> }) {
  return (
    <List>
      <ListHeader>
        <ListHeaderItem>ID</ListHeaderItem>
        <ListHeaderItem>Username</ListHeaderItem>
        <ListHeaderItem>Email status</ListHeaderItem>
        <ListHeaderItem>Trades count</ListHeaderItem>
        <ListHeaderItem>Reputation</ListHeaderItem>
        <ListHeaderItem>Last online</ListHeaderItem>
        <ListHeaderItem>Created at</ListHeaderItem>
      </ListHeader>

      <Separator className="mt-2" />

      <ListRows>
        {data.data.map(user => (
          <Link to={`/dashboard/users/${user.id.toString()}`} key={user.id}>
            <ListRowsItem>
              <ListRowsItemColumn>{user.id}</ListRowsItemColumn>
              <ListRowsItemColumn>{user.username}</ListRowsItemColumn>
              <ListRowsItemColumn>{user.emailVerificationStatus}</ListRowsItemColumn>
              <ListRowsItemColumn>{user.tradesCount}</ListRowsItemColumn>
              <ListRowsItemColumn>{Math.trunc((user.reputation / 5) * 100)}%</ListRowsItemColumn>
              <ListRowsItemColumn>{user.lastOnlineAt}</ListRowsItemColumn>
              <ListRowsItemColumn>{user.createdAt}</ListRowsItemColumn>
            </ListRowsItem>
          </Link>
        ))}
      </ListRows>
    </List>
  )
}