-- WM 업무 대시보드 초기 스키마
-- 접근 제어 없음: 서버는 service role key로만 접근하므로 RLS는 활성화하되 정책은 만들지 않는다(default-deny).

create extension if not exists "pgcrypto";

create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meeting_type text not null check (meeting_type in ('고객상담', '내부미팅', '상품교육', '세미나')),
  date date not null,
  time time,
  participants text,
  purpose text,
  preparation text,
  questions text,
  key_points text,
  decisions text,
  notes text,
  follow_up text,
  learnings text,
  topic_tags text[] default '{}',
  linked_event_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  requester text,
  task_type text not null check (task_type in ('Client', 'Product', 'Market', 'Follow-up', 'Internal')),
  due_date date,
  priority text check (priority in ('High', 'Medium', 'Low')),
  status text not null default 'Not Started' check (status in ('Not Started', 'In Progress', 'Done')),
  checklist jsonb not null default '[]',
  memo text,
  topic_tags text[] default '{}',
  source_quick_note_id uuid,
  source_meeting_id uuid references meetings(id) on delete set null,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists playbook (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('금융상품', '계좌·세금', '시장', '상담', '업무프로세스')),
  subcategory text,
  keywords text[] default '{}',
  content text not null,
  source text,
  source_meeting_id uuid references meetings(id) on delete set null,
  source_quick_note_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quick_notes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  tag text check (tag in ('고객질문', '상품', '시장', '상담', '확인필요', '기타')),
  linked_task_id uuid references tasks(id) on delete set null,
  linked_playbook_id uuid references playbook(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  time time,
  location text,
  event_type text not null check (event_type in ('고객상담', '고객Follow-up', '내부미팅', '상품교육', '세미나', '기타')),
  description text,
  linked_meeting_id uuid references meetings(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  week_start date not null unique,
  week_end date not null,
  learnings text,
  difficulties text,
  further_study text,
  improvements text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table tasks
  add constraint tasks_source_quick_note_id_fkey
  foreign key (source_quick_note_id) references quick_notes(id) on delete set null;

alter table playbook
  add constraint playbook_source_quick_note_id_fkey
  foreign key (source_quick_note_id) references quick_notes(id) on delete set null;

alter table meetings
  add constraint meetings_linked_event_id_fkey
  foreign key (linked_event_id) references events(id) on delete set null;

alter table tasks enable row level security;
alter table quick_notes enable row level security;
alter table events enable row level security;
alter table meetings enable row level security;
alter table playbook enable row level security;
alter table weekly_reviews enable row level security;
