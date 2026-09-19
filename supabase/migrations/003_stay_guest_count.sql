-- Optional guest count for stay cards (2명 표시)
alter table stays add column if not exists guest_count integer default 2;
