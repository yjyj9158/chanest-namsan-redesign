-- 1. 객실 테이블
create table rooms (
  id uuid default gen_random_uuid() primary key,
  room_number text not null unique,
  name text not null,
  name_en text,
  description text,
  description_en text,
  capacity integer default 2,
  is_active boolean default true,
  wifi_ssid text,
  wifi_password text,
  door_code text,
  checkout_time text default '11:00',
  hero_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 현재 운영 중인 301호 등록
insert into rooms (room_number, name, name_en, capacity, checkout_time)
values ('301', '더 채네스트 남산 301', 'The Chanest Namsan 301', 2, '11:00');

-- 2. 투숙 회차 테이블 (게스트별 머무름 단위)
create table stays (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms(id) on delete cascade,
  check_in date,
  check_out date,
  guest_name text,
  guest_email text,
  party_type text check (party_type in ('couple','family','solo','friends','business')),
  status text not null default 'upcoming' check (status in ('upcoming','current','completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. 취향 프리퍼런스 테이블
create table preferences (
  id uuid default gen_random_uuid() primary key,
  stay_id uuid references stays(id) on delete cascade,
  room_id uuid references rooms(id) on delete cascade,
  scent text,
  pillow_firmness text,
  lighting text,
  party_type text,
  temperature text,
  special_request text,
  submitted_at timestamptz default now()
);

-- 4. 기존 테이블에 room_id, stay_id 연결
alter table orders add column room_id uuid references rooms(id);
alter table orders add column stay_id uuid references stays(id);
alter table requests add column room_id uuid references rooms(id);
alter table requests add column stay_id uuid references stays(id);
alter table inventory add column room_id uuid references rooms(id);

-- 기존 데이터를 301호에 연결
update orders set room_id = (select id from rooms where room_number = '301');
update requests set room_id = (select id from rooms where room_number = '301');
update inventory set room_id = (select id from rooms where room_number = '301');

-- 5. Realtime 활성화
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table stays;
alter publication supabase_realtime add table preferences;

-- 6. 게스트/관리자 anon 클라이언트가 읽고 쓸 수 있도록 RLS
alter table rooms enable row level security;
alter table stays enable row level security;
alter table preferences enable row level security;

create policy "rooms_select" on rooms for select using (true);
create policy "rooms_insert" on rooms for insert with check (true);
create policy "rooms_update" on rooms for update using (true) with check (true);
create policy "rooms_delete" on rooms for delete using (true);

create policy "stays_select" on stays for select using (true);
create policy "stays_insert" on stays for insert with check (true);
create policy "stays_update" on stays for update using (true) with check (true);
create policy "stays_delete" on stays for delete using (true);

create policy "preferences_select" on preferences for select using (true);
create policy "preferences_insert" on preferences for insert with check (true);
create policy "preferences_update" on preferences for update using (true) with check (true);
create policy "preferences_delete" on preferences for delete using (true);
